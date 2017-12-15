/* 我的e家 - 订单 */

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

import { Tabs, Button, Modal, Toast } from 'antd-mobile';

// ==================
// 本页面所需action
// ==================

import { mallOrderList, mallOrderDel, shopStartPayOrder } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [], // 所有的订单数据
    };
  }

  componentDidMount() {
    this.getData();
  }

  // 获取当前登录用户的相关信息
  getData() {
      this.props.actions.mallOrderList({ pageNum:0, pageSize: 999 }).then((res) => {
          if (res.status === 200) {
              this.setState({
                  data: res.data.result,
              });
          }
      });
  }

  // 工具 - 根据type值获取是什么状态
    getNameByConditions(type) {
      switch(String(type)){
          case '0': return '待付款';
          case '1': return '未受理';
          case '2': return '已受理';
          case '3': return '处理中';
          case '4': return '已完成';
          case '-1': return '审核中';
          case '-2': return '未通过';
          case '-3': return '已取消';
          default: return '未知状态';
      }
    }

    // 删除订单
    onDelOrder(id) {
        alert('删除订单', '确定删除吗？', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定',
                onPress: () => new Promise((resolve, rej) => {
                    this.props.actions.mallOrderDel({ orderId: id }).then((res) => {
                        if (res.status === 200) {
                            this.getData();
                            Toast.success('订单已取消');
                        } else {
                            Toast.fail(res.message || '订单取消失败');
                        }
                        resolve();
                    }).catch(() => {
                        rej();
                    });
                }),
            },
        ]);

    }

    // 待付款的订单点击付款
    onPay(obj) {
      sessionStorage.setItem('pay-info', JSON.stringify(obj));
      this.props.history.push('/shop/payChose');
    }

  render() {
    return (
      <div className="page-order" style={{ minHeight: '100vh' }}>
          <Tabs
            tabs={[
                { title: '全部' },
                { title: '待处理' },
                { title: '已完成' }
            ]}
          >
              <div className="tabs-div">
                  <ul>
                      {
                          this.state.data.map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions)}</span>
                                      </div>
                                      <div className="info page-flex-row">
                                          <div className="pic flex-none">
                                              {
                                                  (item.product && item.product.productImg) ?
                                                      <img src={item.product.productImg.split(',')[0]} /> : null
                                              }
                                          </div>
                                          <div className="goods flex-auto">
                                              <div className="t">{item.product ? item.product.name : ''}</div>
                                              <div className="i">￥{item.product ? item.product.price : ''}</div>
                                              <div className="i">*{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.price * item.count) : ''}</div>
                                          </div>
                                      </div>
                                      <div className="controls page-flex-row flex-jc-end">
                                          {(() => {
                                              switch(String(item.conditions)){
                                                  case '0': return [<a key="0" onClick={() => this.onDelOrder(item.id)}>删除订单</a>, <a key="1" className="blue" onClick={() => this.onPay(item)}>付款</a>];
                                                  case '1': return <span>未受理</span>;
                                                  case '2': return <span>已受理</span>;
                                                  case '3': return <span>处理中</span>;
                                                  case '4': return [<a key="0">查看体检卡</a>];
                                                  case '-1': return <span>审核中</span>;
                                                  case '-2': return <span>未通过</span>;
                                                  case '-3': return <span>已取消</span>;
                                                  default: return <span>未知状态</span>;
                                              }
                                          })()}
                                      </div>
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
              <div className="tabs-div">
                  <ul>
                      {
                          this.state.data.filter((item) => item.conditions === 0).map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions)}</span>
                                      </div>
                                      <div className="info page-flex-row">
                                          <div className="pic flex-none">
                                              {
                                                  (item.product && item.product.productImg) ?
                                                      <img src={item.product.productImg.split(',')[0]} /> : null
                                              }
                                          </div>
                                          <div className="goods flex-auto">
                                              <div className="t">{item.product ? item.product.name : ''}</div>
                                              <div className="i">￥{item.product ? item.product.price : ''}</div>
                                              <div className="i">*{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.price * item.count) : ''}</div>
                                          </div>
                                      </div>
                                      <div className="controls page-flex-row flex-jc-end">
                                          {(() => {
                                              switch(String(item.conditions)){
                                                  case '0': return [<a key="0" onClick={() => this.onDelOrder(item.id)}>删除订单</a>, <a key="1" className="blue">付款</a>];
                                                  case '1': return <span>未受理</span>;
                                                  case '2': return <span>已受理</span>;
                                                  case '3': return <span>处理中</span>;
                                                  case '4': return [<a key="0">查看体检卡</a>];
                                                  case '-1': return <span>审核中</span>;
                                                  case '-2': return <span>未通过</span>;
                                                  case '-3': return <span>已取消</span>;
                                                  default: return <span>未知状态</span>;
                                              }
                                          })()}
                                      </div>
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
              <div className="tabs-div">
                  <ul>
                      {
                          this.state.data.filter((item) => item.conditions === 4).map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions)}</span>
                                      </div>
                                      <div className="info page-flex-row">
                                          <div className="pic flex-none">
                                              {
                                                  (item.product && item.product.productImg) ?
                                                      <img src={item.product.productImg.split(',')[0]} /> : null
                                              }
                                          </div>
                                          <div className="goods flex-auto">
                                              <div className="t">{item.product ? item.product.name : ''}</div>
                                              <div className="i">￥{item.product ? item.product.price : ''}</div>
                                              <div className="i">*{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.price * item.count) : ''}</div>
                                          </div>
                                      </div>
                                      <div className="controls page-flex-row flex-jc-end">
                                          {(() => {
                                              switch(String(item.conditions)){
                                                  case '0': return [<a key="0" onClick={() => this.onDelOrder(item.id)}>删除订单</a>, <a key="1" className="blue">付款</a>];
                                                  case '1': return <span>未受理</span>;
                                                  case '2': return <span>已受理</span>;
                                                  case '3': return <span>处理中</span>;
                                                  case '4': return [<a key="0">查看体检卡</a>];
                                                  case '-1': return <span>审核中</span>;
                                                  case '-2': return <span>未通过</span>;
                                                  case '-3': return <span>已取消</span>;
                                                  default: return <span>未知状态</span>;
                                              }
                                          })()}
                                      </div>
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
          </Tabs>
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
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ mallOrderList, mallOrderDel, shopStartPayOrder }, dispatch),
  })
)(HomePageContainer);
