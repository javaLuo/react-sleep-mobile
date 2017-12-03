/* 商品详情页 */

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

import { Carousel, List, Stepper, Modal, Button, Toast } from 'antd-mobile';
import Img1 from '../../../../assets/test/test1.jpg';

// ==================
// 本页面所需action
// ==================

import { productById, shopStartPreOrder, getAllChargeTypes } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: null, // 当前商品数据
        jifeiShow: false,   //  计费选择框是否显示
        formJifei: null,   // 当前选择的计费方式
        formCount: 1,   // 购买数量
    };
  }

  componentDidMount() {
      // 通过URL中传来的商品ID获取商品信息
      const id = Number(this.props.location.pathname.split('/').reverse()[0]);
      if(!isNaN(id)) {
          this.getData(id);
      }
      // 获取所有收费方式
      if (!this.props.allChargeTypes.length) {
          this.getAllChargeTypes();
      }
  }

  // 获取原始数据
  getData(id) {
    this.props.actions.productById({ productId: id }).then((res) => {
        if(res.status === 200) {
            this.setState({
                data: res.data,
            });
        } else {
            Toast.fail(res.message);
        }
    });
  }

  // 获取收费方式
    getAllChargeTypes() {
      this.props.actions.getAllChargeTypes();
  }

  // 工具 - 根据Code获取销售方式
  getNameBySaleMode(code) {
      switch(code) {
          case 1: return '租赁';
          case 2: return '买卖';
          case 3: return '服务';
          default: return '';
      }
  }

  // 工具 - 根据收费方式ID查询收费方式名称
    getNameByChargeID(id) {

      const t = this.props.allChargeTypes.find((item) => item.id === id);
      return t ? t.dicValue : '';
    }

  // 计费方式选择 弹窗出现 水机专用
  onChoseJiFei() {
    this.setState({
        jifeiShow: true,
    });
  }

  // 计费方式 关闭
  onJiFeiClose() {
      this.setState({
          jifeiShow: false,
      });
  }

  // 计费方式选择确定
  onJiFeiChose(id) {
    this.setState({
        formJifei: id,
        jifeiShow: false,
    });
  }

  // 购买数量改变时触发
  onCountChange(v) {
      if (!this.state.data || !this.state.data.amount) {
          Toast.fail('该商品暂时无货');
          return;
      }
      if (v <= this.state.data.amount) {
          this.setState({
              formCount: v,
          });
      }
  }

  // 查看当前商品适用的体验店
  onSeeExpreShop() {
      this.props.history.push('/shop/exprshop');
  }

  // 点击立即下单
  onSubmit() {
      const userinfo = localStorage.getItem('userinfo');
      if (!userinfo) {
          Toast.info('请先登录');
          this.props.history.push('/login');
          return;
      } else if (!this.state.formCount){
          Toast.fail('请选择购买数量');
          return;
      }

      const params = { count: this.state.formCount, feeType: this.state.formJifei };
      const nowProduct = this.state.data;
      this.props.actions.shopStartPreOrder(params, nowProduct);
      this.props.history.push('/shop/confirmpay');
  }

  render() {
      console.log('有了吗：', this.props.allChargeTypes);
      const d = this.state.data;
    return (
      <div className="flex-auto page-box gooddetail-page">
          {/* 顶部图片 */}
          <div className="title-pic page-flex-row flex-ai-center flex-jc-center">
              <img src={Img1} />
          </div>
          {/* 商品信息说明 */}
          <div className="goodinfo">
              <div className="title">AAAA{d && d.name}</div>
              <div className="info">
                  <div className="cost">￥ <span>1000{d && d.price}</span></div>
              </div>
              <div className="server page-flex-row">
                  <div>运费：￥ {(d && d.amount) || 0}</div>
                  <div>有效期：一年</div>
                  <div>已售：3234{d && (d.buyCount || 0)}张</div>
              </div>
          </div>
          {/* List */}
          <List>
              {/*<Item extra={this.getNameByChargeID(this.state.formJifei)} arrow="horizontal" multipleLine onClick={() => this.onChoseJiFei()}>收费方式</Item>*/}
              <Item extra={<Stepper style={{ width: '100%', minWidth: '100px' }} min={1} max={99} showNumber size="small" value={this.state.formCount} onChange={(e) => this.onCountChange(e)}/>}>选择数量</Item>
              <Item extra={this.getNameByChargeID(this.state.formJifei)} onClick={() => this.onSeeExpreShop()} arrow="horizontal" multipleLine>查看适用体验店</Item>

              <Item >详情</Item>
          </List>
          <div className="detail-box">
              {(d && d.detailImg) ? <img src={d.detailImg} /> : <img src={Img1} />}
          </div>
          <div className="play">
              <Button type="primary" onClick={() => this.onSubmit()}>立即下单</Button>
          </div>
          <Modal
              popup
              visible={this.state.jifeiShow}
              animationType="slide-up"
              onClose={() => this.onJiFeiClose()}
          >
              <div style={{ padding: '10px' }}>
                  {this.props.allChargeTypes.map((item, index) => {
                     return <Button key={index} className="jifei-btn" type="primary" onClick={() => this.onJiFeiChose(item.id)}>{item.dicValue}</Button>;
                  })}
              </div>
          </Modal>
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
    allChargeTypes: P.array,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allChargeTypes: state.shop.allChargeTypes,    // 所有的收费方式
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ productById, shopStartPreOrder, getAllChargeTypes, }, dispatch),
  })
)(HomePageContainer);
