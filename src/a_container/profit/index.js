/* 收益管理 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import tools from '../../util/all';
// ==================
// 所需的所有组件
// ==================

import { Switch, Route } from 'react-router-dom';
import Main from './container/main';
import ProDetail from './container/proDetail';
import ProDetails from './container/proDetails';
import Tixian from './container/tiXian';
import TixianNow from './container/tiXian/tiXianNow';
import TixianDetail from './container/tiXian/tiXianDetail';
import TixianRecord from './container/tiXian/tiXianRecord';

// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class Healthy extends React.Component {
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
            <Route exact path={`${this.props.match.url}/prodetail`} component={ProDetail} />
            <Route exact path={`${this.props.match.url}/prodetails/:id`} component={ProDetails} />
            <Route exact path={`${this.props.match.url}/tixian`} component={Tixian} />
            <Route exact path={`${this.props.match.url}/tixiannow`} component={TixianNow} />
            <Route exact path={`${this.props.match.url}/tixiandetail`} component={TixianDetail} />
            <Route exact path={`${this.props.match.url}/tixianrecord`} component={TixianRecord} />
          </Switch>
        </div>
    );
  }
}

// ==================
// PropTypes
// ==================

Healthy.propTypes = {
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
)(Healthy);
