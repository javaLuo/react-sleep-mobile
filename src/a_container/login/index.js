/* 登录页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="flex-auto page-box page-login">
        <div className="head">
          <div className="btn">注册</div>
        </div>
        <div className="login-box">

          <div className="input-box">
            <div className="t">

              <span>+86</span>
            </div>
            <div className="line" />
            <div className="i"><input placeholder="请输入用户名" type="tel" maxLength="11"/></div>
          </div>
          <div className="input-box">
            <div className="t">

            </div>
            <div className="line2" />
            <div className="i"><input placeholder="请输入您的密码" type="password" maxLength="20"/></div>
          </div>
          <div className="input-box2">
            <div className="btn">忘记密码?</div>
          </div>
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
    actions: bindActionCreators({}, dispatch),
  })
)(Login);
