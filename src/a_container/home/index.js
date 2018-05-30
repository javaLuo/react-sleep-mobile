/* 主页 */

// ==================
// 所需的各种插件
// ==================
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import config from '../../config';
import P from 'prop-types';
import './index.scss';
import tools from '../../util/all';

// ==================
// 所需的所有组件
// ==================
import { Icon } from "antd";
import { Toast } from 'antd-mobile';
import WaterWave from 'water-wave';
import { Carousel } from 'antd-mobile';
import ImgZiXun from '../../assets/home/home_zixun@3x.png';
import ImgZhiBo from '../../assets/home/home_zhibo@3x.png';
import ImgTiYan from '../../assets/home/home_tiyan@3x.png';
import ImgShangCheng from '../../assets/home/home_shangcheng@3x.png';
import ImgStar1 from '../../assets/home/star_1@3x.png';
import ImgLikeThis from '../../assets/home/likethis@3x.png';
import ImgLooked from '../../assets/home/looked@3x.png';
import ImgTime from '../../assets/home/thetime@3x.png';
import ImgCar from '../../assets/shop/jrgwc@3x.png';
// ==================
// 本页面所需action
// ==================

import { mallApList, getOrdersCount, getLiveListCache, getLiveTypes, pushCarInterface } from '../../a_action/shop-action';
import { getRecommend, getActivityList, getGoodServiceStations, inputStation, shopCartCount } from '../../a_action/new-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: 0,
        imgHeight: 'calc(100vw * 0.43)',
        activeCount: 0,
        stations: [],   // 5个推荐的体验店
    };
    this.show = 0;
  }

  componentWillMount(){

  }

  componentDidMount() {
      document.title = '翼猫健康e家';
    // 获取轮播图
    if (!this.props.homePics || this.props.homePics.length === 0) {
      this.props.actions.mallApList({ typeCode: 'slideshow' }).finally(()=>{
          this.getShow();
      });
    } else {
        this.getShow();
    }
    // 获取热销产品
    if(!this.props.homeRecommend || !this.props.homeRecommend.length) {
        this.getRecommend();
    } else {
        this.getShow();
    }
    // 获取推荐视频
    if (!this.props.liveHot || !this.props.liveHot.length) {
        this.getLiveHot();
    }else {
        this.getShow();
    }
    // 获取视频分类
      if (!this.props.liveTypes || !this.props.liveTypes.length) {
        this.getLiveTypes();
      }
      // 获取热门活动
      if (!this.props.activityList || !this.props.activityList.length) {
        this.getActivityList();
      }else {
          this.getShow();
      }
      // 获取有多少人参加活动
    this.getOrdersCount();

    // 获取购物车数量
      this.props.actions.shopCartCount();

    // 获取推荐服务站
      this.getGoodServiceStations();
  }

  getShow(){
      this.show = this.show+1;
      if(this.show >= 3){
          this.setState({
              show: true,
          });
      }
  }

  // 获取热销产品
    getRecommend() {
      this.props.actions.getRecommend().finally(()=>{
          this.getShow();
      });
    }

    // 获取推荐服务站
    getGoodServiceStations() {
      this.props.actions.getGoodServiceStations({ pageNum: 1, pageSize: 5 }).then((res) => {
        if(res.status === 200) {
            this.setState({
                stations: res.data.result || [],
            });
        }
      }).finally(() => {
          this.getShow();
      });
    }
    // 获取热门活动
    getActivityList() {
        this.props.actions.getActivityList().finally(() => {
            this.getShow();
        });
    }

    // 获取视频热门直播
    getLiveHot() {
      const params = {
          liveTypeId: null,
          recommend: 1, // 查推荐视频
          pageNum: 1,
          pageSize: 10,
      };
      this.props.actions.getLiveListCache(params).finally(() => {
          this.getShow();
      });
    }
    // 获取视频分类
    getLiveTypes() {
        this.props.actions.getLiveTypes();
    }
    // 工具 - 根据ID获取对应的分类对象
    getLiveTypeById(id) {
      return this.props.liveTypes.find((item, index) => item.id === id) || {};
    }

  // 获取活动有多少人参加
    getOrdersCount() {
      this.props.actions.getOrdersCount().then((res) => {
          if (res.status === 200) {
              this.setState({
                  activeCount: res.data,
              });
          }
      });
    }

    // 点击linkBar导航到不同页面
    onLinkClick(type) {
      switch(type) {
          // 跳健康资讯
          case 1:
              // 到商城
              this.props.history.push('/shop');
              break;
          case 2:
              const u = this.props.userinfo;
              let str = '';
              if (u && u.id) {  // 有用户信息
                  str = `&e=${u.id}`;
              }
              window.open(`http://e.yimaokeji.com/index.php?m=article&f=browse&t=mhtml&categoryID=3&pageID=1${str}`);
              break;
          // 跳视频直播
          case 3:
              // window.open('http://tv.yimaokeji.com/watch/1447826');
              this.props.history.push('/live');
              break;
          // 跳翼猫体验店查询
          case 4:
              this.props.history.push('/shop/exprshop2');
      }
    }

    // 点击热销产品 跳转到商品详情页
    onRecommendClick(id) {
      this.props.history.push(`/shop/gooddetail/${id}`);
    }
    // 点击视频 跳转到对应视频详情页
    zbClick(id) {
        window.open(`${config.baseURL}/mall/live/show?liveId=${id}`);
    }
    // 保存当前服务站信息，并进入服务站详情页
    inputStation(data) {
      //this.props.actions.inputStation(data);
      this.props.history.push(`/shop/exprdetail/${data.id}`);
    }

    // 将商品添加进购物车
    onPushCar(e, id) {
        e.stopPropagation();
        if(this.props.shoppingCarNum >= 200) {
            Toast.info('您购物车内的商品数量过多，清理后方可加入购物车', 2);
            return;
        }
        this.props.actions.pushCarInterface({ productId: id, number: 1 }).then((res) => {
            if(res.status === 200) {
                Toast.success('加入购物车成功',1);
                this.props.actions.shopCartCount();
            } else {
                Toast.info(res.message);
            }
        });
    }

  render() {
    const u = this.props.userinfo;
    const barData = [
        { title: '翼猫商城', pic: ImgShangCheng, key: 1 },
        { title: '健康资讯', pic: ImgZiXun, key: 2 },
        { title: '视频直播', pic: ImgZhiBo, key: 3 },
        { title: '体验店', pic: ImgTiYan, key: 4 },
    ];
    return (
      <div className={this.state.show  ? 'home-page show' : 'home-page'}>
          {/* 顶部轮播 */}
          {
              (this.props.homePics && this.props.homePics.length) ? (
                  <Carousel
                      className="my-carousel"
                      autoplay={true}
                      infinite={true}
                      swipeSpeed={35}
                  >
                      {this.props.homePics.map((item, index) => (
                          <a
                              key={index}
                              href={u ? `${item.url}&e=${u.id}` : item.url}
                              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                              target="_blank"
                          >
                            <img
                                src={item.adImg}
                                style={{ width: '100%', verticalAlign: 'top' }}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                    this.setState({ imgHeight: 'auto' });
                                }}
                            />
                          </a>
                      ))}
                  </Carousel>
              ) : <div style={{ height: `calc(100vw * 0.43)` }} />
          }
          {/** 上方4个圆导航按钮 **/}
          <div className="link-bar page-flex-row">
              {
                  barData.map((item, index) => <div key={index} onClick={() => this.onLinkClick(item.key)}>
                      <img className={`ball-animation ball${index}`} src={item.pic} />
                      <div>{item.title}</div>
                      <WaterWave color="#cccccc" press="down"/>
                  </div>)
              }
          </div>
          {/** 最新活动 **/}
          <div className="home-content-one">
              <div className="title">最新活动</div>
              <div className="active-bar" onClick={() => this.props.history.push('/shop/shopactive')}>
                  <div>已有<span>{this.state.activeCount}</span>人参与</div>
              </div>
              <ul className="active-list" style={{ display: this.props.activityList.length ? 'flex' : 'none' }}>
                  {
                      this.props.activityList.map((item, index) => {
                          let w = 'calc(50% - 5px)';
                          let marginLeft = '10px';
                          if((index+1)%2) {
                              marginLeft='0';
                          }
                          if (this.props.activityList.length % 2 && index === this.props.activityList.length -1) { // 奇数最后一个
                              w = '100%';
                          }
                          return (<li key={index} style={{ width: w, marginLeft }}>
                              <Link to={`/shop/activity/${item.id}`}>
                                  <img className="all_radius" src={item.acImg} />
                                  <WaterWave color="#cccccc" press="down"/>
                              </Link>
                          </li>);
                      })
                  }
              </ul>
          </div>
          {/** 热销产品 **/}
          <div className="home-content-one" style={{ display: this.props.homeRecommend.length ? 'block' : 'none' }}>
              <div className="title">热销产品</div>
              <ul className="hot-1">
                  { this.props.homeRecommend.filter((item, index) => index < 2).map((vv, ii) => {
                      return (
                          <li key={ii} onClick={() => this.onRecommendClick(vv.id)}>
                                  <div className="pic"><img className="all_radius" src={vv.detailImg && vv.detailImg.split(',')[0]}/></div>
                                  <div className="t all_nowarp2">{vv.name}</div>
                                  <div className="num">已售: {vv.buyCount}</div>
                                  <div className="m" onClick={(e) => this.onPushCar(e,vv.id)}><i>￥{tools.point2(vv.productModel.price+vv.productModel.openAccountFee)}</i><img src={ImgCar} /></div>
                                  <WaterWave color="#cccccc" press="down"/>
                          </li>
                      );
                  }) }
              </ul>
              <ul className="hot-2" style={{ display: this.props.homeRecommend.length>2 ? 'flex' : 'none' }}>
                  {
                      this.props.homeRecommend.filter((item, index) => index >= 2).map((item, index) => {
                          return (
                              <li key={index} onClick={() => this.onRecommendClick(item.id)}>
                                      <div className="pic"><img className="all_radius" src={item.detailImg && item.detailImg.split(',')[0]}/></div>
                                      <div className="t all_nowarp2">{item.name}</div>
                                      <div className="num">已售: {item.buyCount}</div>
                                      <div className="m" onClick={(e) => this.onPushCar(e,item.id)}><i>￥{tools.point2(item.productModel.price+item.productModel.openAccountFee)}</i><img src={ImgCar} /></div>
                                  <WaterWave color="#cccccc" press="down"/>
                              </li>
                          );
                      })
                  }
              </ul>
              <div className="foot"><WaterWave color="#cccccc" press="down"/><Link to={'/shop'}>查看全部 <Icon type="caret-right" /></Link></div>
          </div>
          {/** 视频直播 **/}
          <div className="home-content-one" style={{ display: this.props.liveHot.length ? 'block' : 'none' }}>
              <div className="title">视频直播</div>
              <ul className="zb-1">
                  {
                      this.props.liveHot.filter((item, index) => index===0).map((item, index) => {
                          return (
                              <li key={index} onClick={() => this.zbClick(item.liveId)}>
                                  <div className="pic"><img className="all_radius" src={item.coverImage}/></div>
                                  <div className="total">{this.getLiveTypeById(item.liveTypeId).name}</div>
                                  <WaterWave color="#cccccc" press="down"/>
                              </li>
                          );
                      })
                  }
              </ul>
              <ul className="zb-2" style={{ display: this.props.liveHot.length>1 ? 'flex' : 'none' }}>
                  {
                      this.props.liveHot.filter((item, index) => index>0).map((item, index) => {
                          return (
                              <li key={index} onClick={() => this.zbClick(item.liveId)}>
                                  <div className="pic"><img className="all_radius" src={item.coverImage}/></div>
                                  <div className="total">{this.getLiveTypeById(item.liveTypeId).name}</div>
                                  <WaterWave color="#cccccc" press="down"/>
                              </li>
                          );
                      })
                  }
              </ul>
              <div className="foot"><WaterWave color="#cccccc" press="down"/><Link to={'/live'}>查看全部 <Icon type="caret-right" /></Link></div>
          </div>
          {/** 翼猫体验店 **/}
          <div className="home-content-one">
              <div className="title">翼猫体验店</div>
              <ul className="tyd-1">
                  {
                      this.state.stations.map((item, index) => {
                          return (
                              <li key={index} onClick={() => this.inputStation(item)}>
                                  <div>
                                      <div className="total all_nowarp">{item.name}</div>
                                      <div className="star"><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /></div>
                                      {(() => {
                                          switch(index) {
                                              case 0 : return <div className="type">
                                                  <div>推荐</div>
                                              </div>;
                                              case 1: return <div className="type">
                                                  <div>人气</div>
                                              </div>;
                                              default: return null;
                                          }
                                      })()}
                                      <WaterWave color="#cccccc" press="down"/>
                                  </div>
                              </li>
                          );
                      })
                  }
              </ul>
              <div className="foot"><WaterWave color="#cccccc" press="down"/><Link to={"/shop/exprshop2"}>查看全部 <Icon type="caret-right" /></Link></div>
          </div>
          {/** 热门资讯 **/}
          {/*<div className="home-content-one">*/}
              {/*<div className="title">热门资讯</div>*/}
              {/*<ul className="new-1">*/}
                  {/*<li className="type1">*/}
                      {/*<div>*/}
                          {/*<div className="t all_warp">balabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabala<span className={'top'}>置顶</span></div>*/}
                          {/*<div className="info">*/}
                              {/*<span className="a">行业</span>*/}
                              {/*<span className="b"><img src={ImgLooked} />20000</span>*/}
                              {/*<span className="c"><img src={ImgLikeThis} />1500</span>*/}
                              {/*<span className="d"><img src={ImgTime} />2018-04-11</span>*/}
                          {/*</div>*/}
                      {/*</div>*/}
                      {/*<div className="new_pic" ><img src={ImgTest}/></div>*/}
                      {/*<WaterWave color="#cccccc" press="down"/>*/}
                  {/*</li>*/}
              {/*</ul>*/}
              {/*<div className="foot"><WaterWave color="#cccccc" press="down"/><a href={"http://e.yimaokeji.com/index.php?m=article&f=browse&t=mhtml&categoryID=3&pageID=1&e=10008"} target={"_blank"}>查看更多 <Icon type="caret-right" /></a></div>*/}
          {/*</div>*/}
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
    homePics: P.array,  // 首页顶部轮播图
    userinfo: P.any,
    homeRecommend: P.any,
    liveHot: P.any,
    liveTypes: P.any,
    activityList: P.any,
    shoppingCarNum: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      homePics: state.shop.homePics,  // 首页顶部轮播图
      userinfo: state.app.userinfo,
      homeRecommend: state.n.homeRecommend,
      liveHot: state.n.liveHot,
      liveTypes: state.shop.liveTypes,
      activityList: state.n.activityList,
      shoppingCarNum: state.shop.shoppingCarNum,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({mallApList, getOrdersCount, getRecommend, getLiveListCache, getLiveTypes, getActivityList, getGoodServiceStations, inputStation, pushCarInterface, shopCartCount }, dispatch),
  })
)(HomePageContainer);
