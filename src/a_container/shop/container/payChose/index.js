/* 支付页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import Config from '../../../../config';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import tools from '../../../../util/all';
import { Button, List, Radio, Toast, Modal } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { getAllPayTypes, wxPay, wxInit } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const RadioItem = Radio.RadioItem;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        payTypes: [],   // 所有的支付方式
        payType: 'wxpay', // 支付方式
    };
  }

  componentWillMount() {
      // 如果没有选择商品就跳转到商城主页
      // if (!this.props.orderParams || !this.props.orderParams.nowProduct) {
      //     Toast.fail('您没有选择商品');
      //    this.props.history.replace('/');
      // }
      if (!this.getPayInfo()){
          Toast.fail('未获取到订单信息!');
          this.props.history.go(-1);
      }
  }
  componentDidMount() {
      // 如果没有获取过支付方式，就重新获取
      console.log('回跳地址是什么；', Config.redirect_uri);
      if (!this.props.allPayTypes.length) {
          this.getAllPayTypes();
      }
  }

   componentWillUnmount() {
      sessionStorage.removeItem('wx_code');
  }

    // 获取所有的支付方式
    getAllPayTypes() {
      this.props.actions.getAllPayTypes().then((res) => {
          if (res.status === 200) {
              this.setState({
                  payTypes: res.data.result[0],
              });
          }
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

    getPayInfo() {
        // 获取订单信息
        let pay = sessionStorage.getItem('pay-info');
        if (!pay) {
            Toast.fail('未获取到订单信息');
            return false;
        } else {
            pay = JSON.parse(pay);
            console.log('当前订单信息：', pay);
            return pay;
        }
    }

    // 支付
    onSubmit() {
        if(this.state.payType === 'wxpay') {    // 选择的微信支付
            if (tools.isWeixin()) { // 是微信浏览器中打开的，执行公众号支付
                location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${Config.appId}&redirect_uri=${Config.redirect_uri}&response_type=code&scope=snsapi_base&state=0#wechat_redirect `;
            } else { // 其他浏览器打开的，不需要获取网页授权
                this.props.history.push('/shop/pay');
            }
        } else if(this.state.payType === 'alipay'){ // 支付宝支付

            const payInfo = this.getPayInfo();
            if (!payInfo) {
                Toast.fail('未获取到订单信息,请重试');
                return false;
            }
            console.log('订单是什么：', payInfo);
            /**
             * 说明
             * 有两种付款的途径
             * 1.正常选择商品直接付款，程序收集了商品相关信息，订单信息不带商品信息
             * 2.从我的订单跳转付款，程序没有商品相关信息，订单信息中带有商品信息
             * **/
            location.href = `http://hra.yimaokeji.com/mall/alipay/tradewap?orderId=${payInfo.id}&subject=${this.props.orderParams.nowProduct ? this.props.orderParams.nowProduct.name : payInfo.product.name}&totalAmount=${payInfo.fee}`;
        }
    }

  render() {
    return (
      <div className="flex-auto page-box confirm-pay">
          <List>
              <RadioItem key="wxpay" checked={this.state.payType === 'wxpay'} onChange={() => this.onChange('wxpay')}>微信支付</RadioItem>
              {
                  tools.isWeixin() ? null : <RadioItem key="alipay" checked={this.state.payType === 'alipay'} onChange={() => this.onChange('alipay')}>支付宝支付</RadioItem>
              }
          </List>
          <div className="thefooter page-flex-row">
              <div className="flex-none" style={{ textAlign: 'center', width: '100%' }} onClick={() => this.onSubmit()}>确认支付 ￥{this.props.orderParams.params.fee}</div>
          </div>
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
