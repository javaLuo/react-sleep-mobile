/* 我的e家 - 个人主页 - 收货地址 */

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
import { Button, List, Icon, WingBlank } from 'antd-mobile';
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
      document.title = '收货地址';
  }

  //
   onLogOut(){
      localStorage.removeItem('userinfo');
      this.props.history.replace('/login');
   }

  render() {
    return (
      <div className="addr-page">
          <ul className="list">
              <li>
                  <WingBlank>
                  <div className="name">范冰冰 13600000000</div>
                  <div className="addr">地址地址地址地地址地址地址地址地址地址址地址地址</div>
                  <div className="page-flex-row controls">
                      <div><Icon type="check" size="sm"/> 设为默认</div>
                      <div className="flex-auto btns" style={{ textAlign: 'right' }}>
                          <a >编辑</a>
                          <a >删除</a>
                      </div>
                  </div>
                  </WingBlank>
              </li>
              <li>
                  <WingBlank>
                      <div className="name">范冰冰 13600000000</div>
                      <div className="addr">地址地址地址地地址地址地址地址地址地址址地址地址</div>
                      <div className="page-flex-row controls">
                          <div><Icon type="check" size="sm"/> 设为默认</div>
                          <div className="flex-auto btns" style={{ textAlign: 'right' }}>
                              <a >编辑</a>
                              <a >删除</a>
                          </div>
                      </div>
                  </WingBlank>
              </li>
          </ul>
          <div className="page-footer">
              <Button type="primary" onClick={() => this.props.history.push('/my/newaddr')}>添加收货地址</Button>
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
