/* 体验店列表 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import _ from 'lodash';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

import { SearchBar } from 'antd-mobile';
import ImgDh from '../../../../assets/daohang@3x.png';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dianhua@3x.png';
import ImgPhone from '../../../../assets/dizhi@3x.png';
// ==================
// 本页面所需action
// ==================

import { } from '../../../../a_action/shop-action';

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

  }



  render() {
    return (
      <div className="flex-auto page-box page-expr-shop">
          <SearchBar placeholder="选择地区查看体验店信息" maxLength={50}/>
          <ul>
              <li className="card-box page-flex-row">
                  <div className="l flex-auto">
                      <div className="title">上海市嘉定区翼猫体验服务中心</div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>姓名</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span>13600000000</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>上海市嘉定区南翔镇众人路399号B座1楼</span></div>
                  </div>
                  <div className="r flex-none page-flex-col flex-jc-center">
                      <div className="addr">
                          <img src={ImgDh} />
                          <div>导航</div>
                      </div>
                  </div>
              </li>
              <li className="card-box page-flex-row">
                  <div className="l flex-auto">
                      <div className="title">上海市嘉定区翼猫体验服务中心</div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>姓名</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span>13600000000</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>上海市嘉定区南翔镇众人路399号B座1楼</span></div>
                  </div>
                  <div className="r flex-none page-flex-col flex-jc-center">
                      <div className="addr">
                          <img src={ImgDh} />
                          <div>导航</div>
                      </div>
                  </div>
              </li>
              <li className="card-box page-flex-row">
                  <div className="l flex-auto">
                      <div className="title">上海市嘉定区翼猫体验服务中心</div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>姓名</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span>13600000000</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>上海市嘉定区南翔镇众人路399号B座1楼</span></div>
                  </div>
                  <div className="r flex-none page-flex-col flex-jc-center">
                      <div className="addr">
                          <img src={ImgDh} />
                          <div>导航</div>
                      </div>
                  </div>
              </li>
          </ul>
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
    actions: bindActionCreators({ }, dispatch),
  })
)(HomePageContainer);
