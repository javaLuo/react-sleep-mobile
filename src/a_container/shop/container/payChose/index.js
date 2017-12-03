/* 支付方式 */

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
import { Button, List, Radio, Toast, Modal } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { getAllPayTypes } from '../../../../a_action/shop-action';

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
      // 如果没有获取过支付方式，就重新获取
      if (!this.props.allPayTypes.length) {
          this.getAllPayTypes();
      }
      this.initWxConfig();
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
      // 然后调用initWxConfig()
    }

    // 初始化微信JS-SDK
    initWxConfig() {
      const me = this;
      if(typeof wx === 'undefined') {
          console.log('weixin sdk load failed!');
          return false;
      }
      console.log('到这里了');
      wx.config({
          debug: false,
          appID: 'wx57f6ee39cbea7654',
          timestamp: new Date().getTime(),
          nonceStr: 'asfasdfsd',
          signature: 'afdasdf',
          jsApiList: [
              'chooseWXPay'
          ]
      });
      wx.ready(() => {
          me.setState({
              wxReady: true,
          });
      });
      wx.error((e) => {
          console.log('微信JS-SDK初始化失败：', e);
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
    // 支付
    onSubmit() {
      if (!this.state.wxReady) {
          Toast.loading('正在初始化', 1);
          //return false;
      }
      this.setState({
          modalShow: true,
      });
        wx.chooseWXPay({
            timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: '', // 支付签名随机串，不长于 32 位
            package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: '',  // 支付签名
            success: function (res) {
                console.log('支付成功：', res);
            }
        });
    }

  render() {
    return (
      <div className="flex-auto page-box confirm-pay">
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
    actions: bindActionCreators({ getAllPayTypes }, dispatch),
  })
)(HomePageContainer);
