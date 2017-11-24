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
      <div className="healthy-main">
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar1} />
                  </div>
                  <div className="title">
                      <div>健康智问</div>
                      <div className="i">评估您的整体健康状况和疾病风险</div>
                  </div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar2} />
                  </div>
                  <div className="title">体检报告</div>
                  <div className="info">1份</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar3} />
                  </div>
                  <div className="title">我的预约</div>
                  <div className="info">1次</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="icon">
                      <img src={ImgBar4} />
                  </div>
                  <div className="title">我的体检卡</div>
                  <div className="info">2张未使用</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active mt">
                  <div className="icon">
                      <img src={ImgBar5} />
                  </div>
                  <div className="title">
                      <div>预约体检</div>
                      <div className="i">共有1000家翼猫体验店已上线智能体检系统</div>
                  </div>
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