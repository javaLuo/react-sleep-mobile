/* 我的e家 - 客户订单 */

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

import { Tabs, Button, Modal, Toast, Badge } from 'antd-mobile';

// ==================
// 本页面所需action
// ==================

import { auditList, setAuditList, saveOrderInfo } from '../../../../a_action/shop-action';

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
      document.title = '我的客户订单';
    this.getData();
  }

  // 获取数据
  getData() {
      this.props.actions.auditList({ pageNum:1, pageSize: 9999 }).then((res) => {
          if (res.status === 200 && res.data) {
              this.setState({
                  data: res.data.result || [],
              });
              console.log('订单信息：', res.data.result);
          }
      }).catch(() =>{
          Toast.info('网络错误，请重试',1);
      });
  }

  // 工具 - 根据type值获取是什么状态
    getNameByConditions(type, type1) {
        switch(String(type1)){
            case '3': return '退款中';
            case '4': return '已退款';
            default:;
        }

      switch(String(type)){
          case '1': return '待审核';
          case '2': return '待发货';
          case '3': return '已发货';
          case '4': return '已完成';
          default: return '';
      }
    }

    // 待付款的订单点击付款
    onPay(obj) {
      sessionStorage.setItem('pay-info', JSON.stringify(obj));
      console.log('代入的obj', obj.product);
      sessionStorage.setItem('pay-obj', JSON.stringify({ nowProduct: obj.product}));
      this.props.history.push('/shop/payChose/1');
    }

    // 查看订单详情
    onSeeDetail(obj) {
      this.props.actions.saveOrderInfo(obj);
      this.props.history.push(`/my/ordercustomerdetail`);
    }

    // 修改客户订单的审核是否通过
    onSetOrder(orderId, activityStatus) {
        alert( '审核操作', activityStatus === 1  ? '确认审核通过?' : '确认审核不通过?', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定',
                onPress: () => new Promise((resolve, rej) => {
                    this.props.actions.setAuditList({ orderId, activityStatus }).then((res) => {
                        if (res.status === 200) {
                            this.getData();
                            Toast.success('操作成功', 1);
                        } else {
                            Toast.info(res.message);
                        }
                        resolve();
                    }).catch(() => {
                        rej();
                    });
                }),
            },
        ]);
    }

    // 返回当前订单的各状态
    makeType(item) {
      if(item.conditions === 1 && [1,2,5].includes(this.props.userinfo.userType)) {
          return [<a key="0" onClick={() => this.onSetOrder(item.id, 2)}>审核不通过</a>, <a key="0" className="blue" onClick={() => this.onSetOrder(item.id, 1)}>审核通过</a>];
      }
      return null;
    }

  render() {
      const data = this.state.data.filter((item) => [1,2,3,4].includes(item.conditions));  // 全部数据(只包含待审核、待发货、退款中、已退款、待收货)
      const dataA = data.filter((item) => item.conditions === 1);   // 待审核
      const dataB = data.filter((item) => item.conditions === 2);   // 待发货
      const dataC = data.filter((item) => item.conditions === 3);   // 待收货
      const dataD = data.filter((item) => item.conditions === 4);   // 已完成
    return (
      <div className="page-order-customer">
          <Tabs
            swipeable={false}
            tabs={[
                { title: '全部' },
                { title: <Badge text={dataA.length}>待审核</Badge> },
                { title: <Badge text={dataB.length}>待发货</Badge> },
                { title: <Badge text={dataC.length}>待收货</Badge> },
                { title: "已完成" }
            ]}
          >
              {/** 全部 **/}
              <div className="tabs-div">
                  <ul>
                      {
                          data.map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                          <div className="title page-flex-row flex-jc-sb">
                                              <span className="num">订单号：{item.id}</span>
                                              <span className="type">{this.getNameByConditions(item.conditions, item.activityStatus)}</span>
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
                                                  <div className="i">价格：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
                                                  <div className="i">数量：{item.count}</div>
                                                  <div className="i">总计：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
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
              {/** 待审核 **/}
              <div className="tabs-div">
                  <ul>
                      {
                          dataA.map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions, item.activityStatus)}</span>
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
                                              <div className="i">价格：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
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
                          dataB.map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions, item.activityStatus)}</span>
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
                                              <div className="i">价格：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
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
                          dataC.map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions, item.activityStatus)}</span>
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
                                              <div className="i">价格：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
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
                          dataD.map((item, index) => {
                              return (
                                  <li className="card-box" key={index}>
                                      <div className="title page-flex-row flex-jc-sb">
                                          <span className="num">订单号：{item.id}</span>
                                          <span className="type">{this.getNameByConditions(item.conditions, item.activityStatus)}</span>
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
                                              <div className="i">价格：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.productModel.price * item.count + (item.product.productModel.openAccountFee || 0) + (item.product.productModel.shipFee || 0)) : ''}</div>
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
    actions: bindActionCreators({ auditList, setAuditList, saveOrderInfo }, dispatch),
  })
)(HomePageContainer);
