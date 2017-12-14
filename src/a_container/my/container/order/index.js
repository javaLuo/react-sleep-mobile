/* 我的e家 - 订单 */

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

import { Tabs, Button } from 'antd-mobile';

// ==================
// 本页面所需action
// ==================

import { mallOrderList } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.getData();
  }

  // 获取当前登录用户的相关信息
  getData() {
      this.props.actions.mallOrderList({ pageNum:0, pageSize: 999 }).then((res) => {

      });
  }

  render() {
    return (
      <div className="page-order" style={{ minHeight: '100vh' }}>
          <Tabs
            tabs={[
                { title: '全部' },
                { title: '待处理' },
                { title: '已完成' }
            ]}
          >
              <div className="tabs-div">
                  <ul>
                      <li className="card-box">
                          <div className="title page-flex-row flex-jc-sb">
                              <span className="num">订单号：20989080934830242</span>
                              <span className="type">待付款</span>
                          </div>
                          <div className="info page-flex-row">
                              <div className="pic flex-none"></div>
                              <div className="goods flex-auto">
                                  <div className="t">精准健康筛查体检卡</div>
                                  <div className="i">￥1000</div>
                                  <div className="i">*2</div>
                                  <div className="i">总计：￥2000</div>
                              </div>
                          </div>
                          <div className="controls page-flex-row flex-jc-end">
                              <a>取消订单</a>
                              <a className="blue">付款</a>
                          </div>
                      </li>
                      <li className="card-box">
                          <div className="title page-flex-row flex-jc-sb">
                              <span className="num">订单号：20989080934830242</span>
                              <span className="type">待付款</span>
                          </div>
                          <div className="info page-flex-row">
                              <div className="pic flex-none"></div>
                              <div className="goods flex-auto">
                                  <div className="t">精准健康筛查体检卡</div>
                                  <div className="i">￥1000</div>
                                  <div className="i">*2</div>
                                  <div className="i">总计：￥2000</div>
                              </div>
                          </div>
                          <div className="controls page-flex-row flex-jc-end">
                              <a className="blue">查看体检卡</a>
                          </div>
                      </li>
                  </ul>
              </div>
              <div className="tabs-div">
                  <ul>
                      <li className="card-box">
                          <div className="title page-flex-row flex-jc-sb">
                              <span className="num">订单号：20989080934830242</span>
                              <span className="type">待付款</span>
                          </div>
                          <div className="info page-flex-row">
                              <div className="pic flex-none"></div>
                              <div className="goods flex-auto">
                                  <div className="t">精准健康筛查体检卡</div>
                                  <div className="i">￥1000</div>
                                  <div className="i">*2</div>
                                  <div className="i">总计：￥2000</div>
                              </div>
                          </div>
                          <div className="controls page-flex-row flex-jc-end">
                              <a>取消订单</a>
                              <a className="blue">付款</a>
                          </div>
                      </li>
                  </ul>
              </div>
              <div className="tabs-div">
                  <ul>
                      <li className="card-box">
                          <div className="title page-flex-row flex-jc-sb">
                              <span className="num">订单号：20989080934830242</span>
                              <span className="type">已付款</span>
                          </div>
                          <div className="info page-flex-row">
                              <div className="pic flex-none"></div>
                              <div className="goods flex-auto">
                                  <div className="t">精准健康筛查体检卡</div>
                                  <div className="i">￥1000</div>
                                  <div className="i">*2</div>
                                  <div className="i">总计：￥2000</div>
                              </div>
                          </div>
                          <div className="controls page-flex-row flex-jc-end">
                              <a className="blue">查看体检卡</a>
                          </div>
                      </li>
                  </ul>
              </div>
          </Tabs>
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
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ mallOrderList }, dispatch),
  })
)(HomePageContainer);
