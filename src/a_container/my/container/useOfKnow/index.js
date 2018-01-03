/* 产品详情 - 产品须知 */

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
      document.title = '产品须知';
  }

  //
   onLogOut(){
      localStorage.removeItem('userinfo');
      this.props.history.replace('/login');
   }

  render() {
    return (
      <div className="page-use-of-know">
          <div className="title">
              <span>体检卡如何使用</span>
          </div>
          <div className="info">
              <p>1.购买成功后，请前往【健康管理】 - 【我的体检卡】中查看体检卡卡号</p>
              <p>2.在商品详情页查看体检卡适用的线下店，可选择其中任意一家翼猫服务体检中心并前往体检</p>
          </div>
          <div className="title">
              <span>使用须知</span>
          </div>
          <div className="info">
              <p className="blue">本体检卡是虚拟商品，不记名、不挂失</p>
              <p>一张体检卡仅供一人使用一次</p>
              <p>有效期：<span>一年</span></p>
              <p>联系客服：<span>400-151-9999</span></p>
          </div>
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
