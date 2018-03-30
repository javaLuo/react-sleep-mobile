/* 确认支付页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import tools from '../../../../util/all';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { List, Toast, DatePicker, Picker } from 'antd-mobile';
import ImgDiZhi from '../../../../assets/dizhi@3x.png';
import StepperLuo from '../../../../a_component/StepperLuo';
// ==================
// 本页面所需action
// ==================

import { shopStartPayOrder, placeAndOrder, queryCustomerList, saveOrderInfo } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        formCount: this.props.orderParams.params.count, // 购买数量
        formServiceTime: new Date(new Date().getTime() + 86400000),  // 服务时间
        formJifei: this.props.orderParams.params.feeType ? [this.props.orderParams.params.feeType] : undefined,    // 计费方式
        formPaiDan: [1],  // 派单方式，1自动，2手动，默认自动
        formServerMan: undefined,    // 安装工ID
        serverList: [], // 当前区域下的安装工列表
    };
  }

  componentWillMount() {
      // 如果没有选择商品就跳转到我的订单
      if (!this.props.orderParams || !this.props.orderParams.nowProduct) {
        this.props.history.replace('/my/order');
      }
  }

  componentDidMount() {
      document.title = '订单确认';
      // sessionStorage.removeItem('pay-obj');
      // sessionStorage.removeItem('pay-info');
      sessionStorage.removeItem('pay-start');
      this.queryCustomerList();
  }

  // 获取安装工信息
    queryCustomerList() {
      const addr = this.props.orderParams.addr;
      console.log('收货地址信息：', addr);
      if (!addr) { return; }

      const params = {
        province: addr.province,
          city: addr.city,
          region: addr.region,
      };
      this.props.actions.queryCustomerList(params).then((res) => {
          console.log('查安装工列表返回：', res);
        if (res.status === 200) {
            this.setState({
                serverList: res.data,
            });
        }
      });
    }

    // form 购买数量被改变
    onCountChange(v) {
      this.setState({
          formCount: v,
      });
    }
  // 确认支付被点击，生成订单
    onSubmit() {
      console.log('收集的信息：', this.props.orderParams);
      const d = this.props.orderParams.nowProduct || { typeMode: {} };
      if(d.typeId !== 5 && !this.props.orderParams.params.addrId) {  // 除评估卡以外的产品需要收货地址
          Toast.info('请选择收货地址', 1);
          return;
      }
        if(d.typeId === 1 && !this.state.formJifei) { // 水机需要选择计费方式
            Toast.info('请选择计费方式', 1);
            return;
        }
      if(d.typeId === 1 && !this.state.formServiceTime) { // 水机需要选择安装时间
          Toast.info('请选择安装时间', 1);
          return;
      }
    if(Number(this.state.formPaiDan) === 2 && !this.state.formServerMan) { // 如果选择的是手动派单，但没选安装工
       Toast.info('请选择为您服务的安装工', 1);
       return;
    }
    // 获取安装工信息，如果有的话，没有返回null
        let serverMan = null;
        if (Number(this.state.formPaiDan) === 2) {
            serverMan = this.getInfoByServerManId(this.state.formServerMan[0]);
        }

      const params = {
          count: this.state.formCount,  // 购买数量
          serviceTime: tools.dateToStr(this.state.formServiceTime), // 安装时间
          feeType: this.state.formJifei ? this.state.formJifei[0] : undefined,  // 计费方式
          orderCode: d.typeCode,    // 商品ID
          orderFrom: 2,             // 支付方式： 2微信支付
          openAccountFee: d.typeModel.openAccountFee,   // 开户费
          fee: d.typeModel.price * this.state.formCount + d.typeModel.shipFee + d.typeModel.openAccountFee,
          customerId: serverMan && serverMan.id,
          customerName: serverMan && serverMan.name,
          customerPhone: serverMan && serverMan.phone,
      };
      // 保存购买数量、服务时间、开户费、总费用
      this.props.actions.shopStartPayOrder(params);

      const p = Object.assign({productId: d.id},this.props.orderParams.params, params);
      Toast.loading('正在创建订单',0);
      this.props.actions.placeAndOrder(tools.clearNull(p)).then((res) => {
          if (res.status === 200) {
              Toast.hide();
              sessionStorage.setItem('pay-info', JSON.stringify(res.data));                 // 将返回的订单信息存入sessionStorage
              sessionStorage.setItem('pay-obj', JSON.stringify(this.props.orderParams));    // 将当前所选择的商品信息存入session
              /** 普通商品跳转到付款选择页，活动物品直接跳转到订单详情 **/
              this.props.history.replace('/shop/payChose');
          } else {
              Toast.fail(res.message || '订单创建失败',1);
          }
      }).catch(() => {
          Toast.fail(res.message || '订单创建失败',1);
      });
      return true;
    }

    // 根据ID查询完整的安装工信息
    getInfoByServerManId(id) {
      console.log('什么情况：', id, this.state.formServerMan);
      const t = this.state.serverList.find((item) => item.id === id);
      console.log('得到的安装工222：', t);
      return t || null;
    }
    // 构建计费方式所需数据
    makeJiFeiData(data) {
        const d = data && data.typeModel && data.typeModel.chargeTypes ? data.typeModel.chargeTypes : [];
        return d.map((item) => {
            return { label: item.chargeName, value: item.id };
        });
    }

    // 服务时间被选择
    onDateChange(date) {
      this.setState({
          formServiceTime: date,
      });
    }

    // 计费方式选择
    onJiFeiChose(v) {
      this.setState({
          formJifei: v,
      });
    }

    // 派单方式选择
    onPaiDanChose(v) {
      console.log('派单选择了什么', v);
        this.setState({
            formPaiDan: v,
        });
        if (Number(v) === 2) {
            this.queryCustomerList();
        }
    }
    // 服务人员选择
    onServeChose(v) {
      console.log('选择了什么：', v);
      this.setState({
          formServerMan: v,
      });
    }

    // 选择这一个
    onChoseThis(item) {
        // 把所选择的地址存入购买数据
        this.props.actions.saveShopAddr(item);
        setTimeout(() => this.props.history.go(-1));
    }

    // 允许购买的最大数量
    canBuyHowMany(type) {
        // 0-其他 1-水机 2-养未来，3-冷敷贴 4-水机续费订单 5-精准体检 6-智能睡眠
        switch(Number(type)) {
            case 0: return 5;
            case 1: return 1;
            case 2: return 3;
            case 3: return 2;
            case 4: return 1;
            case 5: return 5;
            case 6: return 5;
            default: return 5;
        }
    }
    getSex(sex) {
        switch(Number(sex)) {
            case 1: return '男';
            case 2: return '女';
            default: return '';
        }
    }
  render() {
      const d = this.props.orderParams.nowProduct || {typeModel: {}}; // 当前商品对象
      const addr = this.props.orderParams.addr;   // 当前选择的收货地址
      const nowParams = this.props.orderParams.params;  // 当前订单的参数
      console.log(d, nowParams);
    return (
      <div className="flex-auto page-box confirm-pay">
          {
              d && d.typeId !== 5 ? (
                  <List className="mb">
                      <Item
                          thumb={<img src={ImgDiZhi} />}
                          extra={ addr ? null : "请选择收货地址"}
                          className={'normal-item'}
                          multipleLine
                          arrow={'horizontal'}
                          onClick={() => this.props.history.push('/my/addr/2')}
                      >
                          {
                              addr ? `收货人：${addr.contact}  ${this.getSex(addr.sex)}` : null
                          }
                          {
                              addr ? (<Brief>
                                  <div>电话：{addr.mobile || ''}</div>
                                  <div className="all_warp">收货地址：{`${addr.province || ''}${addr.city || ''}${addr.region || ''}${addr.street}`}</div>
                              </Brief>) : null
                          }
                      </Item>
                  </List>
              ) : null
          }
          <List className="mb">
              <Item
                  className={'this-item'}
                thumb={d.productImg ? <img src={d.productImg.split(',')[0]} /> : null}
                multipleLine
              >
                  {d.name}<Brief><span style={{ color: '#fc4800' }}>￥{d && (d.typeModel.price + (d.typeModel.openAccountFee || 0))}</span></Brief>
              </Item>
          </List>
          <List>
              <Item extra={d && d.typeId === 1 ? '仅限1台' : <StepperLuo min={1} max={this.canBuyHowMany(d && d.typeId)} value={this.state.formCount} onChange={(v) => this.onCountChange(v)}/>}>购买数量</Item>
              {
                  /** 只有水机有计费方式选择(typeId === 1) **/
                  d && d.typeId === 1 ? (
                      <Picker
                          data={this.makeJiFeiData(d)}
                          extra={''}
                          value={this.state.formJifei}
                          cols={1}
                          onOk={(v) => this.onJiFeiChose(v)}
                      >
                          <Item arrow="horizontal" className="special-item">计费方式</Item>
                      </Picker>
                  ) : null
              }
              {
                  /** 只有水机有服务时间(typeId === 1) **/
                  d && d.typeId === 1 ? (
                      <DatePicker
                          mode="date"
                          title="安装时间"
                          extra="Optional"
                          value={this.state.formServiceTime}
                          minDate={new Date(new Date().getTime() + 86400000)}
                          onChange={date => this.onDateChange(date)}
                      >
                        <Item extra={`￥${d.typeModel.openAccountFee}`} arrow={'horizontal'}>安装时间</Item>
                      </DatePicker>
                  ) : null
              }
              {
                  /**
                   * 只有水机有派单方式(typeId === 1)
                   * 只有选择了地址才会出现派单方式
                   * **/
                  d && d.typeId === 1 ? (
                      <Picker
                          data={[{ label: '自动派单', value: 1 }, { label: '手动指派', value: 2 }]}  // , { label: '手动指派', value: 2 }
                          extra={''}
                          value={this.state.formPaiDan}
                          cols={1}
                          onOk={(v) => this.onPaiDanChose(v)}
                      >
                          <Item arrow="horizontal" className="special-item">派单方式</Item>
                      </Picker>
                  ) : null
              }
              {
                  /**
                   * 安装工
                   * 只有派单方式选择手动才会出现
                   * **/
                  Number(this.state.formPaiDan) === 2 ? (
                      <Picker
                          data={this.state.serverList.map((item) => ({ label: `${item.name || item.realName} ${tools.addMosaic(item.phone)}`, value: item.id }))}
                          value={this.state.formServerMan}
                          cols={1}
                          onOk={(v) => this.onServeChose(v)}
                      >
                          {/*<Item*/}
                              {/*arrow="horizontal"*/}
                              {/*className="special-item"*/}
                              {/*extra={this.state.formServerMan ? this.getInfoByServerManId(this.state.formServerMan[0]).name : '请选2择'}*/}
                          {/*>服务人员</Item>*/}
                          <div className="am-list-item special-item am-list-item-middle hoho">
                              <div className="am-list-line">
                                  <div className="am-list-content">服务人员</div>
                                  <div className="am-list-extra">{this.state.formServerMan ? (() => {
                                      const d = this.getInfoByServerManId(this.state.formServerMan[0]);
                                      return d && `${d.name} ${d.phone}`;
                                  })() : '请选择'}</div>
                                  <div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true" />
                              </div>
                          </div>
                      </Picker>
                  ) : null
              }
              {
                  // d.typeModel.openAccountFee
                  d && d.typeId === 1 ? (
                      [<Item
                          key="0"
                          extra={`￥${(d.typeModel ? d.typeModel.price * this.state.formCount + d.typeModel.shipFee + d.typeModel.openAccountFee : 0).toFixed(2)}`}
                          align={'top'}
                          className={"this-speacl-item"}
                      >首年度预缴</Item>,
                      <div className={"year-info-box"} key="1">
                          <div className="year-info mb">采用流量计费方式：额外免费享受180元的净水服务费额度；</div>
                          <div className="year-info">采用包年计费方式：额外享受2个月的免费净水服务费，即首次预缴净水服务费后，首个净水服务周期为14个月。</div>
                      </div>
                      ]
                  ) : null
              }
              {
                  /** 水机和评估卡没有运费(typeId === 1，5) **/
                  d && ![1,5].includes(d.typeId) ? (
                      <Item extra={`￥${d.typeModel ? d.typeModel.shipFee : '0'}`}>运费</Item>
                  ) : null
              }
          </List>
          <div className="zw46"/>
          <div className="thefooter page-flex-row">
              <div className="flex-auto" style={{ padding: '0 .2rem' }}>合计：￥ {(d.typeModel ? d.typeModel.price * this.state.formCount + d.typeModel.shipFee + d.typeModel.openAccountFee : 0).toFixed(2)}</div>
              <div className="flex-none submit-btn" onClick={() => this.onSubmit()}>确认支付</div>
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
  orderParams: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    orderParams: state.shop.orderParams,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ shopStartPayOrder, placeAndOrder, queryCustomerList, saveOrderInfo }, dispatch),
  })
)(HomePageContainer);
