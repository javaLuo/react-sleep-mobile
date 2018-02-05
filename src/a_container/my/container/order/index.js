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

import { mallOrderList, mallOrderDel, shopStartPayOrder, mallOrderHraCard, saveOrderInfo } from '../../../../a_action/shop-action';

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
      document.title = '我的订单';
      sessionStorage.removeItem('pay-obj');
      sessionStorage.removeItem('pay-info');
      sessionStorage.removeItem('pay-start');
    this.getData();
  }

  // 获取数据
  getData() {
      this.props.actions.mallOrderList({ pageNum:1, pageSize: 999 }).then((res) => {
          if (res.status === 200 && res.data) {
              this.setState({
                  data: res.data.result || [],
              });
              console.log('订单信息：', res.data.result);
          }
      }).catch(() =>{
          Toast.fail('网络错误，请重试',1);
      });
  }

  // 工具 - 根据type值获取是什么状态
    getNameByConditions(type) {
      switch(String(type)){
          case '0': return '待付款';
          case '1': return '未受理';
          case '2': return '待发货';
          case '3': return '已发货';
          case '4': return '已完成';
          case '-1': return '审核中';
          case '-2': return '未通过';
          case '-3': return '已取消';
          default: return '未知状态';
      }
    }

    // 删除订单
    onDelOrder(id) {
        alert('确认删除订单？', '删除之后将无法再查看订单', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定',
                onPress: () => new Promise((resolve, rej) => {
                    this.props.actions.mallOrderDel({ orderId: id }).then((res) => {
                        if (res.status === 200) {
                            this.getData();
                            Toast.success('订单已取消',1);
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

    // 待付款的订单点击付款
    onPay(obj) {
      sessionStorage.setItem('pay-info', JSON.stringify(obj));
      console.log('代入的obj', obj.product);
      sessionStorage.setItem('pay-obj', JSON.stringify({ nowProduct: obj.product}));
      this.props.history.push('/shop/payChose');
    }

    // 查看订单详情
    onSeeDetail(obj) {
      this.props.actions.saveOrderInfo(obj);
      this.props.history.push(`/my/orderdetail`);
    }

    // 查看体检卡详情
    onLook(item) {
      if (item.modelType === 'M') { // 优惠卡
          this.props.history.push(`/my/myfavcards/fav_${item.id}`);
      } else {  // 普通卡
          this.props.history.push(`/my/ordercarddetail/${item.id}`);
      }
    }

    // 返回当前订单的各状态
    makeType(item) {
      // 先判断当时是什么类型的产品
        const type = item.product.typeId;
        switch(String(item.conditions)){
            // 待付款
            case '0': return [<a key="0" onClick={() => this.onDelOrder(item.id)}>删除订单</a>, <a key="1" className="blue" onClick={() => this.onPay(item)}>付款</a>];
            case '1': return <span style={{ color: '#ccc' }}>未受理</span>;
            case '2': return null;  // 待发货
            case '3': return null;  // 待收货
            // 已完成
            case '4':
                const map = [<a key="0" onClick={() => this.onDelOrder(item.id)}>删除订单</a>];
                if (type === 5) {   // 精准体检，有查看卡的连接
                    map.push(<a key="1" className="blue" onClick={() => this.onLook(item)}>{item.modelType === 'M' ? '查看优惠卡' : '查看体检卡'}</a>);
                }
                return map;
            case '-1': return <span>审核中</span>;
            case '-2': return <span>未通过</span>;
            case '-3': return <span>已取消</span>;
            default: return <span>未知状态</span>;
        }
    }

  render() {
    return (
      <div className="page-order" style={{ minHeight: '100vh' }}>
          <Tabs
            swipeable={false}
            tabs={[
                { title: '全部' },
                { title: '待付款' },
                { title: '待发货' },
                { title: '待收货' },
                { title: '已完成' }
            ]}
          >
              {/** 全部 **/}
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
                                          <div className="info page-flex-row" onClick={() => this.onSeeDetail(item)}>
                                              <div className="pic flex-none">
                                                  {
                                                      (item.product && item.product.productImg) ?
                                                          <img src={item.product.productImg.split(',')[0]} /> : null
                                                  }
                                              </div>
                                              <div className="goods flex-auto">
                                                  <div className="t">{item.product ? item.product.name : ''}</div>
                                                  <div className="i">价格：￥{item.product ? item.product.typeModel.price : ''}</div>
                                                  <div className="i">数量：{item.count}</div>
                                                  <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count) : ''}</div>
                                              </div>
                                          </div>
                                          <div className="controls page-flex-row flex-jc-end">
                                              {this.makeType(item)}
                                          </div>
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
              {/** 待付款 **/}
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
                                      <div className="info page-flex-row" onClick={() => this.onSeeDetail(item)}>
                                          <div className="pic flex-none">
                                              {
                                                  (item.product && item.product.productImg) ?
                                                      <img src={item.product.productImg.split(',')[0]} /> : null
                                              }
                                          </div>
                                          <div className="goods flex-auto">
                                              <div className="t">{item.product ? item.product.name : ''}</div>
                                              <div className="i">价格：￥{item.product ? item.product.typeModel.price : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count) : ''}</div>
                                          </div>
                                      </div>
                                      <div className="controls page-flex-row flex-jc-end">
                                          {this.makeType(item)}
                                      </div>
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
              {/** 待发货 **/}
              <div className="tabs-div">
                  <ul>
                      {
                          this.state.data.filter((item) => item.conditions === 2).map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions)}</span>
                                      </div>
                                      <div className="info page-flex-row" onClick={() => this.onSeeDetail(item)}>
                                          <div className="pic flex-none">
                                              {
                                                  (item.product && item.product.productImg) ?
                                                      <img src={item.product.productImg.split(',')[0]} /> : null
                                              }
                                          </div>
                                          <div className="goods flex-auto">
                                              <div className="t">{item.product ? item.product.name : ''}</div>
                                              <div className="i">价格：￥{item.product ? item.product.typeModel.price : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count) : ''}</div>
                                          </div>
                                      </div>
                                      <div className="controls page-flex-row flex-jc-end">
                                          {this.makeType(item)}
                                      </div>
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
              {/** 待收货 **/}
              <div className="tabs-div">
                  <ul>
                      {
                          this.state.data.filter((item) => item.conditions === 3).map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions)}</span>
                                      </div>
                                      <div className="info page-flex-row" onClick={() => this.onSeeDetail(item)}>
                                          <div className="pic flex-none">
                                              {
                                                  (item.product && item.product.productImg) ?
                                                      <img src={item.product.productImg.split(',')[0]} /> : null
                                              }
                                          </div>
                                          <div className="goods flex-auto">
                                              <div className="t">{item.product ? item.product.name : ''}</div>
                                              <div className="i">价格：￥{item.product ? item.product.typeModel.price : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count) : ''}</div>
                                          </div>
                                      </div>
                                      <div className="controls page-flex-row flex-jc-end">
                                          {this.makeType(item)}
                                      </div>
                                  </li>
                              );
                          })
                      }
                  </ul>
              </div>
              {/** 已完成 **/}
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
                                      <div className="info page-flex-row" onClick={() => this.onSeeDetail(item)}>
                                          <div className="pic flex-none">
                                              {
                                                  (item.product && item.product.productImg) ?
                                                      <img src={item.product.productImg.split(',')[0]} /> : null
                                              }
                                          </div>
                                          <div className="goods flex-auto">
                                              <div className="t">{item.product ? item.product.name : ''}</div>
                                              <div className="i">价格：￥{item.product ? item.product.typeModel.price : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count) : ''}</div>
                                          </div>
                                      </div>
                                      <div className="controls page-flex-row flex-jc-end">
                                          {this.makeType(item)}
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
    actions: bindActionCreators({ mallOrderList, mallOrderDel, shopStartPayOrder, mallOrderHraCard, saveOrderInfo }, dispatch),
  })
)(HomePageContainer);
