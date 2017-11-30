/* 我的e家 - 翼猫圈 */

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
import Img1 from '../../../../assets/test/test1.jpg';
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
      <div className="cat-zone">
          <div className="banner">
              <img src={Img1} />
          </div>
          <List>
              <Item arrow="horizontal">排行榜</Item>
              <Item arrow="horizontal">翼猫政策</Item>
              <Item arrow="horizontal">我的客户</Item>
              <Item arrow="horizontal">隶属体验店</Item>
              <Item arrow="horizontal">翼猫公益</Item>
              <Item arrow="horizontal">活动报名</Item>
          </List>
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
