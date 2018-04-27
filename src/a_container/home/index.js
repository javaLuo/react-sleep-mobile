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
import { Icon } from "antd";
import _ from 'lodash';
import { Carousel } from 'antd-mobile';
import ImgZiXun from '../../assets/home/home_zixun@3x.png';
import ImgZhiBo from '../../assets/home/home_zhibo@3x.png';
import ImgTiYan from '../../assets/home/home_tiyan@3x.png';
import ImgShangCheng from '../../assets/home/homge_shangcheng@3x.png';
import ImgTest from '../../assets/test/new.png';
import ImgStar0 from '../../assets/home/star_0@3x.png';
import ImgStar05 from '../../assets/home/star_0.5@3x.png';
import ImgStar1 from '../../assets/home/star_1@3x.png';
import ImgLikeThis from '../../assets/home/likethis@3x.png';
import ImgLooked from '../../assets/home/looked@3x.png';
import ImgTime from '../../assets/home/thetime@3x.png';
// ==================
// 本页面所需action
// ==================

import { mallApList, getOrdersCount } from '../../a_action/shop-action';
import { getRecommend } from '../../a_action/new-action';
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

    // 获取轮播图
    if (!this.props.homePics || this.props.homePics.length === 0) {
      this.props.actions.mallApList({ typeCode: 'slideshow' });
    }
    // 获取热销产品
    if(!this.props.homeRecommend || !this.props.homeRecommend.length) {
        this.getRecommend();
    }
    this.getOrdersCount();
  }

  // 获取热销产品
    getRecommend() {
      this.props.actions.getRecommend();
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
  render() {
    const u = this.props.userinfo;
    const barData = [
        { title: '翼猫商城', pic: ImgShangCheng, key: 1 },
        { title: '健康资讯', pic: ImgZiXun, key: 2 },
        { title: '视频直播', pic: ImgZhiBo, key: 3 },
        { title: '体验店', pic: ImgTiYan, key: 4 },
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
          {/** 上方4个圆导航按钮 **/}
          <div className="link-bar page-flex-row">
              {
                  barData.map((item, index) => <div key={index} onClick={() => this.onLinkClick(item.key)}>
                      <img src={item.pic} />
                      <div>{item.title}</div>
                  </div>)
              }
          </div>
          {/** 最新活动 **/}
          <div className="home-content-one">
              <div className="title">最新活动</div>
              <div className="active-bar" onClick={() => this.props.history.push('/shop/shopactive')}>
                  <div>已有<span>{this.state.activeCount}</span>人参与</div>
              </div>
              <ul className="active-list">
                  <li style={{ width: '50%' }}>
                      <a href="https://qq.com" target="_blank" rel="noopener noreferrer">
                          <img src={ImgTest} />
                      </a>
                  </li>
                  <li style={{ width: '50%' }}>
                      <a href="https://qq.com" target="_blank" rel="noopener noreferrer">
                          <img src={ImgTest} />
                      </a>
                  </li>
                  <li style={{ width: '100%' }}>
                      <a href="https://qq.com" target="_blank" rel="noopener noreferrer">
                          <img src={ImgTest} />
                      </a>
                  </li>
              </ul>
          </div>
          {/** 热销产品 **/}
          <div className="home-content-one" style={{ display: this.props.homeRecommend.length ? 'block' : 'none' }}>
              <div className="title">热销产品</div>
              <ul className="hot-1">
                  { this.props.homeRecommend.filter((item, index) => index < 2).map((item, index) => {
                      return (
                          <li key={index} onClick={() => this.onRecommendClick(item.id)}>
                              <div className="pic"><img src={item.productImg.split(',')[0]}/></div>
                              <div className="t all_nowarp">{item.name}</div>
                              <div className="num">已售: {item.buyCount}</div>
                              <div className="m"><i>￥</i>{item.price}</div>
                          </li>
                      );
                  }) }
              </ul>
              <ul className="hot-2" style={{ display: this.props.homeRecommend.length>3 ? 'block' : 'none' }}>
                  {
                      this.props.homeRecommend.filter((item, index) => index > 2).map((item, index) => {
                          return (
                              <li key={index} onClick={() => this.onRecommendClick(item.id)}>
                                  <div className="pic"><img src={item.productImg.split(',')[0]}/></div>
                                  <div className="t all_nowarp">{item.name}</div>
                                  <div className="num">已售: {item.buyCount}</div>
                                  <div className="m"><i>￥</i>{item.price}</div>
                              </li>
                          );
                      })
                  }
              </ul>
              <div className="foot">查看全部 <Icon type="caret-right" /></div>
          </div>
          {/** 视频直播 **/}
          <div className="home-content-one">
              <div className="title">视频直播</div>
              <ul className="zb-1">
                  <li>
                      <div className="pic"><img src={ImgTest}/></div>
                      <div className="total">品牌</div>
                  </li>
              </ul>
              <ul className="zb-2">
                  <li>
                      <div className="pic"><img src={ImgTest}/></div>
                      <div className="total">直播</div>
                  </li>
                  <li>
                      <div className="pic"><img src={ImgTest}/></div>
                      <div className="total">直播中</div>
                  </li>
                  <li>
                      <div className="pic"><img src={ImgTest}/></div>
                      <div className="total">直播中</div>
                  </li>
                  <li>
                      <div className="pic"><img src={ImgTest}/></div>
                      <div className="total">直播中</div>
                  </li>
                  <li>
                      <div className="pic"><img src={ImgTest}/></div>
                      <div className="total">直播中</div>
                  </li>
              </ul>
              <div className="foot">查看全部 <Icon type="caret-right" /></div>
          </div>
          {/** 翼猫体验店 **/}
          <div className="home-content-one">
              <div className="title">翼猫体验店</div>
              <ul className="tyd-1">
                  <li>
                      <div className="total all_nowarp">上海嘉定区体验中心</div>
                      <div className="star"><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /></div>
                      <div className="type">
                          <div>推荐</div>
                      </div>
                  </li>
                  <li>
                      <div className="total all_nowarp">上海嘉定区体验中心</div>
                      <div className="star"><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /></div>
                      <div className="type">
                          <div>推荐</div>
                      </div>
                  </li>
                  <li>
                      <div className="total all_nowarp">上海嘉定区体验中心</div>
                      <div className="star"><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /></div>
                      <div className="type">
                          <div>推荐</div>
                      </div>
                  </li>
                  <li>
                      <div className="total all_nowarp">上海嘉定区体验中心</div>
                      <div className="star"><img src={ImgStar1} /><img src={ImgStar1} /><img src={ImgStar1} /></div>
                      <div className="type">
                          <div>推荐</div>
                      </div>
                  </li>
                  <li>
                      <div className="total all_nowarp">上海嘉定区体验中心</div>
                      <div className="star"><img src={ImgStar1} /><img src={ImgStar1} /></div>
                      <div className="type">
                          <div>推荐</div>
                      </div>
                  </li>
              </ul>
              <div className="foot">查看全部 <Icon type="caret-right" /></div>
          </div>
          {/** 热门资讯 **/}
          <div className="home-content-one">
              <div className="title">热门资讯</div>
              <ul className="new-1">
                  <li className="type1">
                      <div>
                          <div className="t all_warp">balabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabala<span>置顶</span></div>
                          <div className="info">
                              <span className="a">行业</span>
                              <span className="b"><img src={ImgLooked} />20000</span>
                              <span className="c"><img src={ImgLikeThis} />1500</span>
                              <span className="d"><img src={ImgTime} />2018-04-11</span>
                          </div>
                      </div>
                      <div className="new_pic" ><img src={ImgTest}/></div>
                  </li>
                  <li className="type1">
                      <div>
                          <div className="t all_warp">balabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabala<span>置顶</span></div>
                          <div className="info">
                              <span className="a">行业</span>
                              <span className="b"><img src={ImgLooked} />20000</span>
                              <span className="c"><img src={ImgLikeThis} />1500</span>
                              <span className="d"><img src={ImgTime} />2018-04-11</span>
                          </div>
                      </div>
                      <div className="new_pic" ><img src={ImgTest}/></div>
                  </li>
                  <li className="type1">
                      <div>
                          <div className="t all_warp">balabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabalabala<span>置顶</span></div>
                          <div className="info">
                              <span className="a">行业</span>
                              <span className="b"><img src={ImgLooked} />20000</span>
                              <span className="c"><img src={ImgLikeThis} />1500</span>
                              <span className="d"><img src={ImgTime} />2018-04-11</span>
                          </div>
                      </div>
                      <div className="new_pic" ><img src={ImgTest}/></div>
                  </li>
              </ul>
              <div className="foot">查看更多 <Icon type="caret-right" /></div>
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
    homePics: P.array,  // 首页顶部轮播图
    userinfo: P.any,
    homeRecommend: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      homePics: state.shop.homePics,  // 首页顶部轮播图
      userinfo: state.app.userinfo,
      homeRecommend: state.n.homeRecommend,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({mallApList, getOrdersCount, getRecommend }, dispatch),
  })
)(HomePageContainer);
