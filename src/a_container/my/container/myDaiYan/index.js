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
import Img from '../../../../assets/share/daiyanka.png';
import ImgYaoQinKa from '../../../../assets/share/yaoqinka@3x.png';
import ImgShareArr from '../../../../assets/share-arr.png';
import ImgQrCode from '../../../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
import ImgZhiWen from '../../../../assets/share/zhiwen@3x.png';
// ==================
// 本页面所需action
// ==================

import { wxInit } from '../../../../a_action/shop-action';
import { shareBuild } from '../../../../a_action/app-action';
// ==================
// Definition
// ==================

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shareShow: false,   // 分享提示框是否显示
            wxReady: true,  // 微信SDK是否初始化成功
            imgCode: '',    // 二维码图片
        };
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        document.title = '我的代言卡';
        this.initWeiXinPay();
        this.getCode();
    }

    // 获取二维码图片
    getCode() {
        const u = this.props.userinfo;
        if (!u) {
            return;
        }
        this.props.actions.shareBuild({ userId: Number(u.id) }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    imgCode: res.data.qrcode,
                });
            }
        });
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
                'onMenuShareQQ',            // 分享到QQ
            ]
        });
        wx.ready(() => {
            console.log('微信JS-SDK初始化成功');
            /**
             * 拼接数据
             * userid - 用户ID
             * name - 名字
             * head - 头像
             * **/
            const u = this.props.userinfo;
            const str = `${u.id}_${encodeURIComponent(u.nickName)}_${encodeURIComponent(u.headImg)}`;
            wx.onMenuShareAppMessage({
                title: `${u.nickName}为翼猫HRA健康风险评估系统代言`,
                desc: '专注疾病早期筛查，5分钟给出人体9大系统220项指标，临床准确率96%',
                link: `${Config.baseURL}/gzh/?#/daiyanshare/${str}`,
                imgUrl: 'http://isluo.com/work/logo/share_daiyan.png',
                type: 'link',
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });

            wx.onMenuShareTimeline({
                title: `${u.nickName}为翼猫HRA健康风险评估系统代言`,
                desc: '专注疾病早期筛查，5分钟给出人体9大系统220项指标，临床准确率96%',
                link: `${Config.baseURL}/gzh/?#/daiyanshare/${str}`,
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
        const u = this.props.userinfo || {};
        return (
            <div className="flex-auto page-box page-daiyanka" style={{ minHeight: '100vh' }}>
                <div className="title-box">
                    <img src={ImgYaoQinKa}/>
                </div>
                <div className="body-box">
                    <div className="head-box">
                        <div className="pic"><img src={u.headImg} /></div>
                        <div className="name">{u.nickName || '-'}</div>
                        <div className="name-info">为翼猫HRA健康风险评估系统代言</div>
                    </div>
                    <div className="img-box">
                        <img className="img" src={Img}/>
                    </div>
                    <div className="code-box">
                        <div className="t">长按识别二维码接受邀请</div>
                        <div className="codes page-flex-row flex-jc-center">
                            <div>
                                <img src={this.state.imgCode || ImgQrCode}/>
                                <img className="head" src={u.headImg} />
                            </div>
                            <div>
                                <img src={ImgZhiWen} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-zw"/>
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
        actions: bindActionCreators({ wxInit, shareBuild }, dispatch),
    })
)(Register);
