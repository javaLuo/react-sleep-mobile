/* 主页 */

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
import $ from 'jquery';
import _ from 'lodash';
import { Carousel } from 'antd-mobile';
import imgDefalut from '../../assets/logo-img.png';
import ImgZiXun from '../../assets/home/home_zixun@3x.png';
import ImgZhiBo from '../../assets/home/home_zhibo@3x.png';
import ImgTiYan from '../../assets/home/home_tiyan@3x.png';
import ImgWtfL from '../../assets/home/wtf-l@3x.png';
import ImgWtfR from '../../assets/home/wtf-r@3x.png';
// ==================
// 本页面所需action
// ==================

import { getProDuctList, mallApList, getOrdersCount } from '../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        imgHeight: '178px',
        activeCount: 0,
    };
  }

  componentWillMount(){

  }

  componentDidMount() {
      document.title = '翼猫健康e家';
    if(!this.props.allProducts || this.props.allProducts.length === 0) {
      this.props.actions.getProDuctList();
    }
    if (!this.props.homePics || this.props.homePics.length === 0) {
      this.props.actions.mallApList({ typeCode: 'slideshow' });
    }
    this.getOrdersCount();
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

    // 点bar弹到指定地方
    onBarClick(id) {
    console.log(id, $(`#list_${id}`).offset().top);
      $(document.body).animate( { scrollTop:  $(`#list_${id}`).offset().top - 50}, 300);
    }

    // 点击linkBar导航到不同页面
    onLinkClick(type) {
      switch(type) {
          // 跳健康资讯
          case 1:
              const u = this.props.userinfo;
              let str = '';
              if (u && u.id) {  // 有用户信息
                  str = `&e=${u.id}`;
              }
              window.open(`http://e.yimaokeji.com/index.php?m=article&f=browse&t=mhtml&categoryID=3&pageID=1${str}`);
              break;
          // 跳视频直播
          case 2:
              // window.open('http://tv.yimaokeji.com/watch/1447826');
              this.props.history.push('/live');
              break;
          // 跳翼猫体验店查询
          case 3:
              this.props.history.push('/shop/exprshop2');
      }
    }
  render() {
    const u = this.props.userinfo;
    const allProducts = _.cloneDeep(this.props.allProducts).sort((a, b) => a.sorts - b.sorts);
    const barData = [
        { title: '健康资讯', pic: ImgZiXun, key: 1 },
        { title: '视频直播', pic: ImgZhiBo, key: 2 },
        { title: '翼猫体验店', pic: ImgTiYan, key: 3 },
    ];
    return (
      <div className="flex-auto page-box home-page">
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
              ) : <div style={{ height: `${this.state.imgHeight}` }} />
          }
          {/** 上方导航bar **/}
          <div className="link-bar page-flex-row">
              {
                  barData.map((item, index) => <div key={index} onClick={() => this.onLinkClick(item.key)}>
                      <img src={item.pic} />
                      <div>{item.title}</div>
                  </div>)
              }
          </div>
          {/** 横幅 **/}
          <div className="active-bar" onClick={() => this.props.history.push('/shop/shopactive')}>
              <div>已有<span>{this.state.activeCount}</span>人参与</div>
          </div>
          {/** 产品bar **/}
          <div className="home-bar page-flex-row">
              {
                allProducts.map((item, index) => {
                    return (
                    <div key={index} onClick={() => this.onBarClick(item.id)}>
                      <div>{item.name}</div>
                    </div>
                    );
                })
              }
          </div>
          {/* 所有产品列表 */}
          {
            allProducts.map((theType, i) => {
              return (
                  <div key={i} className="the-list" id={`list_${theType.id}`}>
                    <div className="title page-flex-row">
                            <img className="line" src={ImgWtfR} />
                        {theType.typeIcon ? <img className="type-icon" src={theType.typeIcon} /> : null}
                            <span>{ theType.name }</span>
                            <img className="line" src={ImgWtfL} />
                    </div>
                    <ul className="list">
                        { theType.productList.filter((item) => item.onShelf).map((item, index) => {
                            return (
                                <li key={index}>
                                  <Link to={`/shop/gooddetail/${item.id}`}>
                                    <div className="pic flex-none page-flex-row flex-jc-center flex-ai-center">{ item.productImg ? <img src={item.productImg.split(',')[0]} /> : <img className='default' src={imgDefalut}/>}</div>
                                    <div className="detail flex-auto page-flex-col">
                                      <div className="t flex-none">{item.name}</div>
                                      <div className="i flex-auto">
                                        <div className="all_nowarp2" />
                                      </div>
                                      <div className="k flex-none">
                                          <div className="a">{ item.typeId === 1 ? "已供：" : "已售："}{item.buyCount}</div>
                                          <div className="b">{ item.typeId === 1 ? <span>首年度预缴 </span> : null }<span>￥</span><i>{item.typeModel.price + (item.typeModel.openAccountFee || 0)}</i></div>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                            );
                        })}
                    </ul>
                  </div>
              );
            })
          }
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
  allProducts: P.array, // 所有的产品
    homePics: P.array,  // 首页顶部轮播图
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allProducts: state.shop.allProducts,  // 所有的产品  数组
      homePics: state.shop.homePics,  // 首页顶部轮播图
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getProDuctList, mallApList, getOrdersCount }, dispatch),
  })
)(HomePageContainer);
