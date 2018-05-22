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
import tools from '../../../../util/all';
// ==================
// 所需的所有组件
// ==================
import { List, Button } from 'antd-mobile';
import ImgIcon from '../../../../assets/1@3x.png';
import ImgFail from '../../../../assets/quxiao@3x.png';
// ==================
// 本页面所需action
// ==================

import { mallOrderHraCard, mallOrderQuery } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        orderData: {},
    };
  }

  componentWillMount() {

  }
  componentDidMount() {
      document.title = '支付结果';
      sessionStorage.removeItem('pay-obj');
      sessionStorage.removeItem('pay-info');
      sessionStorage.removeItem('pay-start');   // 清除支付回跳标识

      const id = String(this.props.location.pathname.split('/').slice(-1));
      console.log('没有？', this.props.location.pathname);
      if(!Number(id)){
          this.props.history.replace('/my/order');
      }
      this.getOrderData(id);
  }

  componentWillUnmount() {

  }

  /** 获取当前订单最新信息 **/
  getOrderData(id){
      this.props.actions.mallOrderQuery({ orderId: id }).then((res) => {
          if (res.status === 200) {
              this.setState({
                  orderData: res.data,
              });
          }
      });
  };

  render() {
    return (
      <div className="flex-auto page-box page-pay-result">
          <div className="head">
          {
          [2,4].includes(this.state.orderData.conditions) ? <img src={ImgIcon} /> : <img src={ImgFail} />
          }
          <div>{(() => {
          switch(String(this.state.orderData.conditions)){
          case '0': return '付款失败';
          case '1': return '等待受理';
          case '2': return '购买成功';  // 待发货
          case '3': return '处理中';
          case '4': return '购买成功';
          case '-1': return '审核成功';
          case '-2': return '未通过';
          case '-3': return '已取消';
          default: return '--';
          }
          })()}</div>
          </div>
          <div className="pay-info">
          <div>订单号：{this.state.orderData.id || ''}</div>
          <div>下单时间：{this.state.orderData.createTime || ''}</div>
          <div>付款时间：{this.state.orderData.payTime }</div>
          <div>数量：{this.state.orderData.count}</div>
          <div>实付款：{this.state.orderData.fee ? `￥ ${this.state.orderData.fee}` : ''}</div>
          </div>
          <div className="thefooter">
          <Button type="primary" onClick={() => this.props.history.replace('/my/order')}>返回我的订单</Button>
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

};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ mallOrderHraCard, mallOrderQuery }, dispatch),
  })
)(HomePageContainer);