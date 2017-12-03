/* 体检服务 */

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

import SignUp from './container/signUp';
import SignUpAdd from './container/signUpAdd';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class Phy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
          <Switch>
              <Route exact path={`${this.props.match.url}/signup`} component={SignUp} />
              <Route exact path={`${this.props.match.url}/signupadd`} component={SignUpAdd} />
          </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Phy.propTypes = {
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
)(Phy);
