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
import ImgCyan from '../../../../assets/share/y_cyan.png';
import ImgGreen from '../../../../assets/share/y_green.png';
import ImgBlue from '../../../../assets/share/y_blue.png';
import ImgOrange from '../../../../assets/share/y_orange.png';

import ImgLCyan from '../../../../assets/share/l_cyan.png';
import ImgLGreen from '../../../../assets/share/l_green.png';
import ImgLBlue from '../../../../assets/share/l_blue.png';
import ImgLOrange from '../../../../assets/share/l_orange.png';

import ImgShareArr from '../../../../assets/share-arr.png';
import ImgQrCode from '../../../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
import ImgZhiWen from '../../../../assets/share/zhiwen@3x.png';
// ==================
// 本页面所需action
// ==================

import { wxInit, getShareInfo } from '../../../../a_action/shop-action';
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
            d1: {},   // 数据1 分享所需
            type: null,     // 当前数据的ID，用于查询当前对应的图片什么的
            type2: null,    // 当前是什么类型的代言卡1水，2养未来，3冷敷贴，5体检卡 ，用于显示不同的颜色
        };
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        document.title = '我的代言卡';
        const t = this.getType();
        if (t) {
            this.initAll(t.type, t.type2);
        }
        this.getCode();
    }

    // 获取当前是哪种类型的代言卡
    getType() {
        const pathname = this.props.location.pathname.split('/');
        const t = pathname[pathname.length - 1].split('_');
        this.setState({
            type: t[0] || null,
            type2: t[1] || null,
        });
        return {type: t[0], type2: t[1]} || null;
    }

    initAll(t, t2) {
        Promise.all([
            this.props.actions.getShareInfo({ speakCardId: t }),
            this.props.actions.wxInit()
        ]).then((res) => {
            if (res[0].status === 200 && res[0].data && res[1].status === 200) {
                this.setState({
                    d1: res[0].data,
                });
                this.initWxConfig(res[0].data, res[1].data, t, t2);
            }
        }).catch(() => {
            Toast.fail('初始化分享失败', 1);
        });
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

    // 初始化微信JS-SDK
    initWxConfig(d1, d2, t, t2) {
        const me = this;
        if(typeof wx === 'undefined') {
            console.log('weixin sdk load failed!');
            this.onFail();
            return false;
        }
        console.log('到这里了', d1, d2);
        wx.config({
            debug: false,
            appId: Config.appId,
            timestamp: d2.timestamp,
            nonceStr: d2.noncestr,
            signature: d2.signature,
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
             * t - 当前数据ID
             * t2 - 当前数据类型ID
             * **/
            const u = this.props.userinfo;
            const str = `${u.id}_${encodeURIComponent(u.nickName)}_${encodeURIComponent(u.headImg)}_${t}_${t2}`;
            wx.onMenuShareAppMessage({
                title: `${u.nickName}${d1.title}`,
                desc: d1.content,
                link: `${Config.baseURL}/gzh/?#/daiyanshare/${str}`,
                imgUrl: d1.titleImage,
                type: 'link',
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });

            wx.onMenuShareTimeline({
                title: `${u.nickName}${d1.title}`,
                desc: d1.content,
                link: `${Config.baseURL}/gzh/?#/daiyanshare/${str}`,
                imgUrl: d1.titleImage,
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

    // 选LOGO
    choseLogo(type) {
        switch(Number(type)){
            case 1: return ImgLBlue;   // 水机
            case 2: return ImgLGreen;   // 养未来
            case 3: return ImgLOrange;   // 冷敷贴
            case 5: return ImgLCyan;   // 体检卡
            default: return ImgLCyan;
        }
    }

    // 选标题
    choseTitle(type) {
        switch(Number(type)){
            case 1: return ImgBlue;   // 水机
            case 2: return ImgGreen;   // 养未来
            case 3: return ImgOrange;   // 冷敷贴
            case 5: return ImgCyan;   // 体检卡
            default: return ImgCyan;
        }
    }

    // 选颜色
    choseColor(type) {
        switch(Number(type)){
            case 1: return '#0074FF';   // 水机
            case 2: return '#00CD0C';   // 养未来
            case 3: return '#FF9500';   // 冷敷贴
            case 5: return '#00C8CC';   // 体检卡
            default: return '#00C8CC';
        }
    }

    render() {
        const u = this.props.userinfo || {};
        const d1 = this.state.d1;
        console.log('d1是什么：', d1, this.state.type);
        return (
            <div className="flex-auto page-box page-daiyanka" style={{ minHeight: '100vh', backgroundImage: d1.backImage }}>
                <img className="logo" src={this.choseLogo(this.state.type2)} />
                <div className="title-box">
                    <img src={this.choseTitle(this.state.type2)}/>
                </div>
                <div className="body-box">
                    <div className="head-box">
                        <div className="pic"><img src={u.headImg} /></div>
                        <div className="name">{u.nickName || '-'}</div>
                        <div className="name-info">{d1.title || ' '}</div>
                    </div>
                    <div className="img-box">
                        {
                            d1.contentImage ? (
                                <img className="img" src={d1.contentImage}/>
                            ) : null
                        }

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
                    <Button type="primary"  style={{ backgroundColor: this.choseColor(this.state.type2) }} onClick={(e) => this.onStartShare(e)}>分享我的代言卡</Button>
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
        actions: bindActionCreators({ wxInit, shareBuild, getShareInfo }, dispatch),
    })
)(Register);
