/* 商城 */

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
import GoodDetail from './container/goodDetail';
import WaterXD from './container/waterXD';
import ConfirmPay from './container/confirmPay';
import PayChose from './container/payChose';
import BecomeDealer from './container/becomeDealer';
import ExprShop from './container/exprShop';
import ExprShop2 from './container/exprShop2';
import Pay from './container/pay';
import PayResult from './container/payresult';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
          <Switch>
              <Route exact path={`${this.props.match.url}/`} component={Main} />
              <Route exact path={`${this.props.match.url}/gooddetail/:id`} component={GoodDetail} />
              <Route exact path={`${this.props.match.url}/waterxd`} component={WaterXD} />
              <Route exact path={`${this.props.match.url}/confirmpay`} component={ConfirmPay} />
              <Route exact path={`${this.props.match.url}/paychose`} component={PayChose} />
              <Route exact path={`${this.props.match.url}/pay`} component={Pay} />
              <Route exact path={`${this.props.match.url}/payresult`} component={PayResult} />
              <Route exact path={`${this.props.match.url}/becomedealer`} component={BecomeDealer} />
              <Route exact path={`${this.props.match.url}/exprshop`} component={ExprShop} />
              <Route exact path={`${this.props.match.url}/exprshop2`} component={ExprShop2} />
          </Switch>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Shop.propTypes = {
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
)(Shop);
