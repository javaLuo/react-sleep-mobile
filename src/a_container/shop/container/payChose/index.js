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
      if (!this.props.orderParams || !this.props.orderParams.nowProduct) {
          Toast.fail('您没有选择商品');
         this.props.history.replace('/');
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

    // 支付
    onSubmit() {
        if(this.state.payType === 'wxpay') {    // 选择的微信支付
            location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${Config.appId}&redirect_uri=${Config.redirect_uri}&response_type=code&scope=snsapi_base&state=0#wechat_redirect `;
        } else if(this.state.payType === 'alipay'){ // 支付宝支付
            Toast.info('暂未开放');
        }
    }

  render() {
    return (
      <div className="flex-auto page-box confirm-pay">
          <List>
              <RadioItem key="wxpay" checked={this.state.payType === 'wxpay'} onChange={() => this.onChange('wxpay')}>微信支付</RadioItem>
              <RadioItem key="alipay" checked={this.state.payType === 'alipay'} onChange={() => this.onChange('alipay')}>支付宝支付</RadioItem>
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
