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
import { Button, List, Toast, Stepper, DatePicker } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { getAllChargeTypes, shopStartPayOrder, placeAndOrder } from '../../../../a_action/shop-action';

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
        formServiceTime: new Date(),  // 服务时间
    };
  }

  componentWillMount() {
      // 如果没有选择商品就跳转到商城主页
      if (!this.props.orderParams || !this.props.orderParams.nowProduct) {
          Toast.fail('您没有选择商品');
          // this.props.history.replace('/shop');
      }
  }

  componentDidMount() {
      // 获取所有收费方式
      if (!this.props.allChargeTypes.length) {
          this.getAllChargeTypes();
      }
  }

    // 获取收费方式
    getAllChargeTypes() {
        this.props.actions.getAllChargeTypes();
    }

    // 工具 - 根据收费方式ID查询收费方式名称
    getNameByChargeID(id) {
        const t = this.props.allChargeTypes.find((item) => item.id === id);
        return t ? t.dicValue : '';
    }

    // form 购买数量被改变
    onCountChange(v) {
      this.setState({
          formCount: v,
      });
    }
  // 立即支付被点击
    onSubmit() {
      const params = {
          count: this.state.formCount,
          serviceTime: this.state.formServiceTime,
          openAccountFee: 180,
          fee: this.props.orderParams.nowProduct.price * this.state.formCount + 180
      };
      this.props.actions.shopStartPayOrder(params);

      const p = Object.assign({productId: this.props.orderParams.nowProduct.id},this.props.orderParams.params, params);
      this.props.actions.placeAndOrder(p).then((res) => {

      });
      this.props.history.push('/shop/payChose');
    }

  render() {
      const nowData = this.props.orderParams.nowProduct || {}; // 当前商品对象
      const nowParams = this.props.orderParams.params;  // 当前订单的参数
      console.log(nowData, nowParams);
      const d = new Date(); // 当前时间，设置选择时间的最小值和最大值有用
    return (
      <div className="flex-auto page-box confirm-pay">
          <List>
              {/*<Item*/}
                {/*arrow="horizontal"*/}
                {/*multipleLine*/}
              {/*>*/}
                  {/*<Brief>收货人：123<br/>联系方式:23423434<br/>地址：AAAAAAAAA</Brief>*/}
              {/*</Item>*/}
              <Item
                thumb="#"
                multipleLine
              >
                  消费卡消费卡{nowData.name}<Brief>型号：{nowData.typeCode}<br/>计费方式：{this.getNameByChargeID(nowParams.feeType)}</Brief>
              </Item>
              <Item extra={<Stepper style={{ width: '100%', minWidth: '100px' }} min={1} max={99} showNumber size="small" value={this.state.formCount} onChange={(e) => this.onCountChange(e)}/>}>购买数量</Item>
              {/*<DatePicker*/}
                  {/*value={this.state.formServiceTime}*/}
                  {/*onChange={date => this.setState({ formServiceTime: date })}*/}
                  {/*minDate={d}*/}
                  {/*maxDate={new Date(d.getFullYear(), d.getMonth() + 3, d.getDay())}*/}
              {/*>*/}
                  {/*<List.Item>配送时间</List.Item>*/}
              {/*</DatePicker>*/}
              {/*<Item*/}
                  {/*arrow="horizontal"*/}
                  {/*extra={'系统派单'}*/}
              {/*>*/}
                  {/*安装人员*/}
              {/*</Item>*/}
              {/*<Item*/}
                  {/*extra={`180.00 元`}*/}
              {/*>*/}
                  {/*开户费*/}
              {/*</Item>*/}
              {/*<Item*/}
                  {/*extra={`小计：${(nowData.price * this.state.formCount + 180).toFixed(2)}元`}*/}
              {/*>*/}
                  {/*{''}*/}
              {/*</Item>*/}
          </List>
          <div className="thefooter page-flex-row">
              <div className="flex-auto" style={{ padding: '0 .2rem' }}>合计：￥ {(nowData.price * this.state.formCount).toFixed(2)}</div>
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
    allChargeTypes: P.array,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    orderParams: state.shop.orderParams,
    allChargeTypes: state.shop.allChargeTypes,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getAllChargeTypes, shopStartPayOrder, placeAndOrder }, dispatch),
  })
)(HomePageContainer);
