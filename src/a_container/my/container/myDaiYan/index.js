/* 我的代言卡 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button } from 'antd-mobile';
import Img from '../../../../assets/daiyanka.jpg';
import ImgShareArr from '../../../../assets/share-arr.png';
// ==================
// 本页面所需action
// ==================

import { getVerifyCode, checkMobile, register } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shareShow: false,   // 分享提示框是否显示
        };
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className="flex-auto page-box page-daiyanka" style={{ minHeight: '100vh' }}>
                <img className="img" src={Img} />
                <div className="thefooter">
                    <Button type="primary" onClick={() => this.setState({ shareShow: true })}>分享我的代言卡</Button>
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
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ getVerifyCode, checkMobile, register }, dispatch),
    })
)(Register);
