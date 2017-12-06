/* 我的e家 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import Config from '../../config';

// ==================
// 所需的所有组件
// ==================

// ==================
// 本页面所需action
// ==================

import { saveWxCode } from '../../a_action/app-action';
// ==================
// Definition
// ==================
class Jump extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
      const me = this;
      console.log('PAY:LOCATION', me.props.location);
      const search = window.location.search || '';
      let temp = search.replace(/^\?/, '').split('&');
      const t = temp.find((item) => item.indexOf('code')>=0);
      if (!t){
          me.props.history.replace('/');
          return;
      }
      const code = t.split('=')[1];
      //console.log('保存code:', code);
      //me.props.actions.saveWxCode(code); // 页面授权完成，开始初始化JS-SDK
      sessionStorage.setItem('wx_code', code);
      setTimeout(() => {
          location.href = `${Config.baseURL}#/shop/pay`;
      }, 16);
  }
  render() {
    return (
      <div/>
    );
  }
}

// ==================
// PropTypes
// ==================

Jump.propTypes = {
  location: P.any,
  history: P.any,
  match: P.any,
  actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({

  }), 
  (dispatch) => ({
    actions: bindActionCreators({ saveWxCode }, dispatch),
  })
)(Jump);
