/* 微信支付页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Toast } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { wxPay, wxInit } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        wxReady: false, // 微信支付是否初始化成功
        modalShow: false,   // 等待用户操作的弹窗是否显示
        wx_code: '',    // 网页授权第一步获取到的code
    };
  }

  componentWillMount() {
      // 如果没有选择商品就跳转到商城主页
      if (!this.props.orderParams || !this.props.orderParams.nowProduct) {
          Toast.fail('您没有选择商品');
         // this.props.history.replace('/shop');
      }
  }
  componentDidMount() {
      Toast.loading('请稍后');
      this.startPay().then((res) => {
          if (!res) {
              Toast.fail('支付失败');
              this.props.history.push('/my/order');
          } else {
              // 支付成功后需要更新当前订单的状态：支付方式，状态位已支付
              Toast.success('支付成功');
              this.props.history.push('/my/order');
          }
      });
  }

   componentWillUnmount() {
      sessionStorage.removeItem('wx_code');
  }

  async startPay() {
      try {
          const s1 = await this.props.actions.wxInit(); // 向后台获取timestamp,nonceStr,signature等微信JS-SDK初始化所需参数
          if(s1.status !== 200) { return false; }
          const s2 = await this.initWxConfig(s1.data);  // 初始化js-sdk
          if (!s2) { return false; }
          const s3 = this.props.actions.wxPay({         // 向后台发起统一下单请求
              body: 'yimaokeji-card',                       // 商品描述
              total_fee: 1,                                 // 总价格（分）
              spbill_create_ip: returnCitySN["cip"],        // 用户终端IP，通过腾讯服务拿的
              out_trade_no: `${new Date().getTime()}`,      // 商户订单号，通过后台生成订单接口获取
              code: sessionStorage.getItem('wx_code'),       // 授权code, 后台为了拿openid
          });
          if(s3.status !== 200) { return false; }
          Toast.hide();
          const s4 = this.onPay(s3.data);                   // 调起微信支付控件
          return s4;
      }catch(e) {
          return false;
      }
  }

    // 初始化微信JS-SDK
    initWxConfig(data) {
      console.log('DATA是个啥2', data);
      return new Promise((res, rej) => {
          if(typeof wx === 'undefined') {
              res(false);
          }
          wx.config({
              debug: true,
              appId: this.state.appID,
              timestamp: data.timestamp,
              nonceStr: data.noncestr,
              signature: data.signature,
              jsApiList: [
                  'chooseWXPay'
              ]
          });
          wx.ready(() => {
              Toast.success('初始化完毕');
              console.log('微信JS-SDK初始化成功');
              res(true);
          });
      });
    }

    // 真正的开始支付
    onPay(data) {
        const me = this;
        this.setState({
            modalShow: true,
        });
        return new Promise((res, rej) => {
            wx.chooseWXPay({
                timestamp: data.timeStamp || data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr || data.noncestr, // 支付签名随机串，不长于 32 位
                package: data.packageName || data.packagename, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: data.signType || data.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign || data.paysign,  // 支付签名
                success: function (msg) {
                    console.log('支付流程完结：', msg);
                    res(msg);
                }
            });
        });

    }

    // 支付Modal关闭
    onModalClose() {
      this.setState({
          modalShow: false,
      });
    }

  render() {
    return (
      <div className="flex-auto page-box confirm-pay">
          <span>5分钟内支付有效</span>
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
    actions: bindActionCreators({ getAllPayTypes, wxPay, wxInit }, dispatch),
  })
)(HomePageContainer);
