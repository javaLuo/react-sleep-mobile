/* 我的e家 - 我的客户 */

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
import { Button, List } from 'antd-mobile';
import ImgDefault from '../../../../assets/default-head.jpg';
// ==================
// 本页面所需action
// ==================

import { } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  //
   onLogOut(){
      localStorage.removeItem('userinfo');
      this.props.history.replace('/login');
   }

  render() {
    return (
      <div className="page-customer">
          <ul className="data-list">
              <li className="page-flex-row flex-ai-center">
                  <div className="photo flex-none"><img src={ImgDefault} /></div>
                  <div className="name flex-auto">姓名</div>
                  <div className="num flex-none">emall_8888</div>
              </li>
              <li className="page-flex-row flex-ai-center">
                  <div className="photo flex-none"><img src={ImgDefault} /></div>
                  <div className="name flex-auto">姓名</div>
                  <div className="num flex-none">emall_8888</div>
              </li>
              <li className="page-flex-row flex-ai-center">
                  <div className="photo flex-none"><img src={ImgDefault} /></div>
                  <div className="name flex-auto">姓名</div>
                  <div className="num flex-none">emall_8888</div>
              </li>
          </ul>
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
    actions: bindActionCreators({ }, dispatch),
  })
)(HomePageContainer);
