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
import { Carousel, Icon } from 'antd-mobile';
import Img1 from '../../assets/test/test1.jpg';
import Img2 from '../../assets/test/test2.jpg';
import Img3 from '../../assets/test/test3.jpg';
// ==================
// 本页面所需action
// ==================

import { getProDuctList, mallApList } from '../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        imgHeight: '200px',
    };
  }

  componentWillMount(){

  }

  componentDidMount() {
    if(!this.props.allProducts || this.props.allProducts.length === 0) {
      this.props.actions.getProDuctList();
    }
    if (!this.props.homePics || this.props.homePics.length === 0) {
      this.props.actions.mallApList({ typeCode: 'slideshow' });
    }
  }

  render() {
    console.log('图片：', this.props.homePics);
    return (
      <div className="flex-auto page-box home-page">
          {/* 顶部轮播 */}
          <Carousel
            className="my-carousel"
            autoplay
            infinite
            swipeSpeed={35}
          >
              {this.props.homePics.map((item, index) => (
                  <a
                      key={index}
                      href={item.url}
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
          {/* 最新资讯 */}
        <div className="the-list">
          <div className="title page-flex-row">
            <div className="flex-auto">健康体检</div>
          </div>
          <ul className="list">
              { this.props.allProducts.filter((item) => item.onShelf).map((item, index) => {
                return (
                    <li key={index}>
                      <Link to={`/shop/gooddetail/${item.id}`}>
                        <div className="pic flex-none">{ item.detailImg ? <img src={item.detailImg} /> : null}</div>
                        <div className="detail flex-auto page-flex-col">
                          <div className="t flex-none all_nowarp">{item.name}</div>
                          <div className="i flex-auto">
                            <div className="all_nowarp2" />
                          </div>
                          <div className="k page-flex-row flex-jc-end flex-none">
                            <span>￥ <i>{item.price}</i></span>
                          </div>
                        </div>
                      </Link>
                    </li>
                );
              })}
          </ul>
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
  allProducts: P.array, // 所有的产品
    homePics: P.array,  // 首页顶部轮播图
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allProducts: state.shop.allProducts,  // 所有的产品  数组
      homePics: state.shop.homePics,  // 首页顶部轮播图
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getProDuctList, mallApList }, dispatch),
  })
)(HomePageContainer);
