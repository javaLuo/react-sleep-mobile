/* 注册页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Checkbox, Modal, Button, Toast } from 'antd-mobile';
import ImgPhone from '../../assets/phone@3x.png';
import ImgMima from '../../assets/mima@3x.png';
import ImgYZ from './assets/yanzheng@3x.png';
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
          Toast.fail('请输入正确的手机号', 1.2);
          return;
      } else if (!this.state.password || this.state.password.length < 6) {
          Toast.fail('请输入6位以上的密码', 1.2);
          return;
      } else if (!this.state.formChecked) {
          Toast.fail('请勾选翼猫服务条款', 1.2);
          return;
      }
      this.submiting().then((res) => {
          if (res) {
              Toast.success('注册成功', 1.2);
              this.props.history.push('/login');
          }
      });
   }

   async submiting() {
      const res1 = await this.props.actions.checkMobile({ mobile: this.state.phone });
      console.log('第1阶段返回：', res1);
      if (res1.status === 200) {
          if (!res1.data.register) {
              const params = {
                  mobile: this.state.phone,
                  password: this.state.password,
                  countryCode: '86',
                  verifyCode: this.state.vcode,
                  loginIp: returnCitySN["cip"] || '',
              };
              const res2 = await this.props.actions.register(params);
              if (res2.status === 200) {
                  return true;
              } else {
                  Toast.fail(res2.message || '注册失败');
                  return false;
              }
          } else {
              Toast.fail('该手机已注册');
              return false;
          }
      } else {
          Toast.fail(res1.message || '手机校验失败');
          return false;
      }
   }

  render() {
    return (
      <div className="flex-auto page-box page-register">
        <div className="login-box">
          <div className="input-box">
            <div className="t">
              <img src={ImgPhone} />
              <span>+86</span>
            </div>
            <div className="line" />
            <div className="i">
                <input
                    placeholder="请输入手机号码"
                    type="tel"
                    value={this.state.phone}
                    onInput={(e) => this.onPhoneInput(e)}
                />
            </div>
          </div>
          <div className="input-box">
            <div className="t">
              <img src={ImgYZ} />
            </div>
            <div className="line2" />
            <div className="i">
                <input
                    placeholder="请输入您的验证码"
                    type="text"
                    pattern="[0-9]*"
                    value={this.state.vcode}
                    onInput={(e) => this.onVcodeInput(e)}
                />
            </div>
            <div className="btn-box">
              <Button
                  type="primary"
                  disabled={this.state.verifyCode || !tools.checkPhone(this.state.phone)}
                  className="btn"
                  onClick={() => this.getVerifyCode()}
              >
                  {this.state.verifyCodeInfo}
              </Button>
            </div>
          </div>
          <div className="input-box">
            <div className="t">
              <img src={ImgMima} />
            </div>
            <div className="line2" />
            <div className="i">
                <input
                    placeholder="请输入您的密码"
                    type="password"
                    maxLength="20"
                    value={this.state.password}
                    onInput={(e) => this.onPasswordInput(e)}
                />
            </div>
          </div>
          <div className="input-box2">
            <AgreeItem className="agree-item" checked={this.state.formChecked} onChange={(e) => this.onFormChecked(e)}>我已阅读并接受
              <a href="javascript:void(0)" onClick={() => this.onModalShow()}>《翼猫科技服务条款》</a>
            </AgreeItem>
          </div>
          <button className="this-btn all_trans" onClick={() => this.onSubmit()}>确认</button>
        </div>
        <Modal
          visible={this.state.modalShow}
          title="服务条款"
          className="all_modal"
          transparent
          closable
          onClose={()=> this.onModalClose()}
        >
          <div>
            <p style={{ padding: "0 15px 15px" }}>协议协协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议议</p>
              <div className="modal-footer">
                  <div onClick={() => this.onModalClose()}>确定</div>
              </div>
          </div>
        </Modal>
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
