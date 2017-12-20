/* 绑定手机号页 */

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

import { getVerifyCode, getUserInfo, updateUserInfo, bindPhone } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================
const AgreeItem = Checkbox.AgreeItem;
const operation = Modal.operation;
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formChecked: false, // 表单：协议checkbox是否选中
            modalShow: false, // 模态框是否选中
            phone: '', // 表单phone
            vcode: '', // 表单验证码值
            verifyCode: false,   // 获取验证码按钮是否正在冷却
            verifyCodeInfo: '获取验证码', // 获取验证码按钮显示的内容
            modalCodeShow: false,   // 验证码Modal是否显示
            myVcode: '',    // 后台传来的验证码信息
        };
        this.timer = null;  // 获取验证码的tiemr
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // 验证码模态框关闭
    onModalCodeClose() {
        this.setState({
            modalCodeShow: false,
        });
    }

    // 表单phone输入时
    onPhoneInput(e) {
        const v = tools.trim(e);
        if (v.length <= 11) {
            this.setState({
                phone: v,
            });
        }
    }

    // 表单vcode输入时
    onVcodeInput(e) {
        const v = tools.trim(e);
        if (v.length <= 6) {
            this.setState({
                vcode: v,
            });
        }
    }

    // 点击获取验证码按钮
    getVerifyCode() {
        const me = this;
        let time = 30;
        if (this.state.verifyCode) {
            return;
        }
        if (!tools.checkPhone(this.state.phone)) {
            Toast.fail('请输入正确的手机号', 1);
            return;
        }
        me.setState({
            verifyCode: true,
            verifyCodeInfo: `${time}秒后重试`,
        });
        me.timer = setInterval(() => {
            time--;
            me.setState({
                // verifyCodeTimer: time,
                verifyCodeInfo: time > 0 ? `${time}秒后重试` : '获取验证码',
                verifyCode: time > 0,
            });
            if (time <=0) {
                clearInterval(me.timer);
            }
        }, 1000);

        me.props.actions.getVerifyCode({ mobile: this.state.phone, countryCode: '86' }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    modalCodeShow: true,
                    myVcode: res.data.text,
                });
            } else {
                Toast.fail(res.message || '验证码获取失败');
            }
        });
    }

    // 提交
    onSubmit() {
        if(!tools.checkPhone(this.state.phone)){
            Toast.fail('请输入正确的手机号', 1);
            return;
        }
        // 验证码由后台验证
        const u = this.props.userinfo;
        this.props.actions.bindPhone({ userId: String(u.id), mobile: this.state.phone }).then((res) => {
            if(res.status === 200) {
                if (res.data.disUser && [3,4].indexOf(res.data.userType>=0)) { // 是经销商但没有检验过密码
                    this.props.history.replace('/my/checkpwd');
                } else {
                    Toast.success('绑定成功', 1);
                    this.props.history.go(-1);
                }
            } else {
                Toast.fail(res.message || '绑定失败', 1);
            }
        });
    }

    render() {
        return (
            <div className="flex-auto page-box page-binding" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                    <div className="login-box">
                        <img className="logo" src={ImgLogo} />
                        <div className="logo-info">
                            绑定会让您的账号更加安全<br/>绑定后，您还可以通过手机号登录健康e家
                        </div>
                        <div className="input-box">
                            <List className="this-list">
                                <InputItem
                                    clear
                                    placeholder="请输入您的手机号"
                                    maxLength={11}
                                    value={this.state.phone}
                                    onChange={(e) => this.onPhoneInput(e)}
                                />
                                <InputItem
                                    clear
                                    placeholder="输入您的验证码"
                                    maxLength={8}
                                    value={this.state.vcode}
                                    extra={<span
                                        className="btn"
                                        onClick={() => this.getVerifyCode()}
                                    >
                                        {this.state.verifyCodeInfo}
                                    </span>}
                                    onChange={(e) => this.onVcodeInput(e)}
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
                <Modal
                    visible={this.state.modalCodeShow}
                    title="验证码"
                    className="all_modal"
                    transparent
                    closable
                    onClose={()=> this.onModalCodeClose()}
                >
                    <div>
                        <p style={{ padding: "0 15px 15px" }}>{this.state.myVcode}</p>
                        <div className="modal-footer">
                            <div onClick={() => this.onModalCodeClose()}>确定</div>
                        </div>
                    </div>
                </Modal>
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
        actions: bindActionCreators({ getVerifyCode, getUserInfo, updateUserInfo, bindPhone }, dispatch),
    })
)(Register);
