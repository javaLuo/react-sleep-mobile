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
import ImgBar1 from '../../../../assets/default-head.jpg';
// import ImgBar2 from './assets/wozai@3x.png';
// import ImgBar3 from './assets/jiankang@3x.png';
// import ImgBar4 from './assets/erweima@3x.png';
// import ImgBar5 from './assets/qianbao@3x.png';
// import ImgBar6 from './assets/shoucang@3x.png';
// import ImgBar7 from './assets/shezhi@3x.png';
// import ImgBar8 from './assets/kefu@3x.png';
import ImgDingDan from '../../../../assets/dingdan@3x.png';
import ImgTiJian from '../../../../assets/tijianka@3x.png';
// ==================
// 本页面所需action
// ==================

import { getUserInfo } from '../../../../a_action/app-action';

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
      const user = sessionStorage.getItem('userinfo');
      if (user && !this.props.userinfo) {
        this.getUserInfo();
      }
  }

  // 获取当前登录用户的相关信息
  getUserInfo() {
      this.props.actions.getUserInfo();
  }

  render() {
      const user = sessionStorage.getItem('userinfo');
      const u = this.props.userinfo;
    return (
      <div className="my-main">
          {/* 顶部 */}
          <div className="head all_active">
              <Link to={user ? '/my/userinfo' : '/login'} className="page-flex-row" style={{ width: '100%', height: '100%'}}>
                  <div className="flex-none picture">
                      <div className="pic-box">
                          <img src={u && u.headImg ? u.headImg : ImgBar1} />
                      </div>
                  </div>
                  {
                      user ? <div className="flex-auto info">
                          <div className="name all_nowarp">{ u ? u.userName : ' ' }</div>
                          <div className="phone all_nowarp">手机号码：{ u ? u.mobile : ' ' }</div>
                      </div> : <div className="flex-auto info">点击登录</div>
                  }
                  <div className="flex-none arrow">
                      <img src={ImgRight} />
                  </div>
              </Link>
          </div>
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item page-flex-row all_active" onClick={() => this.props.history.push(user ? '/my/order' : '/login')}>
                  <img src={ImgDingDan} className="icon"/>
                  <div className="title">我的订单</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              {/*<div className="item page-flex-row all_active" onClick={() => this.props.history.push(user ? '/healthy/mycard' : '/login')}>*/}
                  {/*<img src={ImgTiJian} className="icon"/>*/}
                  {/*<div className="title">我的体检卡</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
                  {/*<div className="line"/>*/}
              {/*</div>*/}
              {/*<div className="item page-flex-row all_active">*/}
                  {/*<div className="icon">*/}
                      {/*<img src={ImgBar2} />*/}
                  {/*</div>*/}
                  {/*<div className="title">我在翼猫</div>*/}
                  {/*<div className="info">体验版</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
                  {/*<div className="line"/>*/}
              {/*</div>*/}
              {/*<div className="item page-flex-row all_active">*/}
                  {/*<div className="icon">*/}
                      {/*<img src={ImgBar3} />*/}
                  {/*</div>*/}
                  {/*<div className="title">健康大使</div>*/}
                  {/*<div className="info">翼猫科技</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
                  {/*<div className="line"/>*/}
              {/*</div>*/}
              {/*<div className="item page-flex-row all_active">*/}
                  {/*<div className="icon">*/}
                      {/*<img src={ImgBar4} />*/}
                  {/*</div>*/}
                  {/*<div className="title">推广二维码</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
              {/*</div>*/}
              {/*<div className="item page-flex-row all_active mt">*/}
                  {/*<div className="icon">*/}
                      {/*<img src={ImgBar5} />*/}
                  {/*</div>*/}
                  {/*<div className="title">收益管理</div>*/}
                  {/*<div className="info">400.00</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
              {/*</div>*/}
              {/*<div className="item page-flex-row all_active mt">*/}
                  {/*<div className="icon">*/}
                      {/*<img src={ImgBar6} />*/}
                  {/*</div>*/}
                  {/*<div className="title">我的收藏</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
                  {/*<div className="line"/>*/}
              {/*</div>*/}
              {/*<div className="item page-flex-row all_active" onClick={() => this.props.history.push('/my/set')}>*/}
                  {/*<div className="icon">*/}
                      {/*<img src={ImgBar7} />*/}
                  {/*</div>*/}
                  {/*<div className="title">设置</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
                  {/*<div className="line"/>*/}
              {/*</div>*/}
              {/*<div className="item page-flex-row all_active">*/}
                  {/*<div className="icon">*/}
                      {/*<img src={ImgBar8} />*/}
                  {/*</div>*/}
                  {/*<div className="title">客服中心</div>*/}
                  {/*<div className="arrow"><img src={ImgRight} /></div>*/}
              {/*</div>*/}
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
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getUserInfo }, dispatch),
  })
)(HomePageContainer);
