/* 支付成功展示页面 */

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
import { Button, List, Radio } from 'antd-mobile';
import ImgIcon from '../../../../assets/1@3x.png';
// ==================
// 本页面所需action
// ==================

import { } from '../../../../a_action/shop-action';

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

  }
  componentDidMount() {
  }

   componentWillUnmount() {
  }

  render() {
    return (
      <div className="flex-auto page-box page-pay-result">
          <div className="head">
              <img src={ImgIcon} />
              <div>购买成功</div>
          </div>
          <div className="cards">
              <div className="title page-flex-row flex-jc-sb">
                  <div className="t">体检卡</div>
                  <div className="i">有效期至：{this.props.payResultInfo.cardData ? this.props.payResultInfo.cardData[0].validTime : ''}</div>
              </div>
              <List>
                  {
                      this.props.payResultInfo.cardData ? this.props.payResultInfo.cardData.map((item, index) => {
                          return <Item key={index} extra={<a className="list-btn" onClick={() => this.props.history.push('/healthy/mycard')}>查看体检卡</a>}>体检卡{index}：共{item.ticketList.length}张体检券</Item>;
                      }) : null
                  }
              </List>
          </div>
          <div className="pay-info">
              <div>订单号：{this.props.payResultInfo.payInfo.id || ''}</div>
              <div>下单时间：{this.props.payResultInfo.payInfo.createTime || ''}</div>
              {/*<div>付款时间：</div>*/}
              <div>数量：{this.props.payResultInfo.payInfo.count}</div>
              <div>实付款：{this.props.payResultInfo.payInfo.fee ? `￥ ${this.props.payResultInfo.payInfo.fee}` : ''}</div>
          </div>
          <List>
              <Item arrow="horizontal">使用须知</Item>
          </List>
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
    payResultInfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      payResultInfo: state.shop.payResultInfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ }, dispatch),
  })
)(HomePageContainer);
