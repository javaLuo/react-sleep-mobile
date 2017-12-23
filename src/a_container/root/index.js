/* 根页 - 包含了根级路由 */
import React from 'react';
import { Router, BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import P from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHistory from 'history/createHashHistory';
import $ from 'jquery';
import './index.scss';
import { Toast } from 'antd-mobile';
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
import lazeDaiYanShare from 'bundle-loader?lazy&name=daiyanshare!../share/daiyanShare';
import lazeJump from 'bundle-loader?lazy&name=jump!../jump';
import lazeShop from 'bundle-loader?lazy&name=shop!../shop';
import lazeForgot from 'bundle-loader?lazy&name=forgot!../register/forgot';
import lazeProfit from 'bundle-loader?lazy&name=profit!../profit';


const Home = (props) => (<Bundle load={lazeHome}>{(Home) => <Home {...props} />}</Bundle>);                     // 首页
const AppHome = (props) => (<Bundle load={lazeAppHome}>{(AppHome) => <AppHome {...props} />}</Bundle>);         // App首页

const Healthy = (props) => (<Bundle load={lazeHealthy}>{(Healthy) => <Healthy {...props} />}</Bundle>);         // 健康管理模块
const My = (props) => (<Bundle load={lazeMy}>{(My) => <My {...props} />}</Bundle>);                             // 我的e家模块
const Login = (props) => (<Bundle load={lazeLogin}>{(Login) => <Login {...props} />}</Bundle>);                 // 登录页
// const News = (props) => (<Bundle load={lazeNews}>{(News) => <News {...props} />}</Bundle>);                  // 最新资讯（暂时没用）
// const DownLine = (props) => (<Bundle load={lazeDownLine}>{(DownLine) => <DownLine {...props} />}</Bundle>);  // 线下体验店（暂时没用）
const Register = (props) => (<Bundle load={lazeRegister}>{(Register) => <Register {...props} />}</Bundle>);     // 注册页
const Forgot = (props) => (<Bundle load={lazeForgot}>{(Forgot) => <Forgot {...props} />}</Bundle>);            // 忘记密码页
const Share = (props) => (<Bundle load={lazeShare}>{(Share) => <Share {...props} />}</Bundle>);                 // 分享出去展现的页面
const WxShare = (props) => (<Bundle load={lazeWxShare}>{(WxShare) => <WxShare {...props} />}</Bundle>);         // 分享出去展现的页面
const DaiYanShare = (props) => (<Bundle load={lazeDaiYanShare}>{(WxShare) => <WxShare {...props} />}</Bundle>);         // 分享出去展现的页面
const Shop = (props) => (<Bundle load={lazeShop}>{(Share) => <Share {...props} />}</Bundle>);                   // 商城、商品详情等模块
const Jump = (props) => (<Bundle load={lazeJump}>{(Jump) => <Jump {...props} />}</Bundle>);                    // 微信支付跳转页
const NotFound = (props) => (<Bundle load={lazeNotFound}>{(NotFound) => <NotFound {...props} />}</Bundle>);     // 404页
const Profit = (props) => (<Bundle load={lazeProfit}>{(Profit) => <Profit {...props} />}</Bundle>);             // 收益管理模块

/**
 * 普通组件
 * */
import Menu from '../../a_component/menu';
import tools from '../../util/all';
import Test from '../test';
/**
 * 所需action
 * **/
import { login, getUserInfo } from '../../a_action/app-action';

const history = createHistory();
class RootContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false,    // 是否显示页面，所有初始化处理完了才显示
    };
  }

  componentWillMount() {

      this.getOpenId();                 // 先获取openId
      const ok = this.initURL();       // 初始化URL
      if (ok) {
          this.initFontSize();          // 启动响应式字体
          this.setState({
              show: true
          });
      }
  }

  componentDidMount() {
      window.theHistory = history;  // 将history存入全局，fetch-api中要用
      this.getUserInfo();   // 获取用户信息
  }

    /**
     * 获取openID(公众号会有，其他方式没有)
     * 进入此页面时，后台会在URL中加入openId参数
     * openId在登录和微信支付时需要
     * **/
    getOpenId() {
        /**
         * 1. 如果localStorage里没有，说明是第1次登录或之前退出了登录
         * 2. 如果localStorage里有，就不再重新获取(因为退出后可以登其他的号，登录其他号时保存其他号的openId)
         * **/
        const openId = localStorage.getItem('openId');
        if (!openId) {
            const params = tools.makeSearch(window.location.href.split('?')[1]);
            if (params.openid) {
                localStorage.setItem('openId', params.openid);
            }
        }
    }

    /**
     * 为了微信支付时正确的解析到微信商户平台授权的URL，所以要这么做
     * **/
    initURL() {
        const location = window.location;
        if (location.href.indexOf('?#') < 0) { // 如果没找到，说明是首次进入，或是异常进入，就改变此URL
            const href = (location.hash.split('?')[0]).replace('#', '?#');
            location.replace(href);
            return false;
        }
        return true;
    }

    /**
     * 启动自适应字体
     * **/
    initFontSize() {
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

    /**
     * 获取用户信息
     * 公众号可以用openId获取
     * 其他方式需要传给我用户名和密码，然后调用登录接口进行自动登录（返回用户信息）
     * **/
    getUserInfo() {
        if (tools.isWeixin()) { // 是微信浏览器，用openID直接获取用户信息
            const openId = localStorage.getItem('openId');
            if (openId) {
                this.props.actions.getUserInfo({ openId });
            } else {
                console.log('未获取到openId');
            }
        } else {    // 不是微信浏览器，表示是APP内嵌网页或普通网页打开
            const loginInfo = tools.getUserInfoByNative();
            if (loginInfo) {
                this.props.actions.login({ loginName: loginInfo.mobile, password: loginInfo.password });
            } else {
                console.log('未获取到用户登录所需信息');
            }
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
            <div className={this.state.show ? 'boss' : 'boss hide'}>
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
                  <Route path="/daiyanshare/:id" render={(props) => this.onEnter(DaiYanShare, props)} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/forgot" component={Forgot} />
                  <Route exact path="/login" component={Login} />
                  <Route path="/test" component={Test} />
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
      actions: bindActionCreators({ login, getUserInfo }, dispatch),
  })
)(RootContainer);
