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
// import Bundle from '../../a_component/bundle';
// import lazeHome from 'bundle-loader?lazy!../home/index';
// import lazeIntel from 'bundle-loader?lazy!../intel';
// import lazeHealthy from 'bundle-loader?lazy!../healthy';
// import lazeMy from 'bundle-loader?lazy!../my';
// import lazeNotFound from 'bundle-loader?lazy!../notfound';
// import lazeLogin from 'bundle-loader?lazy!../login';
// import lazeRegister from 'bundle-loader?lazy!../register';
// import lazeShop from 'bundle-loader?lazy!../shop';
// import lazeNews from 'bundle-loader?lazy!../news';
// import lazeDownLine from 'bundle-loader?lazy!../downline';
// import lazePhy from 'bundle-loader?lazy!../phy';

// const Home = (props) => (
//   <Bundle load={lazeHome}>
//     {(Home) => <Home {...props} />}
//   </Bundle>
// );
// const Intel = (props) => (
//   <Bundle load={lazeIntel}>
//     {(Intel) => <Intel {...props} />}
//   </Bundle>
// );
// const Healthy = (props) => (
//   <Bundle load={lazeHealthy}>
//     {(Healthy) => <Healthy {...props} />}
//   </Bundle>
// );
// const My = (props) => (
//   <Bundle load={lazeMy}>
//     {(My) => <My {...props} />}
//   </Bundle>
// );
// const Login = (props) => (
//     <Bundle load={lazeLogin}>
//         {(Login) => <Login {...props} />}
//     </Bundle>
// );
// const Shop = (props) => (
//     <Bundle load={lazeShop}>
//         {(Shop) => <Shop {...props} />}
//     </Bundle>
// );
// const News = (props) => (
//     <Bundle load={lazeNews}>
//         {(News) => <News {...props} />}
//     </Bundle>
// );
// const DownLine = (props) => (
//     <Bundle load={lazeDownLine}>
//         {(DownLine) => <DownLine {...props} />}
//     </Bundle>
// );
// const Phy = (props) => (
//     <Bundle load={lazePhy}>
//         {(Phy) => <Phy {...props} />}
//     </Bundle>
// );
// const Register = (props) => (
//     <Bundle load={lazeRegister}>
//         {(Register) => <Register {...props} />}
//     </Bundle>
// );
// const NotFound = (props) => (
//     <Bundle load={lazeNotFound}>
//         {(NotFound) => <NotFound {...props} />}
//     </Bundle>
// );
/* 上面是代码分割异步加载的例子 */
import Home from '../home/index';
import Intel from '../intel';
import Healthy from '../healthy';
import My from '../My';
import Login from '../login';
import Shop from '../shop';
import News from '../news';
import DownLine from '../downLine';
import Register from '../register';
import Binding from '../register/binding';
import NotFound from '../notfound';
import Menu from '../../a_component/menu';
import Phy from '../phy';
import Share from '../share';
import Jump from '../jump';

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

      // 处理是否是微信网页授权回调
      console.log('ROOT-LOCATION:', window.location);
      if (window.location.hash === '#/') { // 第1次进入主页，如果此时带参数，表示是微信回跳

      }
  }


    /* 权限控制 */
    onEnter(Component, props) {
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
                  <Route path="/downline" render={(props) => this.onEnter(DownLine, props)} />
                  <Route path="/phy" render={(props) => this.onEnter(Phy, props)} />
                  <Route path="/jump" render={(props) => this.onEnter(Jump, props)} />
                  <Route path="/share/:id" render={(props) => this.onEnter(Share, props)} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/binding" component={Binding} />
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
