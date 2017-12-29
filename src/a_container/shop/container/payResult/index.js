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
      this.getOrderData();
  }

  componentWillUnmount() {

  }

  /** 获取当前订单最新信息 **/
  getOrderData(){
      this.props.actions.mallOrderQuery({ orderId: this.props.payResultInfo.payData.id }).then((res) => {
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
                  this.state.orderData.conditions === 4 ? <img src={ImgIcon} /> : <img src={ImgFail} />
              }
              <div>{(() => {
                  switch(String(this.state.orderData.conditions)){
                      case '0': return '付款失败';
                      case '1': return '等待受理';
                      case '2': return '已受理';
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
              <div>订单号：{this.props.payResultInfo.payData.id || ''}</div>
              <div>下单时间：{this.props.payResultInfo.payData.createTime || ''}</div>
              <div>付款时间：{this.state.orderData.payTime || tools.dateToStr(new Date())}</div>
              <div>数量：{this.props.payResultInfo.payData.count}</div>
              <div>实付款：{this.props.payResultInfo.payData.fee ? `￥ ${this.props.payResultInfo.payData.fee}` : ''}</div>
          </div>
          {/*<div className="cards">*/}
              {/*<div className="title page-flex-row flex-jc-sb">*/}
                  {/*<div className="t">体检卡</div>*/}
                  {/*<div className="i">有效期至：{this.props.payResultInfo.cardData ? this.props.payResultInfo.cardData[0].validTime : ''}</div>*/}
              {/*</div>*/}
              {/*<List>*/}
                  {/*{*/}
                      {/*this.props.payResultInfo.cardData ? this.props.payResultInfo.cardData.map((item, index) => {*/}
                          {/*return <Item key={index} extra={<a className="list-btn" onClick={() => this.props.history.push('/healthy/mycard')}>查看体检卡</a>}>体检卡{index + 1}：共{item.ticketList.length}张体检券</Item>;*/}
                      {/*}) : null*/}
                  {/*}*/}
              {/*</List>*/}
          {/*</div>*/}
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
    actions: bindActionCreators({ mallOrderHraCard, mallOrderQuery }, dispatch),
  })
)(HomePageContainer);
