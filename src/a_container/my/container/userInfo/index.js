/* 我的e家 - 主页 - 个人信息 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button } from 'antd-mobile';

import ImgRight from '../../../../assets/xiangyou@3x.png';
import defaultPic from '../../../../assets/default-head.jpg';
// ==================
// 本页面所需action
// ==================

import { getUserInfo, logout } from '../../../../a_action/app-action';

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
      if (!this.props.userinfo) {
        this.getUserInfo();
      }
  }

  // 获取当前登录用户的相关信息
  getUserInfo() {
      this.props.actions.getUserInfo();
  }

  // 退出登录
  onLogOut() {
      this.props.actions.logout();
      sessionStorage.removeItem('userinfo');    // 清除用户信息
      localStorage.removeItem('userlogininfo'); // 清除缓存的用户帐号和密码
      localStorage.removeItem('openId');        // 清除保存的openId
      setTimeout(() => {
          this.props.history.replace('/');
      });
  }

  render() {
      const u = this.props.userinfo;
    return (
      <div className="userinfo-main">
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item all_active">
                  <Link to="/my/perinfo" className="page-flex-row">
                      <div className="title">基本信息</div>
                      <div className="photo"><img src={(u && u.headImg) ? u.headImg : defaultPic} /></div>
                      <div className="line"/>
                  </Link>
              </div>
              <div className="item page-flex-row all_active mt">
                  <div className="title">e家号</div>
                  <div className="info">what_fuck</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">绑定经销商账户</div>
                  <div className="info">what_fuck_this</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">绑定手机号</div>
                  <div className="info">{u ? tools.addMosaic(u.mobile) : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">设置密码</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active mt">
                  <div className="title">解绑微信</div>
                  <div className="info">松妹子</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              {/*<div className="item page-flex-row all_active" onClick={() => this.props.history.push('/my/authentication')}>*/}
                  {/*<div className="title">实名认证</div>*/}
                  {/*<div className="info">{u ? u.userName : ' '}</div>*/}
                  {/*<div className="arrow"><Button type="primary" size="small">已实名</Button></div>*/}
                  {/*<div className="line"/>*/}
              {/*</div>*/}
          </div>
          {
            ['weixin', 'web'].indexOf(tools.isNative()) !== -1 ? (
                <div className="thefooter">
                    <Button type="default" onClick={() => this.onLogOut()}>退出登录</Button>
                </div>
            ) : null
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
    actions: bindActionCreators({ getUserInfo, logout }, dispatch),
  })
)(HomePageContainer);
