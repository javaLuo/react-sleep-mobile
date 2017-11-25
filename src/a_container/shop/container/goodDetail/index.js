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

import { productById } from '../../../../a_action/shop-action';

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
        formJifei: 0,   // 当前选择的计费方式，默认0
        formCount: 0,   // 购买数量
    };
  }

  componentDidMount() {
      console.log('是个啥：', this.props.location);
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

  // 工具 - 根据Code获取销售方式
  getNameBySaleMode(code) {
      switch(code) {
          case 1: return '租赁';
          case 2: return '买卖';
          case 3: return '服务';
          default: return '';
      }
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
  render() {
      const d = this.state.data;
    return (
      <div className="flex-auto page-box gooddetail-page">
          {/* 顶部轮播 */}
          {
              d && d.productImg ?
              <Carousel
                  className="my-carousel"
                  autoplay
                  infinite
                  swipeSpeed={35}
              >
                  {d.productImg.split(',').map((item, index) => <img key={index} src={item} />) }
              </Carousel> :
              <div className="my-carousel"><img src={Img1} /></div>
          }
          {/* 商品信息说明 */}
          <div className="goodinfo">
              <div className="title">{d && d.name}</div>
              <div className="info">
                  <div>型号：{d && d.typeCode}</div>
                  <div>销售方式：{d && this.getNameBySaleMode(d.saleMode)}</div>
                  <div className="cost">￥ {d && d.price}</div>
              </div>
              <div className="server page-flex-row">
                  <div>库存：{d && d.amount}</div>
                  <div>销量：{d && (d.buyCount || 0)}</div>
              </div>
          </div>
          {/* List */}
          <List>
              {/*<Item extra={"包年计费：￥1500/年"} arrow="horizontal" multipleLine onClick={() => this.onChoseJiFei()}>计费方式</Item>*/}
              <Item extra={<Stepper style={{ width: '100%', minWidth: '100px' }} min={0} max={99} showNumber size="small" value={this.state.formCount} onChange={(e) => this.onCountChange(e)}/>}>购买数量</Item>
              <Item >产品参数</Item>
          </List>
          <div className="detail-box">
              {(d && d.detailImg) ? <img src={d.detailImg} /> : <img src={Img1} />}
          </div>
          <div className="play">
              <Button type="default">立即下单</Button>
          </div>
          <Modal
              popup
              visible={this.state.jifeiShow}
              animationType="slide-up"
              onClose={() => this.onJiFeiClose()}
          >
              <div style={{ padding: '10px' }}>
                <Button type="primary" onClick={() => this.onJiFeiChose(0)}>包年计费：￥1500/年</Button>
                  <div style={{marginTop: '10px'}}/>
                <Button type="primary" onClick={() => this.onJiFeiChose(1)}>流量计费：￥0.38/升 预付￥1500</Button>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({

  }), 
  (dispatch) => ({
    actions: bindActionCreators({ productById }, dispatch),
  })
)(HomePageContainer);
