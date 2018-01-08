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
import { Toast, List, Button, Modal } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { mallOrderHraCard, mallOrderDel } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
    };
  }

  componentDidMount() {
      // this.getData(); // 不需要获取订单详情了
      document.title = '订单详情';
      console.log('订单：', this.props.orderInfo);
  }

  getData() {
      if (!this.props.orderInfo.id) {
          return false;
      }
      this.props.actions.mallOrderHraCard({ orderId: this.props.orderInfo.id, pageNum:1, pageSize: 99 }).then((res) => {
        if(res.status === 200 && res.data && res.data.result) {
            this.setState({
                data: res.data.result || [],
            });
        } else {
            Toast.fail('获取订单详情失败',1);
        }
      });
  }

  // 点击跳转到商品详情页
  onGotoProduct(data, type) {
      if (type === 'M') { // 优惠卡，不跳转

      } else { // 普通卡
          this.props.history.push(`/shop/gooddetail/${data.id}`);
      }
  }

    // 待付款的订单点击付款
    onPay() {
        const obj = this.props.orderInfo;
        if (!obj) {
            Toast.fail('获取订单信息失败',1);
            return true;
        }
        sessionStorage.setItem('pay-info', JSON.stringify(obj));
        console.log('代入的obj', obj.product);
        sessionStorage.setItem('pay-obj', JSON.stringify({ nowProduct: obj.product}));
        this.props.history.push('/shop/payChose');
    }

    // 删除订单
    onDel() {
        const obj = this.props.orderInfo;
        if (!obj) {
            Toast.fail('获取订单信息失败',1);
            return true;
        }
        alert('确认删除订单？', '删除之后将无法再查看订单', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定',
                onPress: () => new Promise((resolve, rej) => {
                    this.props.actions.mallOrderDel({ orderId: id }).then((res) => {
                        if (res.status === 200) {
                            this.props.history.go(-1);
                            Toast.success('订单已删除',1);
                        } else {
                            Toast.fail(res.message || '订单取消失败',1);
                        }
                        resolve();
                    }).catch(() => {
                        rej();
                    });
                }),
            },
        ]);
    }

    // 查看订单对应的卡的信息
    onLook() {
        const obj = this.props.orderInfo;
        if (!obj) {
            Toast.fail('获取订单信息失败',1);
            return true;
        }
        if(obj.modelType === 'M') { // 优惠卡，跳优惠卡页面
            this.props.history.push(`/my/myfavcards/fav_${obj.id}`);
        } else{ // 普通体检卡，跳体检卡详情页
            this.props.history.push(`/my/ordercarddetail/${obj.id}`);
        }

    }

  render() {
      const data = this.props.orderInfo.product || {};
    return (
      <div className="page-order-detail">
          <div className="card-box">
              <div className="info page-flex-row" onClick={() => this.onGotoProduct(data, this.props.orderInfo.modelType)}>
                  <div className="pic flex-none">
                      {
                          (data.productImg) ? (
                              <img src={data.productImg.split(',')[0]} />
                          ) : null
                      }
                  </div>
                  <div className="goods flex-auto page-flex-col flex-jc-sb">
                      <div className="t">{ data.name || '' }</div>
                      <div className="i">￥<span>{data.typeModel ? data.typeModel.price : ''}</span></div>
                  </div>
              </div>
          </div>
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
          {(() => {
              switch(this.props.orderInfo.conditions){
                  case 0: return (
                      <div className="thefooter page-flex-row flex-ai-center flex-jc-end">
                          <a onClick={() => this.onDel()}>删除订单</a>
                          <a className="blue" onClick={() => this.onPay()}>立即支付</a>
                      </div>
                  );
                  case 4: return (
                      <div className="thefooter page-flex-row flex-ai-center flex-jc-end">
                          <a onClick={() => this.onDel()}>删除订单</a>
                          <a className="blue" onClick={() => this.onLook()}>{this.props.orderInfo.modelType === 'M' ? '查看优惠卡' : '查看体检卡'}</a>
                      </div>
                  );
                  default: return null;
              }
          })()}
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
    actions: bindActionCreators({ mallOrderHraCard, mallOrderDel }, dispatch),
  })
)(HomePageContainer);
