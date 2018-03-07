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
      document.title = '客户订单';
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
      this.props.history.push(`/my/ordercustomerdetail`);
    }

    // 修改客户订单的审核是否通过
    onSetOrder(orderId, activityStatus) {
       this.props.actions.setAuditList({ orderId, activityStatus }).then((res) => {
           if (res.status === 200) {
               this.getData();
               Toast.success('操作成功', 1);
           } else {
               Toast.fail(res.message);
           }
       });
    }

    // 返回当前订单的各状态
    makeType(item) {
      // 先判断当时是什么类型的产品
        const type = item.product.typeId;
        switch(String(item.conditions)){
            case '0': return null;  // 待付款
            case '1': return null;  // 未受理
            case '2': return null;  // 待发货
            case '3': return null;  // 待收货
            case '4': return null;  // 已完成
            case '-1': return [<a key="0" onClick={() => this.onSetOrder(item.id, 1)}>审核不通过</a>, <a key="0" onClick={() => this.onSetOrder(item.id, 2)}>审核通过</a>];
            case '-2': return <span>未通过</span>;
            case '-3': return <span>已取消</span>;
            default: return <span>未知状态</span>;
        }
    }

  render() {
      const data = this.state.data;  // 全部数据
      const dataA = this.state.data.filter((item) => item.conditions === -1);   // 待审核
      const dataB = this.state.data.filter((item) => item.conditions === 2);   // 待发货
      const dataC = this.state.data.filter((item) => item.conditions === 3);   // 待收货
      const dataD = this.state.data.filter((item) => item.conditions === 4);   // 已完成
    return (
      <div className="page-order" style={{ minHeight: '100vh' }}>
          <Tabs
            swipeable={false}
            tabs={[
                { title: '全部' },
                { title: <Badge text={dataA.length}>待审核</Badge> },
                { title: <Badge text={dataB.length}>待发货</Badge> },
                { title: <Badge text={dataC.length}>待收货</Badge> },
                { title: <Badge text={dataD.length}>已完成</Badge> }
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
                                                  <div className="i">价格：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
                                                  <div className="i">数量：{item.count}</div>
                                                  <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
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
                          dataA.filter((item) => item.conditions === -1).map((item, index) => {
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
                                              <div className="i">价格：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
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
                          dataB.filter((item) => item.conditions === 2).map((item, index) => {
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
                                              <div className="i">价格：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
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
                          dataC.filter((item) => item.conditions === 3).map((item, index) => {
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
                                              <div className="i">价格：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
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
                          dataD.filter((item) => item.conditions === 4).map((item, index) => {
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
                                              <div className="i">价格：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
                                              <div className="i">数量：{item.count}</div>
                                              <div className="i">总计：￥{item.product ? (item.product.typeModel.price * item.count + (item.product.typeModel.openAccountFee || 0) + (item.product.typeModel.shipFee || 0)) : ''}</div>
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
