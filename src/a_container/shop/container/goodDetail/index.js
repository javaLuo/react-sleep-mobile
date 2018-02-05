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

import { Carousel, List, Stepper, Modal, Button, Toast, Picker } from 'antd-mobile';
import imgDefault from '../../../../assets/logo-img.png';

// ==================
// 本页面所需action
// ==================

import { productById, shopStartPreOrder, appUserCheckBuy, getDefaultAttr } from '../../../../a_action/shop-action';

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
        formJifei: null,   // 当前选择的计费方式
        formCount: 1,   // 购买数量
        loading: false, // 是否正在异步请求中
    };
  }

  componentDidMount() {
      document.title = '商品详情';
      // 通过URL中传来的商品ID获取商品信息
      const id = Number(this.props.location.pathname.split('/').reverse()[0]);
      if(!isNaN(id)) {
          this.getData(id);
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

  // 构建计费方式所需数据
    makeJiFeiData(data) {
      const d = data && data.typeModel && data.typeModel.chargeTypes ? data.typeModel.chargeTypes : [];
      return d.map((item) => {
          return { label: item.chargeName, value: item.id };
      });
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

  // 工具 - 根据有效期类型ID获取名称
    getNameByTimeLimitType(id) {
        switch(String(id)) {
            case '0': return '长期有效';
            case '1': return '天';
            case '2': return '月';
            case '3': return '年';
            default: return '';
        }
    }

  // 计费方式选择确定
  onJiFeiChose(id) {
    this.setState({
        formJifei: id,
    });
  }

  // 购买数量改变时触发
  onCountChange(v) {
      this.setState({
          formCount: v,
      });
  }

  // 查看当前商品适用的体验店
  onSeeExpreShop() {
      this.props.history.push('/shop/exprshop');
  }

  // 点击立即下单
  onSubmit() {
      const u = this.props.userinfo;
      console.log('用户信息：', u, this.state.data);
      if (!u) {
         Toast.info('请先登录', 1);
         this.props.history.push(`/login`);
         return false;
      } else if (!u.mobile){
          Toast.info('请先绑定手机号', 1);
          this.props.history.replace(`/my/bindphone`);
          return false;
      }else if (!this.state.formCount){
          Toast.info('请选择购买数量',1);
          return false;
      } else if (this.state.data.typeId === 1 && !this.state.formJifei) { // 水机需要选择计费方式
          Toast.info('请选择计费方式', 1);
          return;
      }

      // 检查当前用户是否有权限购买当前物品
      this.props.actions.appUserCheckBuy({ productType: String(this.state.data.typeName.code) }).then((res) => {
            if (res.status === 200) { // 有权限
                const params = { count: this.state.formCount, feeType: this.state.formJifei ? this.state.formJifei[0] : undefined };
                const nowProduct = this.state.data;
                this.props.actions.shopStartPreOrder(params, nowProduct); // 保存当前用户选择的信息（所选数量、）
                // 实物商品提前查询默认收货地址
                if (this.state.data.typeId !== 5) {
                    this.props.actions.getDefaultAttr();
                }
                this.props.history.push('/shop/confirmpay');
            } else {
                alert('温馨提示', '您当前还没有购买该产品的权限哦', [
                    { text: '知道了', onPress: () => console.log('cancel') },
                    {
                        text: '查看权限规则',
                        onPress: () => new Promise((resolve, rej) => {
                            this.props.history.push('/my/atcat');
                            resolve();
                        }),
                    },
                ]);
            }
      });
  }

  render() {
      const d = this.state.data;
    return (
      <div className="flex-auto page-box gooddetail-page">
          <div className="title-pic">
              {/* 顶部轮播 */}
              {
                  d && d.productImg ? <Carousel
                      className="my-carousel"
                      autoplay
                      infinite
                      swipeSpeed={35}
                  >
                      {d.productImg.split(',').map((item, index) => {
                          return <img key={index} src={item} onLoad={() => {
                              window.dispatchEvent(new Event('resize'));
                          }}/>;
                      })}
                  </Carousel> : <img className="default" src={imgDefault} />
              }
          </div>
          {/* 商品信息说明 */}
          <div className="goodinfo">
              <div className="title">{d && d.name}</div>
              <div className="info">
                  <div className="cost">￥ <span>{d && d.typeModel.price}</span></div>
              </div>
              <div className="server page-flex-row">
                  <div>运费：￥{d && d.typeModel ? (d.typeModel.shipFee || 0) : 0}</div>
                  <div>有效期：{ `${(d && d.typeModel) ? (d.typeModel.timeLimitNum || '') : ''}${(d && d.typeModel) ? this.getNameByTimeLimitType(d.typeModel.timeLimitType) : ''}` }</div>
                  <div>已售：{d && (d.buyCount || 0)}张</div>
              </div>
          </div>
          {/* List */}
          <List>
              <Item extra={ d && d.typeId === 1 ? '1' : <Stepper style={{ width: '100%', minWidth: '100px' }} min={1} max={5} showNumber size="small" value={this.state.formCount} onChange={(e) => this.onCountChange(e)}/>}>购买数量</Item>
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
                          <Item arrow="horizontal">计费方式</Item>
                      </Picker>
                  ) : null
              }

              <Item onClick={() => this.onSeeExpreShop()} arrow="horizontal" multipleLine>查看适用体验店</Item>
          </List>
          <div className="detail-box">
              {(d && d.detailImg) ? <img src={d.detailImg} /> : null}
          </div>
          <div className="play">
              <Button type="primary" onClick={() => this.onSubmit()}>立即下单</Button>
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
  userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allChargeTypes: state.shop.allChargeTypes,    // 所有的收费方式
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ productById, shopStartPreOrder, appUserCheckBuy, getDefaultAttr}, dispatch),
  })
)(HomePageContainer);
