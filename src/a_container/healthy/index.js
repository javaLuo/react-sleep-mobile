/* 健康管理 */

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

import { Switch, Route } from 'react-router-dom';
import Main from './container/main';
import MyCard from './container/myCard';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class Healthy extends React.Component {
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
            <Route exact path={`${this.props.match.url}/mycard`} component={MyCard} />
          </Switch>
        </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Healthy.propTypes = {
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
)(Healthy);
