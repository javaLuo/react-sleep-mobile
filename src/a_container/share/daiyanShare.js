/* 我的代言卡 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../util/all';

import './daiyanShare.scss';
// ==================
// 所需的所有组件
// ==================

import Img from '../../assets/share/daiyanka.png';
import ImgYaoQinKa from '../../assets/share/yaoqinka@3x.png';
import ImgQrCode from '../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
import ImgZhiWen from '../../assets/share/zhiwen@3x.png';
// ==================
// 本页面所需action
// ==================

import { shareBuild } from '../../a_action/app-action';

// ==================
// Definition
// ==================

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgCode: '',
            data: {},
        };
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        document.title = '我的代言卡分享';
        this.getCode();
    }

    // 获取二维码图片
    getCode() {
        const pathname = this.props.location.pathname.split('/');
        const temp = pathname[pathname.length - 1].split('_');

        /**
         * userid - 用户ID
         * name - 名字
         * head - 头像
         * **/
        this.setState({
            data: {
                userid: temp[0],
                name: temp[1],
                head: temp[2],
            }
        });
        this.props.actions.shareBuild({ userId: temp[0], shareType: 0 }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    imgCode: res.data,
                });
            }
        });
    }

    render() {
        const d = this.state.data;
        return (
            <div className="flex-auto page-box page-daiyankashare" style={{ minHeight: '100vh' }}>
                <div className="title-box">
                    <img src={ImgYaoQinKa}/>
                </div>
                <div className="body-box">
                    <div className="head-box">
                        <div className="pic"><img src={decodeURIComponent(d.head)} /></div>
                        <div className="name">{d.name || '-'}</div>
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
                                <img className="head" src={decodeURIComponent(d.head)} />
                            </div>
                            <div>
                                <img src={ImgZhiWen} />
                            </div>
                        </div>
                    </div>
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
        actions: bindActionCreators({ shareBuild }, dispatch),
    })
)(Register);
