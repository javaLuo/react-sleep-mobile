/* 我的优惠卡 - 详情 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import Config from '../../../../config';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button, Toast } from 'antd-mobile';
import Img from './yhkbj.png';

// ==================
// 本页面所需action
// ==================

import { wxInit, createMcard, wxPay } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wxReady: true,  // 微信SDK是否初始化成功
            loading: false, // 是否正在支付中
        };
        this.s3data = null;
        this.s4data = null;
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        document.title = '我的优惠卡';
    }

    // 获取微信初始化所需参数
    initWeiXinPay() {
        // 后台需要给个接口，返回appID,timestamp,nonceStr,signature
        this.props.actions.wxInit().then((res) => {
            console.log('返回的是什么：', res);
            if (res.status === 200) {
                console.log('走这里：', res);
                this.initWxConfig(res.data);
            } else {
                this.onFail();
            }
        }).catch(() => {
            this.onFail();
        });
    }

    /**
     * 初始化微信JS-SDK
     * 用于微信公众号支付 和 微信H5支付
     * **/
    initWxConfig(data) {
        const me = this;
        console.log('DATA是个啥2', data);
        return new Promise((res, rej) => {
            if(typeof wx === 'undefined') {
                res(false);
            }
            wx.config({
                debug: false,
                appId: Config.appId,
                timestamp: data.timestamp,
                nonceStr: data.noncestr,
                signature: data.signature,
                jsApiList: [
                    'chooseWXPay'
                ]
            });
            wx.ready(() => {
                console.log('微信JS-SDK初始化成功');
                res(true);
            });
            wx.error(() => {    // js-sdk初始化失败
                me.setState({
                    wxReady: false,
                });
            });
        });
    }

    // 微信初始化失败
    onFail() {
        this.setState({
            wxReady: false,
        });
    }

    /**
     * 1.
     * **/
    async startPay() {
        try {
            const s1 = await this.props.actions.wxInit();             // 1. 向后台获取timestamp,nonceStr,signature等微信JS-SDK初始化所需参数
            console.log('第1：获取wxInit：', s1);
            if(s1.status !== 200) { return false; }
            const s2 = await this.initWxConfig(s1.data);              // 2. 初始化js-sdk
            console.log('第2：初始化js-sdk：', s2);
            if (!s2) { return false; }

            const s3 = await this.props.actions.createMcard({         // 3. 创建订单
                userId: this.props.userinfo.id,
                orderFrom: 2,
                ticketNo: this.props.freeCardInfo.ticketNo,
            });
            console.log('第3：创建订单：', s3);
            if(s3.status !== 200) { return false; }
            this.s3data = s3.data;
            const s4 = await this.props.actions.wxPay({               // 4. 向后台发起统一下单请求
                body: 'yimaokeji-card',                                 // 商品描述
                total_fee: Number(s3.data.fee * 100) , // 总价格（分）
                spbill_create_ip: (typeof returnCitySN !== 'undefined') ? returnCitySN["cip"] : '',                     // 用户终端IP，通过腾讯服务拿的
                out_trade_no: s3.data.id ? String(s3.data.id) : `${new Date().getTime()}`,      // 商户订单号，通过后台生成订单接口获取
                code: null,                                             // 授权code, 后台为了拿openid
                trade_type: 'JSAPI',
            });
            console.log('第4：统一下单返回：', s4);
            if(s4.status !== 200) { return false; }
            Toast.hide();
            this.s4data = s4.data;
            return true;
        }catch(e) {
            return false;
        }
    }

    // 开始支付
    onPay() {
        this.setState({
            loading: true
        });
        if (this.s4data) {              // 已经获取过统一下单了，直接调起支付就行 （即用户取消支付、支付失败后，重新点击支付）
            this.onWxPay(this.s4data).then((msg) => {
                this.payResult(msg);
            });
        } else {                        // 没有发起过统一下单，需重头开始，初始化JS-SDK什么的
            this.startPay().then((res) => {
                if (res) {
                    this.onWxPay(this.s4data).then((msg) => {
                        this.payResult(msg);
                    });
                } else {
                    Toast.fail('支付遇到错误，请重试.',1);
                    this.returnPage();
                }
            }).catch(() => {
                Toast.fail('支付遇到错误，请重试..',1);
                this.returnPage();
            });
        }
    }

    /**
     * (公众号支付专用) 真正的调起微信支付原生控件，等待用户操作
     * **/
    onWxPay(data) {
        return new Promise((res, rej) => {
            try{
                wx.chooseWXPay({
                    appId: Config.appId,
                    timestamp: data.timeStamp || data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr || data.noncestr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: data.signType || data.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign || data.paysign,  // 支付签名
                    success: (msg) => {
                        console.log('支付流程完结：', msg);
                        res(msg);
                    },
                    cancel: (msg) => {
                        console.log('支付流程取消：', msg);
                        res(msg);
                    },
                    error:(msg) => {
                        console.log('支付流程错误：', msg);
                        res(msg);
                    }
                });
            } catch(err) {
                rej(err);
            }
        });
    }

    // 支付结果处理
    payResult(msg) {
        if (!msg) {
            Toast.fail('支付失败, 请重试',1);
            this.returnPage();
        } else if (msg.errMsg === 'chooseWXPay:ok') {     // 支付成功
            // 支付成功后在后台添加对应数量的体检卡 (现在由后台自动生成)
            // this.makeCards();
            Toast.success('支付成功',1);
            this.successReturn();
        } else if (msg.errMsg === 'chooseWXPay:cancel'){
            // 支付被取消
            this.returnPage();
        } else {  // 支付遇到错误
            Toast.fail('支付失败, 请重试',1);
            this.returnPage();
        }
    }

    /**
     * 支付失败或出错时，自动离开此页
     * **/
    returnPage() {
        this.props.history.replace('/my/myfavcards');
    }

    /**
     * 支付成功时，跳转到成功页
     * **/
    successReturn() {
        /**
         * 支付流程完成，跳转到结果页
         * 参数1：成功后生成的卡片信息，现在由后台生成，获取不到
         * 参数2：当前的订单信息
         * **/
        this.props.history.replace('/my/myfavcards');
        // this.props.actions.payResultNeed({}, this.s3data);
        // setTimeout(() => this.props.history.replace('/shop/payresult'), 16);
    }

    render() {
        const d = this.props.freeCardInfo || {};
        return (
            <div className="flex-auto page-box page-favcard-detail" style={{ minHeight: '100vh' }}>
                <div className="img-box">
                    <img className="img" src={Img} />
                </div>
                <div className="fav-info">{(d.ticketType === 'M' && d.ticketStatus === 3) ? '仅需支付50元材料费，即可使用该卡' : ''}</div>
                <div className="footer-zw"/>
                {
                    (d.ticketType === 'M' && d.ticketStatus === 3) ? (
                        <div className="thefooter">
                            <Button type="primary" loading={this.state.loading} onClick={() => this.onPay()}>微信支付</Button>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

// ==================
// PropTypes
// ==================

Register.propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    userinfo: P.any,
    freeCardInfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        userinfo: state.app.userinfo,
        freeCardInfo: state.shop.freeCardInfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ wxInit, createMcard, wxPay }, dispatch),
    })
)(Register);
