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
import { Tabs, List } from 'antd-mobile';
import ImgDefault from '../../../../assets/default-head.jpg';
import Img404 from '../../../../assets/not-found.png';
import Li from './component/list';
// ==================
// 本页面所需action
// ==================

import { getMyCustomers } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        id: null,
        type: 4,
        data: null,
    };
  }

  componentWillMount() {
      const p = this.props.location.pathname.split('/');
      this.setState({
          id: Number(p[p.length - 2]) || null,
          type: Number(p[p.length - 1]) || 4,
      });
  }

  componentDidMount() {
      document.title = '我的推广客户';
      if (this.state.id){
          this.getData(this.state.id);
      }
  }

  getData(userId = null) {
        if (userId && Number(userId)) {
            this.props.actions.getMyCustomers({ userId: Number(userId) }).then((res) => {
                if (res.status === 200) {
                    if (res.data) {
                        this.setState({
                            data: res.data,
                        });
                    }
                }
            });
        }
  }

  render() {
      const t = this.state.type;
      const d = this.state.data || {};
      console.log('D是个什么；',d ,d.shareUser);
      const tabs = [];
      if ([0,1,2,5,6].includes(t)) {     // 各种经销商用户
        tabs.push(
            {title: '分销用户', list: d.distributionUser, type: 'distribution'},
            {title: '分享客户', list: d.shareUser, type: 'share'},
            {title: '未绑定用户', list: d.unBindUser, type: 'unbind'}
        );
      } else if ([3,7].includes(t)) {
          tabs.push(
              {title: '分销用户', list: d.distributionUser},
              {title: '分享客户', list: d.shareUser},
          );
      }

    return (
      <div className="page-customer">
          {
              tabs.length ? (
                  <Tabs
                      swipeable={false}
                      tabs={tabs}
                  >
                      {
                          tabs.map((obj, index) =>
                              <div key={index} className="tabs-div">
                                  <ul className="data-list">
                                      {
                                          obj.list && obj.list.length ? obj.list.map((item, index) => {
                                              return <Li
                                                  key={index}
                                                  data={item}
                                                  type={obj.type}
                                              />;
                                          }) : <li key={0} className="data-nothing">
                                              <img src={Img404}/>
                                              <div>亲，这里什么也没有哦~</div>
                                          </li>
                                      }
                                  </ul>
                              </div>
                          )
                      }
                  </Tabs>
              ) : (
                  <ul className="data-list">
                      {
                          d.shareUser && d.shareUser.length ? d.shareUser.map((item, index) => {
                              return <Li
                                  key={index}
                                  data={item}
                                  type={'normal'}
                              />;
                          }) : <li key={0} className="data-nothing">
                              <img src={Img404}/>
                              <div>亲，这里什么也没有哦~</div>
                          </li>
                      }
                  </ul>
              )
          }
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
    actions: bindActionCreators({ getMyCustomers }, dispatch),
  })
)(HomePageContainer);
