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
import { Button } from 'antd-mobile';
import Img from '../../assets/daiyanka.jpg';
import ImgQrCode from '../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
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
        };
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        this.getCode();
    }

    // 获取二维码图片
    getCode() {
        const pathname = this.props.location.pathname.split('/');
        const userId = pathname[pathname.length - 1];
        this.props.actions.shareBuild({ userId }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    imgCode: res.data,
                });
            }
        });
    }

    render() {
        return (
            <div className="flex-auto page-box page-daiyanshare" style={{ minHeight: '100vh' }}>
                <div className="img-box">
                    <img className="img" src={Img} />
                    <img className="code" src={this.state.imgCode || ImgQrCode}/>
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
