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
import { Button, Toast } from 'antd-mobile';

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
      const openId = localStorage.getItem('openId');
      if (openId) {
          this.props.actions.getUserInfo({ openId });
      }
  }

  // 退出登录
  onLogOut() {
      this.props.actions.logout({userId: this.props.userinfo.id});
      sessionStorage.removeItem('userinfo');    // 清除用户信息
      localStorage.removeItem('userlogininfo'); // 清除缓存的用户帐号和密码
      localStorage.removeItem('openId');        // 清除保存的openId
      setTimeout(() => {
          this.props.history.replace('/login');
      });
  }

  // 点击绑定经销商按钮
    onBindDealear() {
        const u = this.props.userinfo;
        if (!u){
            Toast.fail('请先登录');
            this.props.history.replace('/login');
        }
        if (u.disUser){ // 已绑定经销商
            Toast.info('您已是经销商用户');
        } else {    // 不是经销商就跳转到经销商绑定页
            this.props.history.push('/my/binddealer');
        }
    }

    // 点击设置密码按钮
    onSetPassword() {
        const u = this.props.userinfo;
        if (!u){
            Toast.fail('请先登录');
            this.props.history.replace('/login');
        }
        if (u.disUser || u.password) {  // 如果是经销商用户或已设置或密码的普通用户，就不能进入
            return false;
        } else{
            this.props.history.push('/my/setpassword');
        }
    }

  render() {
      const u = this.props.userinfo;
      console.log('u是什么：', u);
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
                  <div className="info">{u ? u.id : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.onBindDealear()}>
                  <div className="title">绑定经销商账户</div>
                  <div className="info">{(u && u.disUser) ? u.userName : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.props.history.push('/my/bindphone')}>
                  <div className="title">绑定手机号</div>
                  <div className="info">{u ? tools.addMosaic(u.mobile) : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              {
                  (u.disUser || u.password) ? null : (
                      <div className="item page-flex-row all_active" onClick={() => this.onSetPassword()}>
                          <div className="title">设置密码</div>
                          <div className="arrow"><img src={ImgRight} /></div>
                          <div className="line"/>
                      </div>
                  )
              }
              <div className="item page-flex-row all_active mt">
                  <div className="title">解绑微信</div>
                  <div className="info"></div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
          </div>
          <div className="thefooter">
              <Button type="default" onClick={() => this.onLogOut()}>退出登录</Button>
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
    actions: bindActionCreators({ getUserInfo, logout }, dispatch),
  })
)(HomePageContainer);
