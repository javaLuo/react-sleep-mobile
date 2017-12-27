/* 我的代言卡 */

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
import Img from '../../../../assets/daiyanka.jpg';
import ImgShareArr from '../../../../assets/share-arr.png';
import ImgQrCode from '../../../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
// ==================
// 本页面所需action
// ==================

import { wxInit } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shareShow: false,   // 分享提示框是否显示
            wxReady: true,  // 微信SDK是否初始化成功
        };
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        this.initWeiXinPay();
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

    // 初始化微信JS-SDK
    initWxConfig(data) {
        const me = this;
        if(typeof wx === 'undefined') {
            console.log('weixin sdk load failed!');
            this.onFail();
            return false;
        }
        console.log('到这里了', data);
        wx.config({
            debug: false,
            appId: Config.appId,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',      // 分享到朋友圈
                'onMenuShareAppMessage',    // 分享给微信好友
                'onMenuShareQQ',             // 分享到QQ
            ]
        });
        wx.ready(() => {
            console.log('微信JS-SDK初始化成功');
            wx.onMenuShareAppMessage({
                title: 'HRA健康风险评估',
                desc: '专注疾病早期筛查，5分钟给出人体9大系统220项指标，临床准确率96%',
                link: `${Config.baseURL}/gzh/#/daiyanshare/${this.props.userinfo.id}_${encodeURIComponent(this.props.userinfo.headImg)}`,
                imgUrl: 'http://isluo.com/work/logo/share_daiyan.png',
                type: 'link',
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });

            wx.onMenuShareTimeline({
                title: 'HRA健康风险评估',
                desc: '专注疾病早期筛查，5分钟给出人体9大系统220项指标，临床准确率96%',
                link: `${Config.baseURL}/gzh/#/daiyanshare/${this.props.userinfo.id}_${encodeURIComponent(this.props.userinfo.headImg)}`,
                imgUrl: 'http://isluo.com/work/logo/share_daiyan.png',
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });
        });
        wx.error((e) => {
            console.log('微信JS-SDK初始化失败：', e);
            this.onFail();
        });
    }

    // 点击分享按钮，需判断是否是原生系统
    onStartShare(e) {
        e.stopPropagation();
            this.setState({
                shareShow: true,
            });
    }

    // 微信初始化失败
    onFail() {
        this.setState({
            wxReady: false,
        });
    }

    render() {
        return (
            <div className="flex-auto page-box page-daiyanka" style={{ minHeight: '100vh' }}>
                <div className="img-box">
                    <img className="img" src={Img} />
                    <img className="code" src={ImgQrCode}/>
                </div>
                <div className="thefooter">
                    <Button type="primary" onClick={(e) => this.onStartShare(e)}>分享我的代言卡</Button>
                </div>
                <div className={this.state.shareShow ? 'share-modal' : 'share-modal hide'} onClick={() => this.setState({ shareShow: false })}>
                    <img className="share" src={ImgShareArr} />
                    <div className="title">点击右上角进行分享</div>
                </div>
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
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        userinfo: state.app.userinfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ wxInit }, dispatch),
    })
)(Register);
