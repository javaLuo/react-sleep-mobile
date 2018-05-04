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
import WaterWave from 'water-wave';
// ==================
// 所需的所有组件
// ==================
import tools from '../../../../util/all';
import { Carousel, List, Modal, Button, Toast, Picker, Icon} from 'antd-mobile';
import StepperLuo from '../../../../a_component/StepperLuo';
import ImgTest from '../../../../assets/test/new.png';
import ImgKiss from '../../../../assets/shop/good@3x.png';
import VideoLuo from '../../../../a_component/video';
import ImgKf from './assets/kf@2x.png';
import ImgGwc from './assets/gwc@2x.png';
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
        data: {}, // 当前商品数据
        formJifei: undefined,   // 当前选择的计费方式
        formCount: 1,   // 购买数量
        loading: false, // 是否正在异步请求中
        imgHeight: 200,
        show: false,
        titleChose: 1,  // 1视频，2图片
    };
  }

  componentDidMount() {
      document.title = '商品详情';
      // 通过URL中传来的商品ID获取商品信息
      const id = Number(this.props.location.pathname.split('/').reverse()[0]);
      Toast.loading('加载中…');
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
                show: true,
                formJifei: (res.data && res.data.typeModel && res.data.typeModel.chargeTypes) ? [res.data.typeModel.chargeTypes[0].id] : undefined, // 默认选择第1个
            });
            Toast.hide();
        } else {
            Toast.fail(res.message, 1);
        }
    }).catch(() => {
        this.props.history.go(-1);
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
      const d = this.state.data;
      if(d && d.typeId === 1){  // 水机
          this.props.history.push('/shop/exprshop2');
      } else {
          this.props.history.push('/shop/exprshop');
      }

  }

  // 点击立即下单
  onSubmit() {
      const u = this.props.userinfo;
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

  render() {
      const d = this.state.data || {};
      console.log('D是什么：', d);
    return (
      <div className={this.state.show ? 'flex-auto page-box gooddetail-page show' : 'flex-auto page-box gooddetail-page show'}>
          <div className="title-pic">
              {/* 顶部轮播 */}
              <VideoLuo
                videoPic={'https://isluo.com/kernel/index/img/welcome/theback.jpg'}
                videoSrc={'https://isluo.com/work/paomo/video/paomo_gem.mp4'}
                imgList={d.productImg ? d.productImg.split(',') : []}
              />
          </div>
          {/* 商品信息说明 */}
          <div className="goodinfo">
              <div className="title">{d && d.name}</div>
              <div className="info">
                  <div className="cost">￥ <span>{d && d.typeModel ? (d.typeModel.price + d.typeModel.openAccountFee) : "--"}</span></div>
              </div>
              <div className="server page-flex-row">
                  <div>运费：￥{d && d.typeModel ? (d.typeModel.shipFee || 0) : 0}</div>
                  { /** 只有评估卡显示有效期 **/
                      d && d.typeId === 5 ? (
                          <div>有效期：{ `${(d && d.typeModel) ? (d.typeModel.timeLimitNum || '') : ''}${(d && d.typeModel) ? this.getNameByTimeLimitType(d.typeModel.timeLimitType) : ''}` }</div>
                      ) : null
                  }
                  <div>
                      {(() => {
                          if (!d) {
                              return null;
                          }
                          if (d.activityType === 2) {   // 活动产品
                              return `${d.buyCount || 0}人申请`;
                          } else if (d.typeId === 1) { // 水机
                              return `已供：${ d && d.buyCount || 0}`;
                          }

                          return `已售：${ d && d.buyCount || 0}`;
                      })()}
                    </div>
              </div>
          </div>
          {/* List */}
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
                  d && [0,1,4,5,6].includes(d.typeId) ? (
                      <Item onClick={() => this.onSeeExpreShop()} arrow="horizontal" multipleLine>{d && d.typeId === 1 ? '可安装净水系统的区域查询': '查看适用体验店'}</Item>
                  ) : null
              }
              <Item extra={<span style={{ color: '#ff3929' }}>好评 0.00%</span>} arrow="horizontal">评价详情 (888)</Item>
          </List>
          <ul className="pj-ul">
              <li>
                  <div className="l">
                      <div className="l1">
                          <img className="pic" src={ImgTest} />
                          <div className="info">
                              <div className="name all_nowarp">{ tools.addMosaic('某某某某某某某') }</div>
                              <div className="time">2018-02-09</div>
                          </div>
                      </div>
                      <div className={"stars"}>
                          <img src={ImgKiss} />
                          <img src={ImgKiss} />
                          <img src={ImgKiss} />
                      </div>
                      <div className="words all_nowarp2">哎呀这东西就是好它好呀它好呀它好好好好好因为卖家说要返我两毛钱</div>
                  </div>
                  <div className="r">
                      <img src={ImgTest} />
                      <img src={ImgTest} />
                  </div>
              </li>
              <li>
                  <div className="l">
                      <div className="l1">
                          <img className="pic" src={ImgTest} />
                          <div className="info">
                              <div className="name all_nowarp">{ tools.addMosaic('某某某某某') }</div>
                              <div className="time">2018-02-09</div>
                          </div>
                      </div>
                      <div className={"stars"}>
                          <img src={ImgKiss} />
                          <img src={ImgKiss} />
                          <img src={ImgKiss} />
                      </div>
                      <div className="words all_nowarp2">哎呀这东西就是好它好呀它好呀它好好好好好因为卖家说要返我两毛钱</div>
                  </div>
                  <div className="r">
                      <img src={ImgTest} />
                      <img src={ImgTest} />
                  </div>
              </li>
              <li>
                  <div className="l">
                      <div className="l1">
                          <img className="pic" src={ImgTest} />
                          <div className="info">
                              <div className="name all_nowarp">{ tools.addMosaic('某某某某某某') }</div>
                              <div className="time">2018-02-09</div>
                          </div>
                      </div>
                      <div className={"stars"}>
                          <img src={ImgKiss} />
                          <img src={ImgKiss} />
                          <img src={ImgKiss} />
                      </div>
                      <div className="words all_nowarp2">哎呀这东西就是好它好呀它好呀它好好好好好因为卖家说要返我两毛钱</div>
                  </div>
                  <div className="r">
                      <img src={ImgTest} />
                      <img src={ImgTest} />
                  </div>
              </li>
          </ul>
          <div className="detail-box">
              {(d && d.detailImg) ? d.detailImg.split(',').map((item, index) => <img key={index} src={item} />) : null}
          </div>
          <div className="play">
              <div className="btn-normal">
                  <img src={ImgKf} />
                  <div>客服</div>
                  <WaterWave color="#888888" press="down"/>
              </div>
              <div className="btn-normal">
                  <img src={ImgGwc} />
                  <div>购物车</div>
                  <WaterWave color="#888888" press="down"/>
              </div>
              <div className="btn-add-gwc">加入购物车<WaterWave color="#cccccc" press="down"/></div>
              <div className="btn-submit" onClick={() => this.onSubmit()}>立即下单<WaterWave color="#cccccc" press="down"/></div>
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
