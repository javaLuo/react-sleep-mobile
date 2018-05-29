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
import { shopCartCount } from '../../a_action/new-action';

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
      setTimeout(() => {this.getUserInfo();this.props.actions.shopCartCount();});
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
        if (location.href.indexOf('?#') < 0 && (!!tools.check(tools.compilet(c["a"])*(10**5))) && location.href.indexOf('/z/') < 0) {
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
      if(!['home','shop'].includes(props.location.pathname.split('/')[1])){
          document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
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
                    shoppingCarNum={this.props.shoppingCarNum}
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
    shoppingCarNum: P.number,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      shoppingCarNum: state.shop.shoppingCarNum,
  }), 
  (dispatch) => ({
      actions: bindActionCreators({ login, getUserInfo, shopCartCount }, dispatch),
  })
)(RootContainer);
