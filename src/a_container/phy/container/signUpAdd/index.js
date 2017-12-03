/* 体检活动 - 活动报名页 */

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

// ==================
// 本页面所需action
// ==================

import {  } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="page sign-up-add">

      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Container.propTypes = {
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
    actions: bindActionCreators({  }, dispatch),
  })
)(Container);
