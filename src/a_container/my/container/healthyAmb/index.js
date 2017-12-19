/* 健康大使 */

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
import { Checkbox, Modal, Button, Toast, List, InputItem } from 'antd-mobile';
import ImgLogo from '../../../../assets/dunpai@3x.png';

// ==================
// 本页面所需action
// ==================

import { getVerifyCode, checkMobile, register } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================
const AgreeItem = Checkbox.AgreeItem;
const operation = Modal.operation;
const Item = List.Item;
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <div className="flex-auto page-box page-amb" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                    <div className="login-box">
                        <div  className="logo"><img src={ImgLogo} /></div>
                        <div className="logo-info">username</div>
                        <List className="this-list">
                            <Item extra={'what?什么是e家号'}>e家号</Item>
                            <Item extra={<a href={`tel:13900000000`} target="_blank">13900000000</a>}>手机号</Item>
                            <Item extra={'上海市嘉定区翼猫体验中心'} arrow="horizontal">体验店</Item>
                        </List>
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
