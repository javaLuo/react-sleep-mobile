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
import ImgShenHe from '../../../../assets/shop/shenhe@3x.png';
import ImgFaHuo from '../../../../assets/shop/fahuo@3x.png';
import ImgShouHuo from '../../../../assets/shop/shouhuo@3x.png';
import ImgYiWanCheng from '../../../../assets/shop/yiwancheng@3x.png';
import ImgFuKuan from '../../../../assets/shop/fukuan@3x.png';

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
        order: {},  // 通过 query接口获取到的订单数据（包含了地址数据）
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
        } else{ // 普通评估卡，跳评估卡详情页
            this.props.history.push(`/my/ordercarddetail/${obj.id}`);
        }

    }

    // 返回当前订单的各状态
    getType(item) {
        switch(String(item.activityStatus)){
            case '3': return {label:'退款中', info: '订单审核未通过', icon: ImgYiWanCheng};
            case '4': return {label:'已退款', info: '订单审核未通过', icon: ImgYiWanCheng};
            default:;
        }

        switch(String(item.conditions)){
            // 待付款
            case '0': return {label:'待付款', info: '请尽快完成支付', icon: ImgFuKuan};
            case '1': return {label:'待审核', info: '订单正在审核（1~3个工作日），请耐心等待', icon: ImgShenHe};
            case '2': return {label:'待发货', info: '正在等待发货', icon: ImgFaHuo};
            case '3': return {label:'待收货', info: '物品已在途中，请耐心等待', icon: ImgShouHuo};
            case '4': return {label:'已完成', info: '', icon: ImgYiWanCheng};
            case '-1': return {label:'审核中', info: '', icon: ImgShenHe};
            case '-2': return {label:'未通过', info: '', icon: ImgShenHe};
            case '-3': return {label:'已取消', info: '', icon: ImgShenHe};
            case '-4': return {label:'已关闭', info: '', icon: ImgShenHe};
            default: return null;
        }
    }

  render() {
      console.log('这尼玛是个什么：', this.props.orderInfo);
      const data = this.props.orderInfo.product || { typeModel: {} };
      const o = this.state.order;
      const addr = o.shopAddress;
      const type = data.typeId; // 是什么类型产品 0-其他 1-水机 2-养未来，3-冷敷贴 4-水机续费订单 5-精准体检 6-智能睡眠
      const activeStatus = this.getType(o);
      console.log('所以这是个什么；', activeStatus);
    return (
      <div className="page-order-detail">
          {/** 订单状态 **/}
          {
              activeStatus && (
                  <div className="order-type">
                      <List>
                          <Item
                              thumb={<img src={activeStatus.icon} />}
                              className={'normal-item'}
                              multipleLine
                          >
                              {activeStatus.label}
                              {activeStatus.info ? <Brief><div className="all_warp">{ activeStatus.info }</div></Brief> : null}
                          </Item>
                      </List>
                  </div>
              )
          }
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
              <div className="info page-flex-row" onClick={() => this.onGotoProduct(data, o.modelType)}>
                  <div className="pic flex-none">
                      {
                          (data.productImg) ? (
                              <img src={data.productImg.split(',')[0]} />
                          ) : null
                      }
                  </div>
                  <div className="goods flex-auto page-flex-col flex-jc-sb">
                      <div className="t">{ data.name || '' }</div>
                      <div className="i">￥<span>{data && (data.typeModel.price + (data.typeModel.openAccountFee || 0))}</span></div>
                  </div>
              </div>
          </div>
          <div className="order-info">
              { /** 水机才有安装工信息 **/
                  type === 1 ? (
                      <div className="worker">
                          <div>安装工：{o.customer && o.customer.realName}</div>
                          <div>联系方式：{o.customer  ? <a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a> : null}</div>
                      </div>
                  ) : null
              }
              <div className="basic">
                  <div>订单号：{o.id || ''}</div>
                  <div>下单时间：{o.createTime || ''}</div>
                  {o.payTime ? <div>付款时间：{o.payTime || '--'}</div> : null}
              </div>
              { /** 水机有付款方式 **/
                  type === 1 ? (
                      <div>计费方式：{o.chargeType && o.chargeType.chargeName}</div>
                  ) : null
              }
              <div>运费：￥{o.shipFee || 0}</div>
              { /** 水机有开户费 **/
                  type === 1 ? (
                      <div>首年度预缴：{o.fee}</div>
                  ) : null
              }
              <div>数量：{o.count || ''}</div>
              <div>实付款：￥{o.fee || ''}</div>
          </div>
          { /** 只有评估卡有常见问题 **/
              type === 5 ? (
                  <List>
                      <Item arrow="horizontal" onClick={() => this.props.history.push('/my/useofknow')}>常见问题</Item>
                  </List>
              ) : null
          }

          {(() => {
              if(o.activityType === 2) { // 活动商品不需要支付
                  return null;
              }
              switch(o.conditions){
                  case 0: return (
                      <div className="thefooter page-flex-row flex-ai-center flex-jc-end">
                          <a onClick={() => this.onDel()}>删除订单</a>
                          <a className="blue" onClick={() => this.onPay()}>立即支付</a>
                      </div>
                  );
                  case 4: return (
                      <div className="thefooter page-flex-row flex-ai-center flex-jc-end">
                          <a onClick={() => this.onDel()}>删除订单</a>
                          {type === 5 ? <a className="blue" onClick={() => this.onLook()}>{this.props.orderInfo.modelType === 'M' ? '查看优惠卡' : '查看评估卡'}</a> : null}
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
