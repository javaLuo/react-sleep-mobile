/* 我的e家 - 我的客户订单详情 */

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

import { mallOrderQuery, mallOrderDel, setAuditList } from '../../../../a_action/shop-action';

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

  // 审核通过或不通过
    onPass(activityStatus) {
        alert( '审核操作', activityStatus === 1  ? '确认审核通过?' : '确认审核不通过?', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定',
                onPress: () => new Promise((resolve, rej) => {
                    this.props.actions.setAuditList({ orderId: this.props.orderInfo.id, activityStatus }).then((res) => {
                        if (res.status === 200) {
                            this.props.history.go(-1);
                            Toast.success('操作成功', 1);
                        } else {
                            Toast.fail(res.message);
                        }
                        resolve();
                    }).catch(() => {
                        rej();
                    });
                }),
            },
        ]);
    }

    // 返回当前订单的各状态(客户订单里是根据activityType判断的)
    getType(item) {
      console.log('当前订单信息：', item);
      const thetime = new Date(item.createTime.replace(/-/g, "/"));
      thetime.setDate(thetime.getDate() + 3);
        switch(String(item.activityStatus)){
            // 待付款
            case '1': return {label:'待审核', info: `审核时限为3天，请您尽快在${tools.dateToStr(thetime)}前进行审核，超时订单将自动审核不通过`, icon: ImgShenHe};
            case '2': return {label:'待发货', info: '正在等待发货', icon: ImgFaHuo};
            case '3': return {label:'退款中', info: '订单审核未通过', icon: ImgYiWanCheng};
            case '4': return {label:'已退款', info: '订单审核未通过', icon: ImgYiWanCheng};
            default: return null;
        }
    }

  render() {
      const data = this.props.orderInfo.product || {};
      const o = this.state.order;
      const addr = o.shopAddress;
      const type = data.typeId; // 是什么类型产品 0-其他 1-水机 2-养未来，3-冷敷贴 4-水机续费订单 5-精准体检 6-智能睡眠
      const activeStatus = this.getType(this.props.orderInfo);
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
                  <div>下单人信息：{this.props.orderInfo.userInfo && this.props.orderInfo.userInfo.realName }</div>
                  <div>昵称：{this.props.orderInfo.userInfo && this.props.orderInfo.userInfo.nickName}</div>
                  <div>e家号：{this.props.orderInfo.userInfo && this.props.orderInfo.userInfo.id}</div>
              </div>
              <div className="basic">
                  <div>订单号：{this.props.orderInfo.id || ''}</div>
                  <div>下单时间：{this.props.orderInfo.createTime || ''}</div>
                  {this.props.orderInfo.payTime ? <div>付款时间：{this.props.orderInfo.payTime || '--'}</div> : null}
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
              <div>数量：{this.props.orderInfo.count || ''}</div>
              <div>实付款：￥{this.props.orderInfo.fee || ''}</div>
          </div>
          { /** 只有评估卡有常见问题 **/
              type === 5 ? (
                  <List>
                      <Item arrow="horizontal" onClick={() => this.props.history.push('/my/useofknow')}>常见问题</Item>
                  </List>
              ) : null
          }

          {(() => {
              switch(this.props.orderInfo.activityStatus){
                  case 1: return (
                      <div className="thefooter page-flex-row flex-ai-center flex-jc-end">
                          <a onClick={() => this.onPass(2)}>审核不通过</a>
                          <a className="blue" onClick={() => this.onPass(1)}>审核通过</a>
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
    actions: bindActionCreators({ mallOrderQuery, mallOrderDel, setAuditList }, dispatch),
  })
)(HomePageContainer);
