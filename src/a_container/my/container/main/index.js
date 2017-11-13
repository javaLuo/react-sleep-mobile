/* 我的e家 - 主页 */

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

import { Badge } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgBar1 from './assets/yimaoquan@3x.png';
import ImgBar2 from './assets/wozai@3x.png';
import ImgBar3 from './assets/jiankang@3x.png';
import ImgBar4 from './assets/erweima@3x.png';
import ImgBar5 from './assets/qianbao@3x.png';
import ImgBar6 from './assets/shoucang@3x.png';
import ImgBar7 from './assets/shezhi@3x.png';
import ImgBar8 from './assets/kefu@3x.png';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="my-main">
          {/* 顶部 */}
          <div className="head page-flex-row all_active">
              <div className="flex-none picture">
                  <div className="pic-box"/>
              </div>
              <div className="flex-auto info">
                  <div className="name all_nowarp">名字名字名字名字名字名字名字名字字名字名字</div>
                  <div className="phone all_nowarp">手机号码：13600000000</div>
              </div>
              <div className="flex-none arrow">
                  <img src={ImgRight} />
              </div>
          </div>
          {/* 中间横Bar */}
          <div className="bar page-flex-row">
              <div className='bar-item all_active'>
                  <div className="bar-icon icon1" />
                  <div className="title">亲友圈</div>
              </div>
              <div className='bar-item  all_active'>
                  <Link to="/">
                      <div className="bar-icon icon2" >
                          <div className="dot">99</div>
                      </div>
                      <div className="title">我的消息</div>
                  </Link>
              </div>
              <div className='bar-item  all_active'>
                  <Link to="/">
                      <div className="bar-icon icon3" />
                      <div className="title">我的订单</div>
                  </Link>
              </div>
          </div>
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar1} />
                  </div>
                  <div className="title">翼猫圈</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar2} />
                  </div>
                  <div className="title">我在翼猫</div>
                  <div className="info">体验版</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar3} />
                  </div>
                  <div className="title">健康大使</div>
                  <div className="info">翼猫科技</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar4} />
                  </div>
                  <div className="title">推广二维码</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active mt">
                  <div className="icon">
                      <img src={ImgBar5} />
                  </div>
                  <div className="title">收益管理</div>
                  <div className="info">400.00</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active mt">
                  <div className="icon">
                      <img src={ImgBar6} />
                  </div>
                  <div className="title">我的收藏</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar7} />
                  </div>
                  <div className="title">设置</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar8} />
                  </div>
                  <div className="title">客服中心</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
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
