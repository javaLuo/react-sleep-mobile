/* 支付方式 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import reqwest from 'reqwest';
import Config from '../../../../config';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button, List, Radio, Toast, Modal } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { getAllPayTypes, wxPay, wxInit } from '../../../../a_action/shop-action';
import { saveWxCode } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const RadioItem = Radio.RadioItem;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        payType: this.props.allPayTypes[0] ? this.props.allPayTypes[0].id : 0, // 支付方式
        wxReady: false, // 微信支付是否初始化成功
        modalShow: false,   // 等待用户操作的弹窗是否显示
        appID: 'wx57f6ee39cbea7654', //'wx57f6ee39cbea7654',  // 公众号appID 测试号：wx33956348b0093a1d
       // appSecret: '178fc2cd5c27a28d13fda4b015a8b72c',          // 密钥
        redirect_uri: encodeURIComponent(`${Config.baseURL}#/jump`),   // 授权回跳地址
        wx_code: '',    // 网页授权第一步获取到的code
    };
  }

  componentWillMount() {
      // 如果没有选择商品就跳转到商城主页
      if (!this.props.orderParams || !this.props.orderParams.nowProduct) {
          Toast.fail('您没有选择商品');
         // this.props.history.replace('/shop');
      }
      this.getOpenId(); // 授权获取openID
  }
  componentDidMount() {
      // 如果没有获取过支付方式，就重新获取
      if (!this.props.allPayTypes.length) {
          this.getAllPayTypes();
      }
  }
    // 获取所有的支付方式
    getAllPayTypes() {
      this.props.actions.getAllPayTypes().then((res) => {
          if (res.status === 200) {
              this.setState({
                  payType: res.data.result[0].id || null,
              });
          }
      });
    }
    // 获取支付所需参数
    initWeiXinPay() {
      // 后台需要给个接口，返回appID,timestamp,nonceStr,signature
      // 然后调用
        this.props.actions.wxInit().then((res) => {
            if (res.status === 200) {
                console.log('res是什么：', res);
                this.initWxConfig(res.data);
            } else {
                Toast.fail('wxInit fail');
            }
        });

    }

    // 初始化微信JS-SDK
    initWxConfig(data) {
      console.log('DATA是个啥2', data);
      const me = this;
      if(typeof wx === 'undefined') {
          console.log('weixin sdk load failed!');
          return false;
      }
      wx.config({
          debug: false,
          appId: this.state.appID,
          timestamp: data.timeStamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: [
              'chooseWXPay'
          ]
      });
      wx.ready(() => {
          me.setState({
              wxReady: true,
          });
          Toast.success('初始化成功');
          console.log('微信JS-SDK初始化成功');
      });
      wx.error((e) => {
          console.log('微信JS-SDK初始化失败：', e);
          Toast.success('初始化失败');
      });
    }

    // 选择支付方式时触发
    onChange(type) {
      this.setState({
          payType: type,
      });
    }

    // 支付Modal关闭
    onModalClose() {
      this.setState({
          modalShow: false,
      });
    }

    // 网页授权 - 获取openID
    getOpenId() {
      if (this.props.wxCode) {    // 已经经过了授权第1步
          this.initWeiXinPay(); // 页面授权完成，开始初始化JS-SDK
      } else {  // 没有经过第1步，就跳转开始第1步
        location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.appID}&redirect_uri=${this.state.redirect_uri}&response_type=code&scope=snsapi_base&state=0#wechat_redirect `;
      }
    }

    // 支付
    onSubmit() {
        if (!this.state.wxReady) {
            Toast.loading('正在初始化', 1);
            return false;
        }
        this.onPay();
    }

    // 开始统一下单预支付，调用后台的支付接口
    onPay(){
        Toast.loading('正在发起支付');
        console.log('此时的code是什么：', this.state.code);
        this.props.actions.wxPay({
            body: 'yimaokeji-card',                         // 商品描述
            total_fee: 1,                                 // 总价格（分）
            spbill_create_ip: returnCitySN["cip"],        // 用户终端IP，通过腾讯服务拿的
            out_trade_no: `${new Date().getTime()}`,      // 商户订单号，通过后台生成订单接口获取
            code:this.state.wx_code                       // 授权code, 后台为了拿openid
        }).then((res) => {
            console.log('统一下单返回：', res);
            if(res.status === 200) {
                this.onPay2(res.data);
                Toast.hide();
            } else {
                Toast.fail('失败：预支付调用失败', 1.2);
            }
        }).catch(() => {
            Toast.fail('失败：预支付调用报错', 1.2);
        });
    }

    // 真正的开始支付
    onPay2(data) {
        this.setState({
            modalShow: true,
        });
        wx.chooseWXPay({
            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: data.noncestr, // 支付签名随机串，不长于 32 位
            package: data.prepayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paysign,  // 支付签名
            success: function (res) {
                console.log('支付成功：', res);
            }
        });
    }
  render() {
    return (
      <div className="flex-auto page-box confirm-pay" style={{ display: this.state.wxReady ? 'block' : 'none' }}>
          <List>
              {this.props.allPayTypes.map((item, index) => {
                  return <RadioItem key={index} checked={this.state.payType === item.id} onChange={() => this.onChange(item.id)}>{item.dicValue}</RadioItem>;
              })}
          </List>
          <div className="thefooter page-flex-row">
              <div className="flex-none" style={{ textAlign: 'center', width: '100%' }} onClick={() => this.onSubmit()}>确认支付 ￥{this.props.orderParams.params.fee}</div>
          </div>
          <Modal
              visible={this.state.modalShow}
              transparent
              maskClosable={false}
              onClose={() => this.onModalClose()}
              title="是否已成功支付？"
          >
              <div style={{ padding: '.2rem' }}>
                  <Button type="primary">已成功付款</Button>
                  <br/>
                  <Button ghost type="warning">付款遇到问题</Button>
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
    wxCode: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allPayTypes: state.shop.allPayTypes,
      orderParams: state.shop.orderParams,
      wxCode: state.app.wxCode,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getAllPayTypes, wxPay, wxInit, saveWxCode }, dispatch),
  })
)(HomePageContainer);
