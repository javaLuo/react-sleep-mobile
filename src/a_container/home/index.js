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

import { getProDuctList } from '../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if(!this.props.allProducts || this.props.allProducts.length === 0) {
      this.props.actions.getProDuctList();
    }
  }

  render() {
    return (
      <div className="flex-auto page-box home-page">
          {/* 顶部轮播 */}
          <Carousel
            className="my-carousel"
            autoplay
            infinite
            swipeSpeed={35}
          >
            <img src={Img1} />
            <img src={Img2} />
            <img src={Img3} />
          </Carousel>
          {/* 最新资讯 */}
        <div className="the-list">
          <div className="title page-flex-row">
            <div className="flex-auto">健康体检</div>
          </div>
          <ul className="list">
            <li>
              <Link to="/shop/gooddetail/1">
                <div className="pic flex-none"><img src={Img1} /></div>
                <div className="detail flex-auto page-flex-col">
                  <div className="t flex-none all_nowarp">健康体检卡</div>
                  <div className="i flex-auto">
                    <div className="all_nowarp2">在翼猫体验店</div>
                  </div>
                  <div className="k page-flex-row flex-jc-end flex-none">
                    <span>￥ <i>1000</i></span>
                  </div>
                </div>
              </Link>
            </li>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allProducts: state.shop.allProducts,  // 所有的产品  数组
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getProDuctList }, dispatch),
  })
)(HomePageContainer);
