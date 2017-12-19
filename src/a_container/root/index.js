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
import lazeAppHome from 'bundle-loader?lazy&name=apphome!../apphome/index';
import lazeHealthy from 'bundle-loader?lazy&name=healthy!../healthy';
import lazeMy from 'bundle-loader?lazy&name=my!../my';
import lazeNotFound from 'bundle-loader?lazy&name=notfound!../notfound';
import lazeLogin from 'bundle-loader?lazy&name=login!../login';
import lazeRegister from 'bundle-loader?lazy&name=register!../register';
import lazeShare from 'bundle-loader?lazy&name=share!../share';
import lazeWxShare from 'bundle-loader?lazy&name=wxshare!../share/wxShare';
import lazeJump from 'bundle-loader?lazy&name=jump!../jump';
import lazeShop from 'bundle-loader?lazy&name=shop!../shop';
import lazeForgot from 'bundle-loader?lazy&name=forgot!../register/forgot';
import lazeBinding from 'bundle-loader?lazy&name=binding!../register/binding';
import lazeSetPassword from 'bundle-loader?lazy&name=setpassword!../register/setpassword';
import lazeProfit from 'bundle-loader?lazy&name=profit!../profit';

// import lazeNews from 'bundle-loader?lazy!../news';
// import lazeDownLine from 'bundle-loader?lazy!../downline';

const Home = (props) => (<Bundle load={lazeHome}>{(Home) => <Home {...props} />}</Bundle>);                     // 首页
const AppHome = (props) => (<Bundle load={lazeAppHome}>{(AppHome) => <AppHome {...props} />}</Bundle>);         // App首页

const Healthy = (props) => (<Bundle load={lazeHealthy}>{(Healthy) => <Healthy {...props} />}</Bundle>);         // 健康管理模块
const My = (props) => (<Bundle load={lazeMy}>{(My) => <My {...props} />}</Bundle>);                             // 我的e家模块
const Login = (props) => (<Bundle load={lazeLogin}>{(Login) => <Login {...props} />}</Bundle>);                 // 登录页
// const News = (props) => (<Bundle load={lazeNews}>{(News) => <News {...props} />}</Bundle>);                  // 最新资讯（暂时没用）
// const DownLine = (props) => (<Bundle load={lazeDownLine}>{(DownLine) => <DownLine {...props} />}</Bundle>);  // 线下体验店（暂时没用）
const Register = (props) => (<Bundle load={lazeRegister}>{(Register) => <Register {...props} />}</Bundle>);     // 注册页
const Forgot = (props) => (<Bundle load={lazeForgot}>{(Forgot) => <Forgot {...props} />}</Bundle>);           // 忘记密码页
const Share = (props) => (<Bundle load={lazeShare}>{(Share) => <Share {...props} />}</Bundle>);                 // 分享出去展现的页面
const WxShare = (props) => (<Bundle load={lazeWxShare}>{(WxShare) => <WxShare {...props} />}</Bundle>);                 // 分享出去展现的页面
const Shop = (props) => (<Bundle load={lazeShop}>{(Share) => <Share {...props} />}</Bundle>);                   // 商城、商品详情等模块
const Jump = (props) => (<Bundle load={lazeJump}>{(Jump) => <Jump {...props} />}</Bundle>);                    // 微信支付跳转页
const Binding = (props) => (<Bundle load={lazeBinding}>{(Binding) => <Binding {...props} />}</Bundle>);        // 绑定手机页
const NotFound = (props) => (<Bundle load={lazeNotFound}>{(NotFound) => <NotFound {...props} />}</Bundle>);     // 404页
const SetPassword = (props) => (<Bundle load={lazeSetPassword}>{(SetPassword) => <SetPassword {...props} />}</Bundle>);     // 设置密码页
const Profit = (props) => (<Bundle load={lazeProfit}>{(Profit) => <Profit {...props} />}</Bundle>);     // 收益管理模块

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
import tools from '../../util/all';

/**
 * 所需action
 * **/
import { login } from '../../a_action/app-action';

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

  componentDidMount() {
      window.theHistory = history;  // 将history存入全局，fetch-api中要用
      // this.autoLogin(); // 自动登录(暂时不自动登，登录逻辑大改)
  }

  /**
   * 如果具备自动登录的条件，就直接登录
   * 每次登入程序都得重新登录
   * 因为后台会过期
   * **/
  autoLogin() {
      // 如果是原生系统，就从原生系统登录
      const userinfo = tools.getUserInfoByNative();
      if (userinfo) {
          const params = {
              loginName: userinfo.mobile,
              password: userinfo.password,
              mobile: userinfo.mobile,
              loginIp: returnCitySN["cip"] || '',
              appType: 1,
              appVersion: 'web'
          };
          this.props.actions.login(params).then((res) => {
              if (res.status === 200) {
                  // 将用户信息保存到sessionStorage
                  sessionStorage.setItem('userinfo', JSON.stringify(res.data));
                  // 将登录信息保存到localStorage，以便以后自动登录
                  localStorage.setItem('userlogininfo', JSON.stringify(userinfo));
              }
          });
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
                  <Route path="/apphome" render={(props) => this.onEnter(AppHome, props)} />
                  <Route path="/healthy" render={(props) => this.onEnter(Healthy, props)} />
                  <Route path="/my" render={(props) => this.onEnter(My, props)} />
                  <Route path="/jump" render={(props) => this.onEnter(Jump, props)} />
                  <Route path="/shop" render={(props) => this.onEnter(Shop, props)} />
                  <Route path="/share/:id" render={(props) => this.onEnter(Share, props)} />
                  <Route path="/wxshare" render={(props) => this.onEnter(WxShare, props)} />
                  <Route path="/profit" render={(props) => this.onEnter(Profit, props)} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/binding" component={Binding} />
                  <Route exact path="/forgot" component={Forgot} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/setpassword" component={SetPassword} />
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
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
  }), 
  (dispatch) => ({
      actions: bindActionCreators({ login }, dispatch),
  })
)(RootContainer);
