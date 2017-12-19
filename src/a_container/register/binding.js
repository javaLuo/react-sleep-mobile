/* 绑定手机号页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../util/all';
import './binding.scss';
// ==================
// 所需的所有组件
// ==================
import { Checkbox, Modal, Button, Toast, List, InputItem } from 'antd-mobile';
import ImgLogo from '../../assets/dunpai@3x.png';

// ==================
// 本页面所需action
// ==================

import { getVerifyCode, checkMobile, register } from '../../a_action/app-action';

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
            password: '', // 表单password
            modalCodeShow: false,   // 验证码Modal是否显示
            myVcode: '',    // 后台传来的验证码信息
        };
        this.timer = null;  // 获取验证码的tiemr
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // 协议checkbox被点击
    onFormChecked(e) {
        setTimeout(() => {
            this.setState({
                formChecked: e.target.checked,
            });
        }, 16);
    }

    // 协议被点击，模态框出现
    onModalShow() {
        this.setState({
            modalShow: true,
        });
    }

    // 协议模态框关闭
    onModalClose() {
        this.setState({
            modalShow: false,
        });
    };

    // 验证码模态框关闭
    onModalCodeClose() {
        this.setState({
            modalCodeShow: false,
        });
    }

    // 表单phone输入时
    onPhoneInput(e) {
        const v = tools.trim(e.target.value);
        if (v.length <= 11) {
            this.setState({
                phone: v,
            });
        }
    }

    // 表单vcode输入时
    onVcodeInput(e) {
        const v = tools.trim(e.target.value);
        if (v.length <= 6) {
            this.setState({
                vcode: v,
            });
        }
    }

    // 表单password
    onPasswordInput(e) {
        const v = tools.trim(e.target.value);
        if (v.length <= 20) {
            this.setState({
                password: v,
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
        this.submiting().then((res) => {
            if (res) {
                Toast.success('绑定成功', 1);
                this.props.history.go(-1);
            }
        });
    }

    async submiting() {
        Toast.fail('缺少接口');
        return false;
        // const res1 = await this.props.actions.checkMobile({ mobile: this.state.phone });
        // console.log('第1阶段返回：', res1);
        // if (res1.status === 200) {
        //     if (!res1.data.register) {
        //         const params = {
        //             mobile: this.state.phone,
        //             password: this.state.password,
        //             countryCode: '86',
        //             verifyCode: this.state.vcode,
        //             loginIp: '',
        //         };
        //         const res2 = await this.props.actions.register(params);
        //         if (res2.status === 200) {
        //             return true;
        //         } else {
        //             Toast.fail(res2.message || '注册失败');
        //             return false;
        //         }
        //     } else {
        //         Toast.fail('该手机已注册');
        //         return false;
        //     }
        // } else {
        //     Toast.fail(res1.message || '手机校验失败');
        //     return false;
        // }
    }

    render() {
        return (
            <div className="flex-auto page-box page-binding" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                {/*<div className="login-box">*/}
                    {/*<div className="input-box">*/}
                        {/*<div className="t">*/}
                            {/*<img src={ImgPhone} />*/}
                            {/*<span>+86</span>*/}
                        {/*</div>*/}
                        {/*<div className="line" />*/}
                        {/*<div className="i">*/}
                            {/*<input*/}
                                {/*placeholder="请输入手机号码"*/}
                                {/*type="tel"*/}
                                {/*value={this.state.phone}*/}
                                {/*onInput={(e) => this.onPhoneInput(e)}*/}
                            {/*/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="input-box">*/}
                        {/*<div className="t">*/}
                            {/*<img src={ImgYZ} />*/}
                        {/*</div>*/}
                        {/*<div className="line2" />*/}
                        {/*<div className="i">*/}
                            {/*<input*/}
                                {/*placeholder="请输入您的验证码"*/}
                                {/*type="text"*/}
                                {/*pattern="[0-9]*"*/}
                                {/*value={this.state.vcode}*/}
                                {/*onInput={(e) => this.onVcodeInput(e)}*/}
                            {/*/>*/}
                        {/*</div>*/}
                        {/*<div className="btn-box">*/}
                            {/*<Button*/}
                                {/*type="primary"*/}
                                {/*disabled={this.state.verifyCode || !tools.checkPhone(this.state.phone)}*/}
                                {/*className="btn"*/}
                                {/*onClick={() => this.getVerifyCode()}*/}
                            {/*>*/}
                                {/*{this.state.verifyCodeInfo}*/}
                            {/*</Button>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<button className="this-btn binding-submit all_trans" onClick={() => this.onSubmit()}>确认</button>*/}
                {/*</div>*/}
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
                                    onInput={(e) => this.onPhoneInput(e)}
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
                                    onInput={(e) => this.onVcodeInput(e)}
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
