/* 健康管理 - 我的预约 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import tools from '../../../../util/all';
// ==================
// 所需的所有组件
// ==================
import { Button } from 'antd-mobile';
import ImgDh from '../../../../assets/daohang@3x.png';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dizhi@3x.png';
import ImgPhone from '../../../../assets/dianhua@3x.png';
// ==================
// 本页面所需action
// ==================

import { mecReserveList } from '../../../../a_action/shop-action';

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
      this.getData();
  }

  // 获取本页面所需数据
  getData() {
      this.props.actions.mecReserveList({ pageNum: 0, pageSize: 9999 }).then(() => {

      });
  }

  render() {
    return (
      <div className="page-my-pre">
          <ul>
              <li className="one-box">
                  <div className="pre-box page-flex-row">
                      <div className="l flex-auto">
                          <div>体检人：张三</div>
                          <div>体检卡号：249723950238759025</div>
                          <div>预约时间：2017-08-09 14:00:00</div>
                      </div>
                      <div className="r flex-none">
                          <div className="down">已预约</div>
                      </div>
                  </div>
                  <div className="card-box page-flex-row">
                      <div className="l flex-auto">
                          <div className="title">上海市嘉定区翼猫体验服务中心</div>
                          <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>姓名</span></div>
                          <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><a href={`tel:13600000000`}>13600000000</a></div>
                          <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>上海市嘉定区南翔镇众人路399号B座1楼</span></div>
                      </div>
                      {/*<div className="r flex-none page-flex-col flex-jc-center">*/}
                          {/*<div className="addr">*/}
                              {/*<img src={ImgDh} />*/}
                              {/*<div>导航</div>*/}
                          {/*</div>*/}
                      {/*</div>*/}
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
    actions: bindActionCreators({ mecReserveList }, dispatch),
  })
)(HomePageContainer);
