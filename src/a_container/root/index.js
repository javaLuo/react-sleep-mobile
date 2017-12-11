/* 根页 - 包含了根级路由 */
import React from 'react';
import { Router, BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import P from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHistory from 'history/createHashHistory';
import $ from 'jquery';
import './index.scss';
/** 下面是代码分割异步加载的例子 */
import Bundle from '../../a_component/bundle';
import lazeHome from 'bundle-loader?lazy&name=home!../home/index';
import lazeHealthy from 'bundle-loader?lazy&name=healthy!../healthy';
import lazeMy from 'bundle-loader?lazy&name=my!../my';
import lazeNotFound from 'bundle-loader?lazy&name=notfound!../notfound';
import lazeLogin from 'bundle-loader?lazy&name=login!../login';
import lazeRegister from 'bundle-loader?lazy&name=register!../register';
import lazeShare from 'bundle-loader?lazy&name=share!../share';
import lazeJump from 'bundle-loader?lazy&name=jump!../jump';
import lazeShop from 'bundle-loader?lazy&name=shop!../shop';
// import lazeNews from 'bundle-loader?lazy!../news';
// import lazeDownLine from 'bundle-loader?lazy!../downline';

const Home = (props) => (<Bundle load={lazeHome}>{(Home) => <Home {...props} />}</Bundle>);                     // 首页
const Healthy = (props) => (<Bundle load={lazeHealthy}>{(Healthy) => <Healthy {...props} />}</Bundle>);         // 健康管理模块
const My = (props) => (<Bundle load={lazeMy}>{(My) => <My {...props} />}</Bundle>);                             // 我的e家模块
const Login = (props) => (<Bundle load={lazeLogin}>{(Login) => <Login {...props} />}</Bundle>);                 // 登录页
// const News = (props) => (<Bundle load={lazeNews}>{(News) => <News {...props} />}</Bundle>);                  // 最新资讯（暂时没用）
// const DownLine = (props) => (<Bundle load={lazeDownLine}>{(DownLine) => <DownLine {...props} />}</Bundle>);  // 线下体验店（暂时没用）
const Register = (props) => (<Bundle load={lazeRegister}>{(Register) => <Register {...props} />}</Bundle>);     // 注册页
const Share = (props) => (<Bundle load={lazeShare}>{(Share) => <Share {...props} />}</Bundle>);                 // 分享出去展现的页面
const Shop = (props) => (<Bundle load={lazeShop}>{(Share) => <Share {...props} />}</Bundle>);                   // 商城、商品详情等模块
const Jump = (props) => (<Bundle load={lazeJump}>{(Jump) => <Share {...props} />}</Bundle>);                    // 微信支付跳转页
const NotFound = (props) => (<Bundle load={lazeNotFound}>{(NotFound) => <NotFound {...props} />}</Bundle>);     // 404页

/** 下面是代码不分割的页面加载方式 */

// import Home from '../home/index';
// import Healthy from '../healthy';
// import My from '../My';
// import Login from '../login';
// import Shop from '../shop';
// import News from '../news';
// import DownLine from '../downLine';
// import Register from '../register';
// import Binding from '../register/binding';
// import NotFound from '../notfound';
// import Share from '../share';
// import Jump from '../jump';

/**
 * 普通组件
 * */
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
                  <Route path="/healthy" render={(props) => this.onEnter(Healthy, props)} />
                  <Route path="/my" render={(props) => this.onEnter(My, props)} />
                  <Route path="/jump" render={(props) => this.onEnter(Jump, props)} />
                  <Route path="/shop" render={(props) => this.onEnter(Shop, props)} />
                  <Route path="/share/:id" render={(props) => this.onEnter(Share, props)} />
                  <Route exact path="/register" component={Register} />
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
