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
import lazeRegister from 'bundle-loader?lazy!../register';
import lazeShop from 'bundle-loader?lazy!../shop';
import lazeNews from 'bundle-loader?lazy!../news';

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
const Shop = (props) => (
    <Bundle load={lazeShop}>
        {(Shop) => <Shop {...props} />}
    </Bundle>
);
const News = (props) => (
    <Bundle load={lazeNews}>
        {(News) => <News {...props} />}
    </Bundle>
);
const Register = (props) => (
    <Bundle load={lazeRegister}>
        {(Register) => <Register {...props} />}
    </Bundle>
);
const NotFound = (props) => (
    <Bundle load={lazeNotFound}>
        {(NotFound) => <NotFound {...props} />}
    </Bundle>
);
/* 上面是代码分割异步加载的例子 */

import Menu from '../../a_component/menu';

const history = createHistory();
class RootContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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


    /* 权限控制 */
    onEnter(Component, props) {
        // 如果没有登陆，直接跳转至login页,注册页不用跳
        // if (sessionStorage.getItem('userinfo')) {
        //     return <Component {...props} />;
        // } else {
        //     return <Redirect to='/login' />;
        // }
        return <Component {...props} />;
    }

  render() {
    return ([
      <Router history={history} key="history">
        <Route render={(props) => {
          return (
            <div className="boss">
                <Switch>
                  <Redirect exact from='/' to='/home' />
                  <Route path="/home" render={(props) => this.onEnter(Home, props)} />
                  <Route path="/intel" render={(props) => this.onEnter(Intel, props)} />
                  <Route path="/healthy" render={(props) => this.onEnter(Healthy, props)} />
                  <Route path="/my" render={(props) => this.onEnter(My, props)} />
                  <Route path="/shop" render={(props) => this.onEnter(Shop, props)} />
                  <Route path="/news" render={(props) => this.onEnter(News, props)} />
                  <Route exact path="/register" render={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route component={NotFound} />
                </Switch>
                <Menu location={props.location} history={props.history}/>
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
  location: P.any,
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
