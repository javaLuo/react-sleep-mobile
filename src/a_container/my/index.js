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

// ==================
// 所需的所有组件
// ==================

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
import MyDaiYan from './container/myDaiYan';
import BindDealer from './container/bindDealer';
import BindPhone from './container/bindPhone';
import SetPassword from './container/setPassword';
import CheckPwd from './container/checkPwd';
import MyCustomer from './container/mycustomer';
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
              <Route exact path={`${this.props.match.url}/mydaiyan`} component={MyDaiYan} />
              <Route exact path={`${this.props.match.url}/binddealer`} component={BindDealer} />
              <Route exact path={`${this.props.match.url}/bindphone`} component={BindPhone} />
              <Route exact path={`${this.props.match.url}/setpassword`} component={SetPassword} />
              <Route exact path={`${this.props.match.url}/checkpwd`} component={CheckPwd} />
              <Route exact path={`${this.props.match.url}/mycustomer`} component={MyCustomer} />
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
