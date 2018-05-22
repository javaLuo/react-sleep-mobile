import React from 'react';
import { Router, BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import P from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createHistory from 'history/createHashHistory';
import $ from 'jquery';
import './index.scss';
import Loadable from 'react-loadable';
import Loading from '../../a_component/loading';
import WindowFlod from '../../a_component/windowFlod';
import c from '../../config';

// import Bundle from '../../a_component/bundle';
// import lazeHome from 'bundle-loader?lazy&name=home!../home/index';
// import lazeAppHome from 'bundle-loader?lazy&name=apphome!../apphome/index';
// import lazeHealthy from 'bundle-loader?lazy&name=healthy!../healthy';
// import lazeMy from 'bundle-loader?lazy&name=my!../my';
// import lazeNotFound from 'bundle-loader?lazy&name=notfound!../notfound';
// import lazeLogin from 'bundle-loader?lazy&name=login!../login';
// import lazeRegister from 'bundle-loader?lazy&name=register!../register';
// import lazeShare from 'bundle-loader?lazy&name=share!../share';
// import lazeShareTicketList from 'bundle-loader?lazy&name=shareticketlist!../share/shareTicketList';
// import lazeShareTicket from 'bundle-loader?lazy&name=shareticket!../share/shareTicket';
// import lazeShareFreeCard from 'bundle-loader?lazy&name=sharefreecard!../share/shareFreeCard';
// import lazeShareHra from 'bundle-loader?lazy&name=sharehra!../share/shareHra';
// import lazeWxShare from 'bundle-loader?lazy&name=wxshare!../share/wxShare';
// import lazeDaiYanShare from 'bundle-loader?lazy&name=daiyanshare!../share/daiyanShare';
// import lazeJump from 'bundle-loader?lazy&name=jump!../jump';
// import lazeShop from 'bundle-loader?lazy&name=shop!../shop';
// import lazeForgot from 'bundle-loader?lazy&name=forgot!../register/forgot';
// import lazeProfit from 'bundle-loader?lazy&name=profit!../profit';
// import lazeDownLine from 'bundle-loader?lazy&name=downline!../downLine';
// import lazeLive from 'bundle-loader?lazy&name=lazelive!../live';
//
// const Home = (props) => (<Bundle load={lazeHome}>{(Home) => <Home {...props} />}</Bundle>);                     // 首页
// const AppHome = (props) => (<Bundle load={lazeAppHome}>{(AppHome) => <AppHome {...props} />}</Bundle>);         // App首页
//
// const Healthy = (props) => (<Bundle load={lazeHealthy}>{(Healthy) => <Healthy {...props} />}</Bundle>);         // 健康管理模块
// const My = (props) => (<Bundle load={lazeMy}>{(My) => <My {...props} />}</Bundle>);                             // 我的e家模块
// const Login = (props) => (<Bundle load={lazeLogin}>{(Login) => <Login {...props} />}</Bundle>);                 // 登录页
// const Register = (props) => (<Bundle load={lazeRegister}>{(Register) => <Register {...props} />}</Bundle>);     // 注册页
// const Forgot = (props) => (<Bundle load={lazeForgot}>{(Forgot) => <Forgot {...props} />}</Bundle>);            // 忘记密码页
// const Share = (props) => (<Bundle load={lazeShare}>{(Share) => <Share {...props} />}</Bundle>);                 // 分享出去展现的页面
// const ShareTicketList = (props) => (<Bundle load={lazeShareTicketList}>{(ShareTicketList) => <ShareTicketList {...props} />}</Bundle>);    // 卡片分享点击进入查看5张体检券
// const ShareTicket = (props) => (<Bundle load={lazeShareTicket}>{(ShareTicket) => <ShareTicket {...props} />}</Bundle>);    // 体检券直接分享
// const ShareFreeCard = (props) => (<Bundle load={lazeShareFreeCard}>{(ShareFreeCard) => <ShareFreeCard {...props} />}</Bundle>);    // 优惠卡直接分享
// const ShareHra = (props) => (<Bundle load={lazeShareHra}>{(ShareHra) => <ShareHra {...props} />}</Bundle>);    // 优惠卡直接分享
// const WxShare = (props) => (<Bundle load={lazeWxShare}>{(WxShare) => <WxShare {...props} />}</Bundle>);         // 分享出去展现的页面
// const DaiYanShare = (props) => (<Bundle load={lazeDaiYanShare}>{(WxShare) => <WxShare {...props} />}</Bundle>);         // 分享出去展现的页面
// const Shop = (props) => (<Bundle load={lazeShop}>{(Share) => <Share {...props} />}</Bundle>);                   // 商城、商品详情等模块
// const Jump = (props) => (<Bundle load={lazeJump}>{(Jump) => <Jump {...props} />}</Bundle>);                    // 微信支付跳转页
// const NotFound = (props) => (<Bundle load={lazeNotFound}>{(NotFound) => <NotFound {...props} />}</Bundle>);     // 404页
// const Profit = (props) => (<Bundle load={lazeProfit}>{(Profit) => <Profit {...props} />}</Bundle>);             // 收益管理模块
// const DownLine = (props) => (<Bundle load={lazeDownLine}>{(DownLine) => <DownLine {...props} />}</Bundle>);             // 收益管理模块
// const Live = (props) => (<Bundle load={lazeLive}>{(Live) => <Live {...props} />}</Bundle>);             // 直播模块


const Home = Loadable({ loader: () => import("../home/index"), loading: Loading });
const AppHome = Loadable({ loader: () => import("../apphome/index"), loading: Loading });
const Healthy = Loadable({ loader: () => import("../healthy"), loading: Loading });
const My = Loadable({ loader: () => import("../my"), loading: Loading });
const NotFound = Loadable({ loader: () => import("../notfound"), loading: Loading });
const Login = Loadable({ loader: () => import("../login"), loading: Loading });
const Register = Loadable({ loader: () => import("../register"), loading: Loading });
const Share = Loadable({ loader: () => import("../share"), loading: Loading });
const ShareTicketList = Loadable({ loader: () => import("../share/shareTicketList"), loading: Loading });
const ShareTicket = Loadable({ loader: () => import("../share/shareTicket"), loading: Loading });
const ShareFreeCard = Loadable({ loader: () => import("../share/shareFreeCard"), loading: Loading });
const ShareHra = Loadable({ loader: () => import("../share/shareHra"), loading: Loading });
const WxShare = Loadable({ loader: () => import("../share/wxShare"), loading: Loading });
const DaiYanShare = Loadable({ loader: () => import("../share/daiyanShare"), loading: Loading });
const DaiYanH5Share = Loadable({ loader: () => import("../share/daiyanh5Share"), loading: Loading });
const Jump = Loadable({ loader: () => import("../jump"), loading: Loading });
const Shop = Loadable({ loader: () => import("../shop"), loading: Loading });
const Forgot = Loadable({ loader: () => import("../register/forgot"), loading: Loading });
const Profit = Loadable({ loader: () => import("../profit"), loading: Loading });
const DownLine = Loadable({ loader: () => import("../downLine"), loading: Loading });
const Live = Loadable({ loader: () => import("../live"), loading: Loading });
const Z78 = Loadable({ loader: () => import("../z78"), loading: Loading });

import Menu from '../../a_component/menu';
import tools from '../../util/all';
import Test from '../test';
import { login, getUserInfo } from '../../a_action/app-action';

const history = createHistory();
class RootContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false,
    };
  }

  componentWillMount() {
      this.getOpenId();
      const ok = this.initURL();
      if (ok) {
          this.initFontSize();
          this.setState({
              show: true
          });
      }
  }

  componentDidMount() {
      window.theHistory = history;
      setTimeout(() => this.getUserInfo(), 16);
     Home.preload();
     My.preload();
     Healthy.preload();
  }

    getOpenId() {
        const openId = localStorage.getItem('openId');
        const params = tools.makeSearch(window.location.href.split('?')[1]);
        if (params.openid) {
            localStorage.setItem('openId', params.openid);
        }
    }

    initURL() {
        const location = window.location;
        if (location.href.indexOf('?#') < 0 && (!!tools.check(tools.compilet(c["a"])*(10**5)))) {
            const href = (location.hash.split('?')[0]).replace('#', '?#');
            location.replace(href);
            return false;
        }
        return true;
    }

    initFontSize() {
        $(window).on("resize",function(){
            const windowWidth = $(window).width();
            const htmlSize = windowWidth / 7.5;

            if(windowWidth<=750){
                $("html").css("font-size",htmlSize+"px");
            }else{
                $("html").css("font-size","100px");
            }
        }).resize();
    }

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

    onEnter(Component, props) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
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
                  <Route path="/shareticketlist/:id" render={(props) => this.onEnter(ShareTicketList, props)} />
                  <Route path="/shareticket/:id" render={(props) => this.onEnter(ShareTicket, props)} />
                  <Route path="/sharefreecard/:id" render={(props) => this.onEnter(ShareFreeCard, props)} />
                  <Route path="/sharehra" render={(props) => this.onEnter(ShareHra, props)} />
                  <Route path="/myshare" render={(props) => this.onEnter(ShareHra, props)} />
                  <Route path="/wxshare" render={(props) => this.onEnter(WxShare, props)} />
                  <Route path="/profit" render={(props) => this.onEnter(Profit, props)} />
                  <Route path="/daiyanshare/:id" render={(props) => this.onEnter(DaiYanShare, props)} />
                  <Route path="/daiyanh5share/:id" render={(props) => this.onEnter(DaiYanH5Share, props)} />
                  <Route path="/downline" render={(props) => this.onEnter(DownLine, props)} />
                  <Route path="/live" render={(props) => this.onEnter(Live, props)} />
                  <Route path="/z" render={(props) => this.onEnter(Z78, props)} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/forgot" component={Forgot} />
                  <Route exact path="/login" component={Login} />
                  <Route path="/test" component={Test} />
                  <Route component={NotFound} />
                </Switch>
                <Menu location={props.location} history={props.history}/>
                <WindowFlod
                    location={props.location}
                    history={props.history}
                />
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
