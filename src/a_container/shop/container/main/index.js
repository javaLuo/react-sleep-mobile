/* 我的e家 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

import { Grid } from 'antd-mobile';

// ==================
// 本页面所需action
// ==================

import Img1 from '../../../../assets/test/test2.jpg';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 点击宫格触发
  onGridClick(el, index) {
    const me = this;
    switch(index) {
        case 0: $(document.body).animate({'scrollTop': $(me.a).offset().top - 30 + 'px'}, 500);break;
        case 1: $(document.body).animate({'scrollTop': $(me.b).offset().top - 30 + 'px'}, 500);break;
        case 2: $(document.body).animate({'scrollTop': $(me.c).offset().top - 30 + 'px'}, 500);break;
        case 3: $(document.body).animate({'scrollTop': $(me.d).offset().top - 30 + 'px'}, 500);break;
        case 4: $(document.body).animate({'scrollTop': $(me.e).offset().top - 30 + 'px'}, 500);break;
    }
  }

  render() {
    return (
      <div className="flex-auto page-box shop-main">
          <div className="title-pic">
              <img src={Img1} />
          </div>
          {/* bar */}
        <Grid
            className="my-grid"
            data={[
              {icon: Img1, text: '智能净水'},
              {icon: Img1, text: '健康食品'},
              {icon: Img1, text: '生物理疗'},
              {icon: Img1, text: '健康睡眠'},
              {icon: Img1, text: '健康体检'}
          ]}
            columnNum={5}
            onClick={(el, index) => this.onGridClick(el, index)}
        />
        {/* 智能净水 */}
        <div className="the-list" ref={(dom) => this.a = dom}>
          <div className="title page-flex-row">
            <div className="flex-auto">智能净水</div>
          </div>
          <ul className="list">
            <li>
              <Link to="/">
                <div className="pic flex-none"><img src={Img1} /></div>
                <div className="detail flex-auto page-flex-col">
                  <div className="t flex-none">商用智能净水设备</div>
                  <div className="i flex-auto">
                    <div>型号：YM-JS1601T</div>
                    <div>类型：家用型</div>
                    <div>费用：设备免费</div>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/">
                <div className="pic flex-none"><img src={Img1} /></div>
                <div className="detail flex-auto page-flex-col">
                  <div className="t flex-none">商用智能净水设备</div>
                  <div className="i flex-auto">
                    <div>型号：YM-JS1601T</div>
                    <div>类型：家用型</div>
                    <div>费用：设备免费</div>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
        {/* 健康食品 */}
        <div className="the-list" ref={(dom) => this.b = dom}>
          <div className="title page-flex-row">
            <div className="flex-auto">健康食品</div>
          </div>
          <ul className="list">
            <li>
              <Link to="/">
                <div className="pic flex-none"><img src={Img1} /></div>
                <div className="detail flex-auto page-flex-col">
                  <div className="t flex-none">养未来</div>
                  <div className="i flex-auto">
                    <div>型号：养未来1号</div>
                  </div>
                  <div className="k flex-none">
                    <span>￥2980</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
          {/* 生物理疗 */}
        <div className="the-list" ref={(dom) => this.c = dom}>
          <div className="title page-flex-row">
            <div className="flex-auto">生物理疗</div>
          </div>
          <ul className="list">
            <li>
              <Link to="/">
                <div className="pic flex-none"><img src={Img1} /></div>
                <div className="detail flex-auto page-flex-col">
                  <div className="t flex-none">冷敷贴 - 益腰贴</div>
                  <div className="i flex-auto" />
                  <div className="k flex-none">
                    <span>￥2980</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
          {/* 健康睡眠 */}
        <div className="the-list" ref={(dom) => this.d = dom}>
          <div className="title page-flex-row">
            <div className="flex-auto">健康睡眠</div>
          </div>
          <ul className="list">
            <li>
              <Link to="/">
                <div className="pic flex-none"><img src={Img1} /></div>
                <div className="detail flex-auto page-flex-col">
                  <div className="t flex-none">智能床垫</div>
                  <div className="i flex-auto" />
                  <div className="k flex-none">
                    <span>￥2980</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
          {/* 体检卡 */}
        <div className="the-list" ref={(dom) => this.e = dom}>
          <div className="title page-flex-row">
            <div className="flex-auto">体检卡</div>
          </div>
          <ul className="list">
            <li>
              <Link to="/">
                <div className="pic flex-none"><img src={Img1} /></div>
                <div className="detail flex-auto page-flex-col">
                  <div className="t flex-none">健康筛查体检卡</div>
                  <div className="i flex-auto" />
                  <div className="k flex-none">
                    <span>￥1000</span>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({

  }), 
  (dispatch) => ({
    actions: bindActionCreators({}, dispatch),
  })
)(HomePageContainer);
