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
          this.props.history.replace('/');
      }
  }

  componentDidMount() {
      // 获取所有收费方式 暂时没有收费方式
      // if (!this.props.allChargeTypes.length) {
      //     this.getAllChargeTypes();
      // }
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
        // const nowData = this.props.orderParams.nowProduct || {}; // 当前商品对象
        // if (!nowData || !nowData.amount) {
        //     Toast.fail('该商品暂时无货');
        //     return;
        // }
        // if (v <= nowData.amount) {
        //     this.setState({
        //         formCount: v,
        //     });
        // }
      this.setState({
          formCount: v,
      });
    }
  // 确认支付被点击，生成订单
    onSubmit() {
      console.log('什么万一：', this.props.orderParams);
      const params = {
          count: this.state.formCount,
          serviceTime: tools.dateToStr(this.state.formServiceTime),
          orderCode: this.props.orderParams.nowProduct.typeCode,
          orderFrom: tools.isWeixin() ? 2 : 3,
          openAccountFee: 0,
          fee: this.props.orderParams.nowProduct.price * this.state.formCount
      };
      this.props.actions.shopStartPayOrder(params);

      const p = Object.assign({productId: this.props.orderParams.nowProduct.id},this.props.orderParams.params, params);
        Toast.loading('正在创建订单');
      this.props.actions.placeAndOrder(p).then((res) => {
          if (res.status === 200) {
              Toast.hide();
              // 将返回的订单信息存入sessionStorage
              sessionStorage.setItem('pay-info', JSON.stringify(res.data));
              this.props.history.push('/shop/payChose');
          } else {
              Toast.fail(res.message || '订单创建失败');
          }
      }).catch(() => {
          Toast.fail(res.message || '订单创建失败');
      });
    }

  render() {
      const nowData = this.props.orderParams.nowProduct || {}; // 当前商品对象
      const nowParams = this.props.orderParams.params;  // 当前订单的参数
      console.log(nowData, nowParams);
    return (
      <div className="flex-auto page-box confirm-pay">
          <List>
              <Item
                thumb={nowData.productImg ? <img src={nowData.productImg.split(',')[0]} /> : null}
                multipleLine
              >
                  {nowData.name}<Brief>&#12288;</Brief>
              </Item>
              <Item extra={<Stepper style={{ width: '100%', minWidth: '100px' }} min={1} max={5} showNumber size="small" value={this.state.formCount} onChange={(e) => this.onCountChange(e)}/>}>购买数量</Item>
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
