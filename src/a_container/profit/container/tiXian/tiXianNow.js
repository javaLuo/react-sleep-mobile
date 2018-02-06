/* 设置密码页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import './tiXianNow.scss';
// ==================
// 所需的所有组件
// ==================
import { Checkbox, Modal, Button, Toast, List, InputItem } from 'antd-mobile';
import ImgLogo from '../../../../assets/dunpai@3x.png';

// ==================
// 本页面所需action
// ==================

import { getVerifyCode } from '../../../../a_action/app-action';
import { startTiXian } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
const AgreeItem = Checkbox.AgreeItem;
const operation = Modal.operation;
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vcode: '', // 表单验证码值
            verifyCode: false,   // 获取验证码按钮是否正在冷却
            verifyCodeInfo: '获取验证码', // 获取验证码按钮显示的内容
            myVcode: '',    // 后台传来的验证码信息
            loading: false, // 是否正在submit
        };
        this.timer = null;  // 获取验证码的tiemr
    }

    componentDidMount(){
        document.title = '提现';
    }
    componentWillUnmount() {
        clearInterval(this.timer);
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
        let time = 60;
        if (this.state.verifyCode) {
            return;
        }
        if (!this.props.userinfo) {
            Toast.fail('请先登录', 1);
            return;
        }
        if (!tools.checkPhone(this.props.userinfo.mobile)) {
            Toast.fail('您没有绑定手机号', 1);
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

        me.props.actions.getVerifyCode({ mobile: this.props.userinfo.mobile, countryCode: '86' }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    myVcode: res.data.text,
                });
            } else {
                Toast.fail(res.message || '验证码获取失败',1);
            }
        });
    }

    // 提交
    onSubmit() {
        if (!this.state.vcode) {
            Toast.fail('请填写验证码', 1);
            return;
        }

        const pathname = this.props.location.pathname.split('/');
        const v = Number(pathname[pathname.length - 1]);
        if (!v) {
            Toast.fail('提现金额异常');
            return;
        }

        const params = {
            amount: v,
            verifyCode: this.state.vcode,
            countryCode: 86,
        };
        this.setState({
            loading: true
        });
        this.props.actions.startTiXian(params).then((res) => {
            if (res.status === 200) {
                Toast.success('提现成功', 1);
                this.props.history.replace('/profit'); // 回到收益明细页（因为信息改变了，在这个页才能更新信息）
            } else {
                Toast.fail(res.message || '提现失败',1);
            }
            this.setState({
                loading: false
            });
        }).catch(() => {
            Toast.fail('网络错误，请重试');
            this.setState({
                loading: false
            });
        });
    }

    render() {
        return (
            <div className="flex-auto page-box page-tixiannow" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                <div className="login-box">
                    <div className="logo-info">
                        <span className="small">为了提现安全，将向您绑定的手机号码发送验证码</span><br/>
                        <span>当前绑定手机号：{this.props.userinfo ? this.props.userinfo.mobile : ''}</span>
                    </div>
                    <div className="input-box">
                        <List className="this-list">
                            <InputItem
                                clear
                                placeholder="请输入验证码"
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
                    >确认提现</Button>
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
        actions: bindActionCreators({ getVerifyCode, startTiXian }, dispatch),
    })
)(Register);
