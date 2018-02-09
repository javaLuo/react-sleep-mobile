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
import { List } from 'antd-mobile';
import ImgDefault from '../../../../assets/default-head.jpg';
import Img404 from '../../../../assets/not-found.png';
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
        data: [],
    };
  }

  componentDidMount() {
      document.title = '我的推广客户';
      const p = this.props.location.pathname.split('/');
      if (Number(p[p.length - 1])){
          this.getData(p[p.length - 1]);
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

    // 工具 - 通过用户类型type获取对应的称号
    getNameByUserType(type) {
        switch(String(type)){
            case '0': return '体验版经销商';
            case '1': return '微创版经销商';
            case '2': return '个人版经销商';
            case '3': return '分享用户';
            case '4': return '普通用户';
            case '5': return '企业版经销商';
            case '6': return '企业版经销商'; // 子账户
            case '7': return '分销用户';
            default: return '';
        }
    }

  render() {
    return (
      <div className="page-customer">
          <ul className="data-list">
              {
                  this.state.data.length ? this.state.data.map((item, index) => {
                      return <li key={index} className="page-flex-row flex-ai-center">
                          <div className="photo flex-none"><img src={item.headImg || ImgDefault} /></div>
                          <div className="name flex-auto">
                              <div className="all_nowarp">昵称：{item.nickName}</div>
                              <div className="lit">e家号：{item.id}</div>
                              <div className="lit mt">身份：{this.getNameByUserType(item.userType)}<span>{item.ambassadorTime}</span></div>
                          </div>
                      </li>;
                  }) : <li key={0} className="data-nothing">
                      <img src={Img404}/>
                      <div>亲，这里什么也没有哦~</div>
                  </li>
              }
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
