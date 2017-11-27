/* 登录页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Toast, Button } from 'antd-mobile';
import tools from '../../util/all';
import P from 'prop-types';
import { Link } from 'react-router-dom';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import ImgLogo from '../../assets/logo@3x.png';
import ImgPhone from '../../assets/phone@3x.png';
import ImgMima from '../../assets/mima@3x.png';
// import ImgWx from './assets/weixin@3x.png';
// ==================
// 本页面所需action
// ==================

import { login } from '../../a_action/app-action';

// ==================
// Definition
// ==================
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        loading: false, // 是否正在登录中
    };
  }

  // 输入用户名
  onUserNameInput(e) {
    const v = tools.trim(e.target.value);
    if (v.length <= 11) {
      this.setState({
          username: v,
      });
    }
  }

  // 输入用户名
  onPasswordInput(e) {
    const v = tools.trim(e.target.value);
    if (v.length <= 20) {
      this.setState({
          password: v,
      });
    }
  }

  // 登录提交
  onSubmit() {
    const reg = /^[1][3578][0-9]{9}$/g; // 正确的手机号码

    if (!this.state.username || !reg.test(this.state.username)) {
      Toast.info('请输入正确的手机号', 1.2);
    } else if(!this.state.password || this.state.password.length < 6) {
      Toast.info('请输入6位以上密码', 1.2);
    }

    const params = {
      loginName: this.state.username,
      password: this.state.password,
      loginIp: '',
      appType: 1,
      appVersion: 'web'
    };

    this.setState({
        loading: true
    });
    this.props.actions.login(params).then((res) => {
      if (res.status === 200) {
        Toast.success('登录成功', 1.2);
        // 将用户信息保存到localStorage
          localStorage.setItem('userinfo', JSON.stringify(res.data));
        this.props.history.push('/home');
      } else {
        Toast.fail(res.message || '登录失败', 1.2);
      }
      this.setState({
          loading: false
      });
    }).catch((err) => {
        this.setState({
            loading: false
        });
    });
  }

  render() {
    return (
      <div className="flex-auto page-box page-login">
        <div className="head">
          <div className="btn"><Link to="/register">注册</Link></div>
        </div>
        <div className="login-box">
          <img className="logo" src={ImgLogo} />
          <div className="input-box">
            <div className="t">
              <img src={ImgPhone} />
              <span>+86</span>
            </div>
            <div className="line" />
            <div className="i">
              <input
                  placeholder="请输入手机号码"
                  type="tel"
                  value={this.state.username}
                  onInput={(e) => this.onUserNameInput(e)}
              />
            </div>
          </div>
          <div className="input-box">
            <div className="t">
              <img src={ImgMima} />
            </div>
            <div className="line2" />
            <div className="i">
              <input
                  placeholder="请输入您的密码"
                  type="password"
                  maxLength="20"
                  value={this.state.password}
                  onInput={(e) => this.onPasswordInput(e)}
              />
            </div>
          </div>
          <div className="input-box2">
            <div className="btn">忘记密码?</div>
          </div>
          <Button
              type="primary"
              className="this-btn"
              disabled={this.state.loading}
              onClick={() => this.onSubmit()}
          >登录</Button>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Login.propTypes = {
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
    actions: bindActionCreators({ login }, dispatch),
  })
)(Login);