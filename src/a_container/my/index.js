/* 我的e家 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

import Main from './container/main';
import UserInfo from './container/userInfo';
import PerInfo from './container/perInfo';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class My extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
          <Switch>
              <Route exact path={`${this.props.match.url}/`} component={Main} />
              <Route exact path={`${this.props.match.url}/userinfo`} component={UserInfo} />
              <Route exact path={`${this.props.match.url}/perinfo`} component={PerInfo} />
          </Switch>

      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

My.propTypes = {
  location: P.any,
  history: P.any,
  match: P.any,
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
)(My);
