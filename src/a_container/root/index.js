/* 根页 - 包含了根级路由 */
import React from 'react';
import { Router, BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import P from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHistory from 'history/createHashHistory';
import $ from 'jquery';
import './index.scss';
/* 下面是代码分割异步加载的例子 */
import Bundle from '../../a_component/bundle';
import lazeHome from 'bundle-loader?lazy!../home';
import lazeIntel from 'bundle-loader?lazy!../intel';
import lazeHealthy from 'bundle-loader?lazy!../healthy';
import lazeMy from 'bundle-loader?lazy!../my';
import lazeNotFound from 'bundle-loader?lazy!../notfound';
import lazeLogin from 'bundle-loader?lazy!../login';

const Home = (props) => (
  <Bundle load={lazeHome}>
    {(Home) => <Home {...props} />}
  </Bundle>
);
const Intel = (props) => (
  <Bundle load={lazeIntel}>
    {(Intel) => <Intel {...props} />}
  </Bundle>
);
const Healthy = (props) => (
  <Bundle load={lazeHealthy}>
    {(Healthy) => <Healthy {...props} />}
  </Bundle>
);
const My = (props) => (
  <Bundle load={lazeMy}>
    {(My) => <My {...props} />}
  </Bundle>
);

const Login = (props) => (
    <Bundle load={lazeLogin}>
        {(Login) => <Login {...props} />}
    </Bundle>
);

const NotFound = (props) => (
    <Bundle load={lazeNotFound}>
        {(NotFound) => <NotFound {...props} />}
    </Bundle>
);
/* 上面是代码分割异步加载的例子 */


const history = createHistory();
class RootContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
      $(window).on("resize",function(){
          //自适应字体大小设置
          const windowWidth = $(window).width();
          const htmlSize = windowWidth / 7.5;

          if(windowWidth<=750){
              $("html").css("font-size",htmlSize+"px");
          }else{
              $("html").css("font-size","100px");
          }
      }).resize();
  }

  render() {
    return ([
      <Router history={history} key="history">
        <Route render={(props) => {
          return (
            <div className="boss">
                <Switch>
                  <Redirect exact from='/' to='/home' />
                  <Route path="/home" component={Home} />
                  <Route path="/intel" component={Intel} />
                  <Route path="/healthy" component={Healthy} />
                  <Route path="/my" component={My} />
                  <Route path="/login" component={Login} />
                  <Route component={NotFound} />
                </Switch>
            </div>
          );
        }}/>
      </Router>
    ]);
  }
}

// ==================
// PropTypes
// ==================

RootContainer.propTypes = {
  dispatch: P.func,
  children: P.any,
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
)(RootContainer);
