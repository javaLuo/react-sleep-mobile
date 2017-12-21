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
import { List } from 'antd-mobile';
import ImgDefault from '../../../../assets/default-head.jpg';

// ==================
// 本页面所需action
// ==================

import { } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================

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
        const u = this.props.userinfo;
        return (
            <div className="flex-auto page-box page-amb" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                    <div className="login-box">
                        <div  className="logo"><img src={u.headImg || ImgDefault} /></div>
                        <div className="logo-info">{ u.nickName || u.userName }</div>
                        <List className="this-list">
                            <Item extra={u.id || ''}>e家号</Item>
                            <Item extra={<a href={`tel:${u.mobile || ''}`} target="_blank">{u.mobile}</a>}>手机号</Item>
                            <Item extra={''} arrow="horizontal">体验店</Item>
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
        actions: bindActionCreators({ }, dispatch),
    })
)(Register);
