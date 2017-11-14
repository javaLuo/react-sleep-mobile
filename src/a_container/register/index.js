/* 注册页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Checkbox, Modal } from 'antd-mobile';
import ImgPhone from '../../assets/phone@3x.png';
import ImgMima from '../../assets/mima@3x.png';
import ImgYZ from './assets/yanzheng@3x.png';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
const AgreeItem = Checkbox.AgreeItem;
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        formChecked: false, // 表单：协议checkbox是否选中
        modalShow: false, // 模态框是否选中
    };
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
    console.log('chufa ?');
       this.setState({
           modalShow: false,
       });
   };
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
            <div className="i"><input placeholder="请输入用户名" type="tel" maxLength="11"/></div>
          </div>
          <div className="input-box">
            <div className="t">
              <img src={ImgYZ} />
            </div>
            <div className="line2" />
            <div className="i"><input placeholder="请输入您的验证码" type="text"  pattern="[0-9]*" maxLength="6"/></div>
            <div className="btn-box">
              <button className="btn">获取验证码</button>
            </div>
          </div>
          <div className="input-box">
            <div className="t">
              <img src={ImgMima} />
            </div>
            <div className="line2" />
            <div className="i"><input placeholder="请输入您的密码" type="password" maxLength="20"/></div>
          </div>
          <div className="input-box2">
            <AgreeItem className="agree-item" checked={this.state.formChecked} onChange={(e) => this.onFormChecked(e)}>我已阅读并接受
              <a href="javascript:void(0)" onClick={() => this.onModalShow()}>《翼猫科技服务条款》</a>
            </AgreeItem>
          </div>
          <button className="this-btn all_trans">确认</button>
        </div>
        <Modal
          visible={this.state.modalShow}
          title="服务条款"
          transparent
          closable
          onClose={()=> this.onModalClose()}
          footer={[{ text: '确定', onPress: () => this.onModalClose() }]}

        >
          <div>
            <p>协议协协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议协议议</p>
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
    actions: bindActionCreators({}, dispatch),
  })
)(Register);
