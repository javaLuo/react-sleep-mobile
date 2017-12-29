/* 绑定经销商账号页 */

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
import { Button, Toast, List, InputItem } from 'antd-mobile';
import ImgLogo from '../../../../assets/dunpai@3x.png';

// ==================
// 本页面所需action
// ==================

import { bindDistributor } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // 是否正在异步请求
            userName: '',  // 表单username
            password: '', // 表单password
        };

    }

    componentWillUnmount() {

    }

    componentDidMount() {
        document.title = '绑定经销商账户';
    }
    // 表单phone输入时
    onUserNameInput(e) {
        const v = tools.trim(e);
        if (v.length <= 20) {
            this.setState({
                userName: v,
            });
        }
    }

    // 表单password
    onPasswordInput(e) {
        const v = tools.trim(e);
        if (v.length <= 20) {
            this.setState({
                password: v,
            });
        }
    }

    // 提交
    onSubmit() {
        if(!this.state.userName){
            Toast.fail('账号不能为空', 1);
            return;
        }
        if(!this.state.password){
            Toast.fail('密码不能为空', 1);
            return;
        }
        const u = this.props.userinfo;
        if (u && [0,1,2].indexOf(u.userType)>=0) {
            Toast.info('您已绑定过经销商账号', 1);
            return;
        }

        this.setState({
            loading: true,
        });

        const params = {
            userId: u.id,
            loginName: this.state.userName,
            password: this.state.password,
        };
        this.props.actions.bindDistributor(params).then((res) => {
            if(res.status === 200) {
                Toast.success('绑定成功',1);
                setTimeout(() => {
                    this.props.history.go(-1);
                });
            } else {
                Toast.fail('绑定失败',1);
            }
            this.setState({
                loading: false,
            });
        }).catch(() => {
            Toast.fail('绑定失败',1);
            this.setState({
                loading: false,
            });
        });
    }

    render() {
        return (
            <div className="flex-auto page-box page-binding" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                <div className="login-box">
                    <img className="logo" src={ImgLogo} />
                    <div className="logo-info">
                        绑定后,您可以通过经销商账号登录健康e家<br/>行使您的产品经销权,通过分享为您锁定客户
                    </div>
                    <div className="input-box">
                        <List className="this-list">
                            <InputItem
                                clear
                                placeholder="请输入您的经销商管理app账号"
                                maxLength={20}
                                value={this.state.userName}
                                onChange={(e) => this.onUserNameInput(e)}
                            />
                            <InputItem
                                clear
                                placeholder="请输入您的密码"
                                type="password"
                                maxLength={20}
                                value={this.state.password}
                                onChange={(e) => this.onPasswordInput(e)}
                            />
                        </List>
                    </div>
                    <Button
                        type="primary"
                        className="this-btn"
                        disabled={this.state.loading}
                        onClick={() => this.onSubmit()}
                    >立即绑定</Button>
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
        actions: bindActionCreators({ bindDistributor }, dispatch),
    })
)(Register);
