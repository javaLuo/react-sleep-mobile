/* 我的e家 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import P from 'prop-types';
import _ from 'lodash';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

import { SearchBar } from 'antd-mobile';

// ==================
// 本页面所需action
// ==================

import {  } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.map = null;
  }

  componentDidMount() {
    this.init();
  }

   componentWillUnmount() {

  }
  init() {
      this.map = new BMap.Map("container");
      const point = new BMap.Point(116.404, 39.915);
      this.map.centerAndZoom(point, 15);
  }

  render() {
    return (
      <div id="container" className="flex-auto page-box map-page">

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
)(HomePageContainer);
