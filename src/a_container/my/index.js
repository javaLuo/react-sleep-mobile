/* 我的e家 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import tools from '../../util/all';
// ==================
// 所需的所有组件
// ==================

import { Toast } from 'antd-mobile';
import Main from './container/main';
import UserInfo from './container/userInfo';
import PerInfo from './container/perInfo';

import Authentication from './container/authentication';
import Order from './container/order';
import OrderDetail from './container/orderdetail';
import PaySuccess from './container/paySuccess';
import UseOfKnow from './container/useOfKnow';
import HealthyAmb from './container/healthyAmb';
import AtCat from './container/atCat';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class My extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    componentWillMount(){
        this.getOpenId();
    }

    /**
     * 获取openID
     * 进入此页面时，后台会在URL中加入openId参数
     * openId在登录和微信支付时需要
     * **/
    getOpenId() {
        const params = tools.makeSearch(this.props.location.search);
        if (params.openid) {
            localStorage.setItem('openId', params.openid);
        }
    }

  render() {
    return (
      <div>
          <Switch>
              <Route exact path={`${this.props.match.url}/`} component={Main} />
              <Route exact path={`${this.props.match.url}/userinfo`} component={UserInfo} />
              <Route exact path={`${this.props.match.url}/perinfo`} component={PerInfo} />
              <Route exact path={`${this.props.match.url}/authentication`} component={Authentication} />
              <Route exact path={`${this.props.match.url}/order`} component={Order} />
              <Route exact path={`${this.props.match.url}/orderdetail`} component={OrderDetail} />
              <Route exact path={`${this.props.match.url}/paysuccess/:id`} component={PaySuccess} />
              <Route exact path={`${this.props.match.url}/useofknow`} component={UseOfKnow} />
              <Route exact path={`${this.props.match.url}/healthyamb`} component={HealthyAmb} />
              <Route exact path={`${this.props.match.url}/atCat`} component={AtCat} />
          </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

My.propTypes = {
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
)(My);
