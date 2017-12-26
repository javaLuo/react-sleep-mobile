/* 我的e家 - 订单详情 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Toast, List, Button } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { mallOrderHraCard } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
    };
  }

  componentDidMount() {
      // this.getData(); // 不需要获取订单详情了
      console.log('订单：', this.props.orderInfo);
  }

  getData() {
      if (!this.props.orderInfo.id) {
          return false;
      }
      this.props.actions.mallOrderHraCard({ orderId: this.props.orderInfo.id, pageNum:0, pageSize: 10 }).then((res) => {
        if(res.status === 200 && res.data && res.data.result) {
            this.setState({
                data: res.data.result || [],
            });
        } else {
            Toast.fail('获取订单详情失败');
        }
      });
  }

  // 点击跳转到商品详情页
  onGotoProduct(id) {
      this.props.history.push(`/shop/gooddetail/${id}`);
  }

    // 待付款的订单点击付款
    onPay() {
        const obj = this.props.orderInfo;
        if (!obj) {
            Toast.fail('获取订单信息失败');
            return true;
        }
        sessionStorage.setItem('pay-info', JSON.stringify(obj));
        console.log('代入的obj', obj.product);
        sessionStorage.setItem('pay-obj', JSON.stringify({ nowProduct: obj.product}));
        this.props.history.push('/shop/payChose');
    }

  render() {
    return (
      <div className="page-order-detail">
          <div className="card-box">
              <div className="info page-flex-row" onClick={() => this.onGotoProduct(this.props.orderInfo.product.id)}>
                  <div className="pic flex-none">
                      {
                          (this.props.orderInfo.product && this.props.orderInfo.product.productImg) ? (
                              <img src={this.props.orderInfo.product.productImg.split(',')[0]} />
                          ) : null
                      }
                  </div>
                  <div className="goods flex-auto page-flex-col flex-jc-sb">
                      <div className="t">{ this.props.orderInfo.product ? this.props.orderInfo.product.name : '' }</div>
                      <div className="i">￥<span>{this.props.orderInfo.fee || ''}</span></div>
                  </div>
              </div>
          </div>
          {/*<List>*/}
              {/*<Item className="long" extra={`有效期至：${(this.state.data[0] && this.state.data[0].validTime) ? this.state.data[0].validTime.split(' ')[0] : ''}`}>体检卡</Item>*/}
              {/*{*/}
                  {/*this.state.data.map((item, index) => {*/}
                      {/*return <Item key={index} className="long" arrow="horizontal">体检卡{this.state.data.length > 1 ? index + 1 : null}：共{item.ticketNum}张</Item>;*/}
                  {/*})*/}
              {/*}*/}
          {/*</List>*/}
          <div className="order-info">
              <div>订单号：{this.props.orderInfo.id || ''}</div>
              <div>下单时间：{this.props.orderInfo.createTime || ''}</div>
              {this.props.orderInfo.conditions === 4 ? <div>付款时间：{this.props.orderInfo.payTime || '--'}</div> : null}
              <div>数量：{this.props.orderInfo.count || ''}</div>
              <div>实付款：￥{this.props.orderInfo.fee || ''}</div>
          </div>
          <List>
              <Item arrow="horizontal" onClick={() => this.props.history.push('/my/useofknow')}>常见问题</Item>
          </List>
          {
              this.props.orderInfo.conditions === 0 ? (
                  <div className="thefooter">
                      <Button type="default" onClick={() => this.onPay()}>立即支付</Button>
                  </div>
              ) : null
          }
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
  orderInfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      orderInfo: state.shop.orderInfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ mallOrderHraCard }, dispatch),
  })
)(HomePageContainer);
