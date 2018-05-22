/* 我的e家 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Toast } from 'antd-mobile';
import WaterWave from 'water-wave';

import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgBar1 from '../../../../assets/default-head.jpg';
import IconUser from './assets/icon-user@3x.png';
import IconPhone from './assets/icon-phone@3x.png';
import IconAddr from './assets/icon-addr@3x.png';
import IconAll from './assets/icon-all@3x.png';
import IconDown from './assets/icon-down@3x.png';
import IconWaitPay from './assets/icon-waitPay@3x.png';
import IconWaitSend from './assets/icon-waitSend@3x.png';
import IconWaitGet from './assets/icon-waitGet@3x.png';

import IconBz from './assets/icon-bz.png';
import IconJkds from './assets/icon-jkds.png';
import IconSy from './assets/icon-sy.png';
import IconWddyk from './assets/icon-wddyk.png';
import IconWdh5xck from './assets/icon-wdh5xck.png';
import IconWdkh from './assets/icon-wdkh.png';
import IconWdkhdd from './assets/icon-wdkhdd.png';
import IconWdsc from './assets/icon-wdsc.png';
import IconWdhk from './assets/icon-wdyhk.png';
import IconWzym from './assets/icon-wzym.png';
import IconYhxy from './assets/icon-yhxy.png';
import IconYsxy from './assets/icon-ysxy.png';

import tools from '../../../../util/all';

// ==================
// 本页面所需action
// ==================

import { getUserInfo, myAmbassador } from '../../../../a_action/app-action';
import { getMyCustomersCount } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,    // 是否显示
            howManyCustomer: 0, // 有多少个推广用户
            svgPlay: false, // svg是否执行
        };
    }

    componentDidMount() {
        document.title = '我的e家';
        if (!this.props.userinfo) {
            this.getUserInfo();
        } else {
            this.getMyAmbassador();
            this.getMyCustomers();
        }
        this.svgInit();
        setTimeout(() => {
            this.setState({
                show: true,
            });
        },0);
        if(!sessionStorage.getItem('win.resize')) {
            window.addEventListener("resize", () => this.realSvg());
            sessionStorage.setItem('win.resize', 't');
        }
    }

    svgInit() {
        const p1 = document.getElementById('path1');
        const p2 = document.getElementById('path2');
        const w = document.getElementById('svg-box').clientWidth;
        const h = document.getElementById('svg-box').clientHeight;
        p1.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.666 * h} Q ${-0.75 * w} ${0.333*h} ${-0.5*w} ${0.666*h} T 0 ${0.666*h} Q ${0.5*w} ${0.333*h} ${w} ${0.666*h} Q ${w} ${0.666*h} ${w} ${0.666*h} L ${w} ${h} Z`);
        p2.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.933 * h} Q ${-0.75*w} ${0.833*h} ${-w*0.5} ${0.933*h} T 0 ${0.933 * h} Q ${0.25*w} ${0.8*h} ${0.5*w} ${0.933 * h} Q ${0.75*w} ${1.07*h} ${w} ${0.933 * h} L ${w} ${h} Z`);
    }

    realSvg() {
        if(!document.getElementById('svg-box')){
            return;
        }
        const p1 = document.getElementById('path1');
        const p2 = document.getElementById('path2');
        const w = document.getElementById('svg-box').clientWidth;
        const h = document.getElementById('svg-box').clientHeight;
        if(!this.state.svgPlay){
            p1.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.666 * h} Q ${-0.75 * w} ${0.333*h} ${-0.5*w} ${0.666*h} T 0 ${0.666*h} Q ${0.5*w} ${0.333*h} ${w} ${0.666*h} Q ${w} ${0.666*h} ${w} ${0.666*h} L ${w} ${h} Z`);
            p2.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.933 * h} Q ${-0.75*w} ${0.833*h} ${-w*0.5} ${0.933*h} T 0 ${0.933 * h} Q ${0.25*w} ${0.8*h} ${0.5*w} ${0.933 * h} Q ${0.75*w} ${1.07*h} ${w} ${0.933 * h} L ${w} ${h} Z`);
        } else {
            p1.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.933 * h} Q ${-0.75*w} ${0.833*h} ${-w*0.5} ${0.933*h} T 0 ${0.933 * h} Q ${0.25*w} ${0.8*h} ${0.5*w} ${0.933 * h} Q ${0.75*w} ${1.07*h} ${w} ${0.933 * h} L ${w} ${h} Z`);
            p2.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.933 * h} Q ${-0.75*w} ${0.833*h} ${-w*0.5} ${0.933*h} T 0 ${0.933 * h} Q ${0.25*w} ${0.8*h} ${0.5*w} ${0.933 * h} Q ${0.75*w} ${1.07*h} ${w} ${0.933 * h} L ${w} ${h} Z`);
        }
    }

    // svg执行
    toggleSvg() {
        this.setState({
            svgPlay: !this.state.svgPlay,
        });
        const p1 = document.getElementById('path1');
        const p2 = document.getElementById('path2');
        const w = document.getElementById('svg-box').clientWidth;
        const h = document.getElementById('svg-box').clientHeight;
        if(this.state.svgPlay) { // 停止
            p1.classList.remove('water');
            p2.classList.remove('water2');
            p1.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.666 * h} Q ${-0.75 * w} ${0.333*h} ${-0.5*w} ${0.666*h} T 0 ${0.666*h} Q ${0.5*w} ${0.333*h} ${w} ${0.666*h} Q ${w} ${0.666*h} ${w} ${0.666*h} L ${w} ${h} Z`);
        } else {    // 开始
            p1.setAttribute("d", `M ${-w} ${h} L ${-w} ${0.933 * h} Q ${-0.75*w} ${0.833*h} ${-w*0.5} ${0.933*h} T 0 ${0.933 * h} Q ${0.25*w} ${0.8*h} ${0.5*w} ${0.933 * h} Q ${0.75*w} ${1.07*h} ${w} ${0.933 * h} L ${w} ${h} Z`);
            p1.classList.add('water');
            p2.classList.add('water2');
        }
    }

    // 获取当前登录用户的相关信息
    getUserInfo() {
        const u = this.props.userinfo;
        const openId = localStorage.getItem('openId');
        if (!u && openId) {
            this.props.actions.getUserInfo({ openId }).then((res) => {
                if (res.status === 200) {
                    this.getMyAmbassador();
                    this.getMyCustomers();
                }
            });
        }
    }

    // 获得有多少个推广客户
    getMyCustomers() {
        const u = this.props.userinfo;
        if (u) {
            this.props.actions.getMyCustomersCount({ userId: u.id }).then((res) => {
                if (res.status === 200) {
                    this.setState({
                        howManyCustomer: res.data.totalCount,
                    });
                }
            });
        }
    }

    // 获取健康大使信息
    getMyAmbassador() {
        const u = this.props.userinfo;
        console.log('这个时候没有吗？', u);
        if (u) {
            this.props.actions.myAmbassador({ userId: u.id });
        }
    }

    // 健康大使按钮被点击
    onDaShiClick() {
        const u = this.props.userinfo;
        const a = this.props.ambassador;
        if (!u) {
            Toast.info('请先登录', 1);
        } else if (!a) {
            Toast.info('您还没有健康大使', 1);
        } else {
            this.props.history.push('/my/healthyamb');
        }
    }

    // 产品代言被点击
    onDaiYanClick() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }
        this.props.history.push('/my/daiyan');
    }

    // H5宣传卡
    onH5DaiYanClick() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }
        this.props.history.push('/my/daiyanh5');
    }

    // 我的推广客户被点击
    onMyCustomerClick() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }
        if ([5].includes(u.userType)) { // 是企业主账号
            this.props.history.push('/my/primary');
        } else {
            this.props.history.push(`/my/mycustomer/${u.id}/${u.userType}`);
        }

    }
    // 客户订单被点击
    onMyOrderCustomerClick() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }
        this.props.history.push('/my/ordercustomer');
    }
    // 使用帮助被点击
    onHelpClick() {
        const u = this.props.userinfo;
        /**
         * id_nickName_headImg
         * 测试：http://www.huiyuzixun.cn/index.php?m=book&f=browse&t=mhtml&bookID=3&e=${str}
         * 正式：http://e.yimaokeji.com/index.php?m=book&f=browse&t=mhtml&nodeID=385${str}
         *
         * **/
        let str = '';
        if (u && u.id) {  // 有用户信息
            str = `&e=${u.id}`;
        }
        window.open(`http://e.yimaokeji.com/index.php?m=book&f=browse&t=mhtml&nodeID=385${str}`);
    }

    // 点击绑定经销商按钮
    onBindDealear() {
        const u = this.props.userinfo;
        if (!u){
            Toast.info('请先登录',1);
            this.props.history.replace('/login');
            return false;
        }
        if (u.disUser && [0,1,2,5,6].indexOf(u.userType) >= 0){ // 已绑定经销商
            Toast.info('您已是经销商用户', 1);
        } else {    // 不是经销商就跳转到经销商绑定页
            this.props.history.push('/my/binddealer');
        }
    }

    // 点击绑定手机号
    onBindPhone() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录',1);
            this.props.history.replace('/login');
            return false;
        } else if (u.mobile) {
            Toast.info('已绑定过手机号',1);
            return false;
        }
        this.props.history.push('/my/bindphone');
    }

    // 点击收货地址
    onAddrClick() {
        this.props.history.push('/my/addr/1'); // 1表示是普通的收货地址管理，2表示是从商品进入的选择收货地址
    }

    render() {
        const u = this.props.userinfo;
        return (
            <div className={this.state.show ? 'my-main show' : 'my-main'}>
                <div className="head-box">
                    <div className="pic-box">
                        <div id="svg-box" className="svg-box"  onClick={() => this.toggleSvg()}>
                            <svg className="svg1" width="100%" height="100%" style={this.state.svgPlay ? { backgroundColor: '#0D3B81' } : null}>
                                <path id="path2" className="path2" fill="#fff" />
                                <path id="path1" className="path1" fill="#fff" />
                            </svg>
                        </div>
                        <div className="pic" onClick={() => this.props.history.push(u ? '/my/userinfo' : '/login')}>
                            <img src={u && u.headImg ? u.headImg : ImgBar1} />
                        </div>
                        <div className="name" style={this.state.svgPlay ? { color: '#fff' } : null}>{(u && u.nickName) ? u.nickName : '未设置昵称'}</div>
                        <div className="e-num" style={this.state.svgPlay ? { color: '#fff' } : null}>e家号：{ u ? u.id : '-' }</div>
                    </div>
                    <div className="info-box">
                        <div className="one" onClick={() => this.onBindDealear()}>
                            <img src={IconUser} />
                            <div className="t">绑定经销商账户</div>
                            <div className="i">{(u && u.disUser) ? u.userName : ''}</div>
                            <WaterWave color="#cccccc" press="down"/>
                        </div>
                        <div className="one" onClick={() => this.onBindPhone()}>
                            <img src={IconPhone} />
                            <div className="t">绑定手机号</div>
                            <div className="i">{u ? u.mobile : ''}</div>
                            <WaterWave color="#cccccc" press="down"/>
                        </div>
                        <div className="one" onClick={() => this.onAddrClick()}>
                            <img src={IconAddr} />
                            <div className="t">收货地址</div>
                            <div className="i" />
                            <WaterWave color="#cccccc" press="down"/>
                        </div>
                    </div>
                </div>
                <div className="bar" onClick={() => this.props.history.push(u ? '/my/order' : '/login')}>
                    <div className="title">我的订单</div>
                    <div className="arrow"><img src={ImgRight} /></div>
                    <WaterWave color="#cccccc" press="down"/>
                </div>
                <div className="bar-box-dd" onClick={() => this.props.history.push(u ? '/my/order' : '/login')}>
                    <div>
                        <img src={IconAll} />
                        <div>全部</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div>
                        <img src={IconWaitPay} />
                        <div>待付款</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div>
                        <img src={IconWaitSend} />
                        <div>待发货</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div>
                        <img src={IconWaitGet} />
                        <div>待收货</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div>
                        <img src={IconDown} />
                        <div>已完成</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                </div>
                <div className="bar">
                    <div className="title">翼猫圈</div>
                    <WaterWave color="#cccccc" press="down"/>
                </div>
                <div className="bar-box-ymq">
                    <div onClick={() => this.props.history.push(u ? '/my/atcat' : '/login')}>
                        <img src={IconWzym} />
                        <div>我在翼猫</div>
                        <div>{u ? tools.getNameByUserType(u.userType) : ''}</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.onDaShiClick()}>
                        <img src={IconJkds} />
                        <div>健康大使</div>
                        <div>{this.props.ambassador ? (this.props.ambassador.nickName || this.props.ambassador.realName) : ''}</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.onMyCustomerClick()}>
                        <img src={IconWdkh} />
                        <div>我的客户</div>
                        <div>{this.state.howManyCustomer}</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.onMyOrderCustomerClick()}>
                        <img src={IconWdkhdd} />
                        <div>我的客户订单</div>
                        <div>{this.state.howManyCustomer}</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.props.history.push(u ? '/profit' : '/login')}>
                        <img src={IconSy} />
                        <div>收益管理</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.props.history.push(u ? '/my/myfavcards' : '/login')}>
                        <img src={IconWdhk} />
                        <div>我的优惠卡</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.onDaiYanClick()}>
                        <img src={IconWddyk} />
                        <div>我的代言卡</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.onH5DaiYanClick()}>
                        <img src={IconWdh5xck} />
                        <div>我的h5宣传卡</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div>
                        <img src={IconWdsc} />
                        <div>我的收藏</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => window.open('http://e.yimaokeji.com/index.php?m=book&f=read&t=mhtml&articleID=464&e=')}>
                        <img src={IconYhxy} />
                        <div>用户协议</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => window.open('http://e.yimaokeji.com/index.php?m=book&f=read&t=mhtml&articleID=463&e=')}>
                        <img src={IconYsxy} />
                        <div>隐私协议</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                    <div onClick={() => this.onHelpClick()}>
                        <img src={IconBz} />
                        <div>帮助</div>
                        <WaterWave color="#cccccc" press="down"/>
                    </div>
                </div>
            </div>
        );
    }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    userinfo: P.any,
    ambassador: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        userinfo: state.app.userinfo,
        ambassador: state.app.ambassador,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ getUserInfo, myAmbassador, getMyCustomersCount }, dispatch),
    })
)(HomePageContainer);
