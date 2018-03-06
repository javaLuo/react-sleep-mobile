/* 支付页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import QRCode from 'qrcode';
import Config from '../../../../config';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import tools from '../../../../util/all';
import { Button, List, Radio, Toast, Modal } from 'antd-mobile';
import ImgWeiXin from '../../../../assets/weixin@3x.png';
import ImgZhiFuBao from '../../../../assets/zhifubao@3x.png';
// ==================
// 本页面所需action
// ==================

import { getAllPayTypes, wxPay, wxPay2, wxInit, payResultNeed } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
const RadioItem = Radio.RadioItem;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        payType: 'wxpay',    // 支付方式 wxpay微信支付（公众号或H5）、alipay支付宝网页支付
        wxReady: true,      // 默认微信JS-SDK是OK的，因为无论对错，wx.ready都会被触发
        pay_info: {},       // 订单信息
        pay_obj: {},        // 商品信息
        modalShow: false,   // 是否显示操作提示框
        loading: false, // 是否正在支付中
        qrcode: '',     // 二维码支付时获取到的二维码内容
        qrdata: '',
        qrmodelShow: false, // 二维码模态框是否显示
    };
    this.s3data = null;      // 统一下单请求返回的数据
    this.s3data2 = null;    // 统一下单请求（二维码支付）返回的数据
  }

  componentWillMount() {
      if (!this.getPayInfo()){
          /**
           * 没有订单信息，可能是支付完成后IOS中自动打开的网页回调
           * IOS的微信H5支付中，会打开一个新回跳页面，要处理一下
           * 是safari、不是安卓、不是微信、无回跳标识
           * **/
          const pageStart = sessionStorage.getItem('pay-start');
          if (tools.isSafari() && !tools.isAndroid() && !tools.isWeixin() && !pageStart) {
              location.href = 'com.myapp://';
          } else {
              this.props.history.replace('/my/order');  // 没有订单信息，直接进入我的订单
          }
      }
      this.getObjInfo();
  }

  componentDidMount() {
      document.title = '订单支付';
      const pageStart = sessionStorage.getItem('pay-start');
      if (pageStart) {  // 支付回跳标识，说明是支付宝或微信H5支付流程回跳到此页面
          this.setState({
              modalShow: true,
          });
      }
  }

  componentWillUnmount() {

  }

    // 选择支付方式时触发
    onChange(type) {
      this.setState({
          payType: type,
      });
    }

    // qrcode模态框关闭
    onCloseQrCode() {
      this.setState({
          qrmodelShow: false,
      });
    }

    /**
     * 工具 - 获取订单信息
     * 1.由产品选取、下单接口返回的数据而来
     * 2.由我的订单页面，点击付款，将订单数据保存到sessionStorage而来
     * **/
    getPayInfo() {
        let pay = sessionStorage.getItem('pay-info');
        if (!pay) {
            return false;
        } else {
            pay = JSON.parse(pay);
            this.setState({
                pay_info: pay,
            });
            console.log('当前订单信息：', pay);
            return pay;
        }
    }

    /**
     * 工具 - 获取商品信息
     * **/
    getObjInfo() {
        let obj = sessionStorage.getItem('pay-obj');
        if (!obj) {
            return false;
        } else {
            obj = JSON.parse(obj);
            this.setState({
                pay_obj: obj,
            });
            console.log('当前商品信息：', obj);
            return obj;
        }
    }

    /**
     * 初始化微信JS-SDK
     * 用于微信公众号支付 和 微信H5支付
     * **/
    initWxConfig(data) {
        const me = this;
        console.log('DATA是个啥2', data);
        return new Promise((res, rej) => {
            if(typeof wx === 'undefined') {
                res(false);
            }
            wx.config({
                debug: false,
                appId: Config.appId,
                timestamp: data.timestamp,
                nonceStr: data.noncestr,
                signature: data.signature,
                jsApiList: [
                    'chooseWXPay'
                ]
            });
            wx.ready(() => {
                console.log('微信JS-SDK初始化成功');
                res(true);
            });
            wx.error(() => {    // js-sdk初始化失败
                me.setState({
                    wxReady: false,
                });
            });
        });
    }

    /**
     * （公众号支付专用）微信公众号支付 前导准备工作
     * 1. 向后台获取用于JS-SDK初始化的参数
     * 2. 初始化JS-SDK
     * 3. 向后台发起统一下单请求
     * 4. 将统一下单获取的数据存入this.s3data
     * **/
    async startPay() {
        try {
            const s1 = await this.props.actions.wxInit();             // 1. 向后台获取timestamp,nonceStr,signature等微信JS-SDK初始化所需参数
            console.log('第1：获取wxInit：', s1);
            if(s1.status !== 200) { return false; }
            const s2 = await this.initWxConfig(s1.data);              // 2. 初始化js-sdk
            console.log('第2：初始化js-sdk：', s2);
            if (!s2) { return false; }

            const s3 = await this.props.actions.wxPay({               // 3. 向后台发起统一下单请求
                body: 'yimaokeji-card',                                 // 商品描述
                total_fee: Number(this.state.pay_info.fee * 100) || 0 , // 总价格（分）
                spbill_create_ip: (typeof returnCitySN !== 'undefined') ? returnCitySN["cip"] : '',                  // 用户终端IP，通过腾讯服务拿的
                out_trade_no: this.state.pay_info.id ? String(this.state.pay_info.id) : `${new Date().getTime()}`,      // 商户订单号，通过后台生成订单接口获取
                code: null,                                             // 授权code, 后台为了拿openid
                trade_type: 'JSAPI',
            });
            console.log('第3：统一下单返回：', s3);
            if(s3.status !== 200) { return false; }
            Toast.hide();
            this.s3data = s3.data;
            return true;
        }catch(e) {
            return false;
        }
    }

    /**
     * 微信支付
     * 后台返回支付二维码
     * **/
    async startPay2() {
        try {
            const s1 = await this.props.actions.wxInit();             // 1. 向后台获取timestamp,nonceStr,signature等微信JS-SDK初始化所需参数
            console.log('第1：获取wxInit：', s1);
            if(s1.status !== 200) { return false; }
            const s2 = await this.initWxConfig(s1.data);              // 2. 初始化js-sdk
            console.log('第2：初始化js-sdk：', s2);
            if (!s2) { return false; }

            // const s3 = await this.props.actions.wxPay2({               // 3. 向后台发起统一下单请求
            //     orderId: String(this.state.pay_info.id),      // 商户订单号，通过后台生成订单接口获取
            // });
            const s3 = await this.props.actions.wxPay({               // 3. 向后台发起统一下单请求
                body: 'yimaokeji-card',                                 // 商品描述
                total_fee: Number(this.state.pay_info.fee * 100) || 0 , // 总价格（分）
                spbill_create_ip: (typeof returnCitySN !== 'undefined') ? returnCitySN["cip"] : '',                  // 用户终端IP，通过腾讯服务拿的
                out_trade_no: this.state.pay_info.id ? String(this.state.pay_info.id) : `${new Date().getTime()}`,      // 商户订单号，通过后台生成订单接口获取
                code: null,                                             // 授权code, 后台为了拿openid
                trade_type: 'NATIVE',
            });
            console.log('第3：统一下单返回：', s3);
            if(s3.status !== 200) { return false; }
            Toast.hide();
            this.s3data2 = s3.data;
            return true;
        }catch(e) {
            return false;
        }
    }

    /**
     * (公众号支付专用) 真正的调起微信支付原生控件，等待用户操作
     * **/
    onWxPay(data) {
        return new Promise((res, rej) => {
            try{
                wx.chooseWXPay({
                    appId: Config.appId,
                    timestamp: data.timeStamp || data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr || data.noncestr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType || data.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign || data.paysign,  // 支付签名
                    success: (msg) => {
                        console.log('支付流程完结：', msg);
                        res(msg);
                    },
                    cancel: (msg) => {
                        console.log('支付流程取消：', msg);
                        res(msg);
                    },
                    error:(msg) => {
                        console.log('支付流程错误：', msg);
                        res(msg);
                    }
                });
            } catch(err) {
                rej(err);
            }
        });
    }

    /**
     * 微信H5支付专用
     * 1.直接发起统一下单请求
     * 2.后台会收到微信返回的信息，其中带有MWEB_URL （H5支付中间页），需要跳转到这个页面（前端跳）
     * 3.用户在中间页进行操作支付，微信会返回给后台最终结果
     * **/
    wxH5Pay() {
        sessionStorage.setItem('pay-start', 1);   // 页面跳转，标识是支付的过程中返回到此页面
        this.props.actions.wxPay({               // 3. 向后台发起统一下单请求
            body: 'yimaokeji-card',                                 // 商品描述
            total_fee: Number(this.state.pay_info.fee * 100) || 1 , // 总价格（分）
            spbill_create_ip: typeof returnCitySN !== 'undefined' ? returnCitySN["cip"] : '',                  // 用户终端IP，通过腾讯服务拿的
            out_trade_no: this.state.pay_info.id ? String(this.state.pay_info.id) : `${new Date().getTime()}`,      // 商户订单号，通过后台生成订单接口获取
            code: null,                                             // 授权code, 后台为了拿openid
            trade_type: 'MWEB',
        }).then((res) => {
            /**                                                                                                                                                                                                                                                                                          /
             * 返回的数据中，应该有一个mweb_url，跳转至此地址，需要设置回跳地址，保存个参数表示是H5回跳的
             * **/
            console.log('H5支付统一下单返回值：', res);
            if (res.status === 200) {
                location.assign(`${res.data}&redirect_url=${encodeURIComponent(Config.baseURL + '/gzh/#/shop/paychose')}`);
                // ${encodeURIComponent(Config.baseURL + '/gzh/#/shop/paychose')}
            }
        }).catch(() => {
            Toast.fail('支付失败，请重试',1);
        });
    }

    /**
     * 支付按钮被点击
     * 微信公众号支付 - 现在页面中能获取到openID, 不需要跳转授权，直接在这个页面进行微信支付，进行支付无页面跳转
     * H5支付 - 不需要openID, 直接在这个页面支付，进行支付时会有页面跳转
     * 支付宝支付 - 直接跳转页面
     *
     * 支付所需的参数均存放在sessionStorage中
     * **/
    onSubmit() {
        const payInfo = this.state.pay_info;
        if (!payInfo) {
            Toast.fail('未获取到订单信息,请重试',1);
            return false;
        }
        if (this.state.loading) {
            return false;
        }
        this.setState({
            loading: true,
        });
        if(this.state.payType === 'wxpay') {    /** 选择的微信支付 **/
            if (tools.isWeixin()) {             /** 是微信浏览器中打开的，执行公众号支付 **/
                if (this.s3data) {              // 已经获取过统一下单了，直接调起支付就行 （即用户取消支付、支付失败后，重新点击支付）
                    this.onWxPay(this.s3data).then((msg) => {
                        this.payResult(msg);
                    });
                } else {                        // 没有发起过统一下单，需重头开始，初始化JS-SDK什么的
                    this.startPay().then((res) => {
                        if (res) {
                            this.onWxPay(this.s3data).then((msg) => {
                                this.payResult(msg);
                            });
                        } else {
                            Toast.fail('支付遇到错误，请重试.',1);
                            this.returnPage();
                        }
                    }).catch(() => {
                        Toast.fail('支付遇到错误，请重试..',1);
                        this.returnPage();
                    });
                }
                // location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${Config.appId}&redirect_uri=${Config.redirect_uri}&response_type=code&scope=snsapi_base&state=0#wechat_redirect `;
            } else {                            /** 普通浏览器、原生APP中发起支付， 使用微信H5支付 **/
                // this.props.history.push('/shop/pay');
                this.wxH5Pay();
            }
        } else if (this.state.payType === 'wxpay2') {
            if (tools.isWeixin()) {             /** 是微信浏览器中打开的，请求支付二维码 **/
                if (this.s3data2) {              // 已经获取过统一下单了，直接调起支付就行 （即用户取消支付、支付失败后，重新点击支付）
                    this.getQRCode(this.s3data2);
                } else {                        // 没有发起过统一下单，需重头开始，初始化JS-SDK什么的
                    this.startPay2().then((res) => {
                        if (res) {
                            this.getQRCode(this.s3data2);
                        } else {
                            Toast.fail('支付遇到错误，请重试.',1);
                            this.returnPage();
                        }
                    }).catch(() => {
                        Toast.fail('支付遇到错误，请重试..',1);
                        this.returnPage();
                    });
                }
                // location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${Config.appId}&redirect_uri=${Config.redirect_uri}&response_type=code&scope=snsapi_base&state=0#wechat_redirect `;
            } else {                            /** 普通浏览器、原生APP中发起支付， 使用微信H5支付 **/
            // this.props.history.push('/shop/pay');
            this.wxH5Pay();
            }
        } else if(this.state.payType === 'alipay'){ /** 选择的支付宝支付 **/
            /**
             * 说明
             * 有两种付款的途径
             * 1.正常选择商品直接付款，程序收集了商品相关信息，订单信息不带商品信息
             * 2.从我的订单跳转付款，程序没有商品相关信息，订单信息中带有商品信息
             * **/
            sessionStorage.setItem('pay-start', 1);   // 页面跳转，标识是支付的过程中返回到此页面
            location.assign(`${Config.baseURL}/mall/alipay/tradewap?orderId=${payInfo.id}&subject=${this.props.orderParams.nowProduct ? this.props.orderParams.nowProduct.name : payInfo.product.name}&totalAmount=${payInfo.fee}`);
        }
    }

    async getQRCode(data) {
        const res = await  QRCode.toDataURL(data);
        console.log('生成出来了没有：', res);
        location.href = data;
        this.setState({
            qrcode: res,
            qrdata: data,
            qrmodelShow: true
        });
        return res;
    }

    /**
     * (公众号支付专用)
     * 支付结果处理
     * **/
    payResult(msg) {
        if (!msg) {
            Toast.fail('支付失败, 请重试',1);
            this.returnPage();
        } else if (msg.errMsg === 'chooseWXPay:ok') {     // 支付成功
            // 支付成功后在后台添加对应数量的评估卡 (现在由后台自动生成)
            // this.makeCards();
            Toast.success('支付成功',1);
            this.successReturn();
        } else if (msg.errMsg === 'chooseWXPay:cancel'){
            // 支付被取消
            this.returnPage();
        } else {  // 支付遇到错误
            Toast.fail('支付失败, 请重试',1);
            this.returnPage();
        }
    }

    /**
     * 支付失败或出错时，自动离开此页
     * **/
    returnPage() {
        sessionStorage.removeItem('pay-obj');
        sessionStorage.removeItem('pay-info');
        sessionStorage.removeItem('pay-start');   // 清除支付回跳标识
        this.props.history.replace('/my/order');
    }

    /**
     * 支付成功时，跳转到成功页
     * **/
    successReturn() {
        sessionStorage.removeItem('pay-obj');
        sessionStorage.removeItem('pay-info');
        sessionStorage.removeItem('pay-start');   // 清除支付回跳标识
        /**
         * 支付流程完成，跳转到结果页
         * 参数1：成功后生成的卡片信息，现在由后台生成，获取不到
         * 参数2：当前的订单信息
         * **/
        this.props.actions.payResultNeed({}, this.state.pay_info);
        setTimeout(() => this.props.history.replace('/shop/payresult'), 16);
    }

  render() {
    return (
      <div className="flex-auto page-box pay-chose">
          <List className="product-list">
              <Item
                  thumb={(this.state.pay_obj.nowProduct && this.state.pay_obj.nowProduct.productImg) ? <img src={this.state.pay_obj.nowProduct.productImg.split(',')[0]} /> : null}
                  multipleLine
              >
                  {this.state.pay_obj.nowProduct ? this.state.pay_obj.nowProduct.name : '--'}<Brief>数量：{this.state.pay_obj.nowProduct ? this.state.pay_info.count : '--'}</Brief>
              </Item>
          </List>
          <List style={{ marginTop: '.2rem' }}>
              <RadioItem key="wxpay" thumb={<img  src={ImgWeiXin} />} checked={this.state.payType === 'wxpay'} onChange={() => this.onChange('wxpay')}>微信支付</RadioItem>
              {
                  tools.isWeixin() ? null : <RadioItem key="alipay" thumb={<img  src={ImgZhiFuBao} />} checked={this.state.payType === 'alipay'} onChange={() => this.onChange('alipay')}>支付宝支付</RadioItem>
              }
              {/*<RadioItem key="wxpay2" thumb={<img  src={ImgWeiXin} />} checked={this.state.payType === 'wxpay2'} onChange={() => this.onChange('wxpay2')}>微信扫码支付</RadioItem>*/}
          </List>
          <div className="thefooter page-flex-row">
              <Button loading={this.state.loading} type="primary" onClick={() => this.onSubmit()}>{this.state.loading ? <span>支付中 ￥{this.state.pay_info.fee}</span> : <span>确认支付 ￥{this.state.pay_info.fee}</span>}</Button>

          </div>
          {/** 支付结果 点成功跳到结果页，点遇到问题跳到订单页 **/}
          <Modal
              visible={this.state.modalShow}
              transparent
              className="pay-modal"
              maskClosable={false}
              title="支付结果"
          >
              <div className="box">
                  <Button type="primary" onClick={() => this.successReturn()}>已完成支付</Button>
                  <Button type="warning" onClick={() => this.returnPage()}>支付遇到问题</Button>
              </div>
          </Modal>
          {/** 展示支付二维码 **/}
          <Modal
              visible={this.state.qrmodelShow}
              transparent
              maskClosable={false}
              onClose={() => this.onCloseQrCode()}
              title="支付二维码"
              footer={[{ text: '支付遇到问题', onPress: () => this.returnPage() }, { text: '支付成功', onPress: () => this.successReturn() }]}
          >
              <div className="pay-qrcode">
                  <img src={this.state.qrcode} />
                  {this.state.qrcode ? <a href={this.state.qrdata}>点我支付</a> : null}
              </div>
          </Modal>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  orderParams: P.any,
  allPayTypes: P.array,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allPayTypes: state.shop.allPayTypes,
      orderParams: state.shop.orderParams,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getAllPayTypes, wxPay, wxPay2, wxInit, payResultNeed }, dispatch),
  })
)(HomePageContainer);
