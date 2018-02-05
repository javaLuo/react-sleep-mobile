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
import ImgDiZhi from '../../../../assets/dizhi@3x.png';
// ==================
// 本页面所需action
// ==================

import { mallOrderQuery, mallOrderDel } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        order: [],  // 通过 query接口获取到的订单数据（包含了地址数据）
    };
  }

  componentDidMount() {
      this.getData(); // 不需要获取订单详情了
      document.title = '订单详情';
      console.log('订单：', this.props.orderInfo);
  }

  // 还有一部分信息需要调接口获取
  getData() {
      if (!this.props.orderInfo.id) {
          return false;
      }
      this.props.actions.mallOrderQuery({ orderId: this.props.orderInfo.id, pageNum:1, pageSize: 99 }).then((res) => {
        if(res.status === 200 && res.data) {
            this.setState({
                order: res.data,
            });
        } else {
            Toast.fail('获取订单详情失败',1);
        }
      });
  }

  // 点击跳转到商品详情页
  onGotoProduct(data, type) {
      if (type === 'M') { // 优惠卡，不跳转

      } else { // 普通卡 或 其他商品
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
                    this.props.actions.mallOrderDel({ orderId: obj.id }).then((res) => {
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
      const data = this.props.orderInfo.product || {};
      const o = this.state.order;
      const addr = o.shopAddress;
      const type = data.typeId; // 是什么类型产品 0-其他 1-水机 2-养未来，3-冷敷贴 4-水机续费订单 5-精准体检 6-智能睡眠
    return (
      <div className="page-order-detail">
          {
              type !== 5 && addr ? (
                  <List>
                      <Item
                          thumb={<img src={ImgDiZhi} />}
                          className={'normal-item'}
                          multipleLine
                      >
                          收货人：{addr.contact}
                          <Brief>
                              <div>电话：{addr.mobile}</div>
                              <div className="all_warp">收货地址：{`${addr.province || ''}${addr.city || ''}${addr.region || ''}${addr.street}`}</div>
                          </Brief>
                      </Item>
                  </List>
              ) : null
          }
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
              { /** 水机才有安装工信息 **/
                  type === 1 ? (
                      <div className="worker">
                          <div>安装工：{o.customer && o.customer.realName}</div>
                          <div>联系电话：{o.customer && o.customer.phone}</div>
                      </div>
                  ) : null
              }
              <div className="basic">
                  <div>订单号：{this.props.orderInfo.id || ''}</div>
                  <div>下单时间：{this.props.orderInfo.createTime || ''}</div>
                  {this.props.orderInfo.conditions === 4 ? <div>付款时间：{this.props.orderInfo.payTime || '--'}</div> : null}
              </div>
              { /** 水机有付款方式 **/
                  type === 1 ? (
                      <div>付款方式：{o.chargeType && o.chargeType.chargeName}</div>
                  ) : null
              }
              <div>运费：￥{o.shipFee || 0}</div>
              { /** 水机有开户费 **/
                  type === 1 ? (
                      <div>开户费：{o.openAccountFee}</div>
                  ) : null
              }
              <div>数量：{this.props.orderInfo.count || ''}</div>
              <div>实付款：￥{this.props.orderInfo.fee || ''}</div>
          </div>
          { /** 只有体检卡有常见问题 **/
              type === 5 ? (
                  <List>
                      <Item arrow="horizontal" onClick={() => this.props.history.push('/my/useofknow')}>常见问题</Item>
                  </List>
              ) : null
          }

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
                          {type === 5 ? <a className="blue" onClick={() => this.onLook()}>{this.props.orderInfo.modelType === 'M' ? '查看优惠卡' : '查看体检卡'}</a> : null}
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
    actions: bindActionCreators({ mallOrderQuery, mallOrderDel }, dispatch),
  })
)(HomePageContainer);
