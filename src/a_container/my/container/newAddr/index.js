/* 我的e家 - 个人主页 - 添加收货地址 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button, List, Icon, WingBlank, InputItem, Toast } from 'antd-mobile';
import Img1 from '../../../../assets/test/test1.jpg';
// ==================
// 本页面所需action
// ==================

import { saveAddrss } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        formName: '',
        formPhone: '',
        formAddr: ''
    };
  }

  componentDidMount() {
      document.title = '添加收货地址';
  }

  //
   onLogOut(){
      localStorage.removeItem('userinfo');
      this.props.history.replace('/login');
   }

   // 保存
    onSubmit() {
        if (!this.state.formName) {
            Toast.fail('请输入姓名',1);
            return;
        } else if (!tools.checkPhone(this.state.formPhone)) {
            Toast.fail('请输入正确的手机号',1);
            return;
        } else if (!this.state.formAddr) {
            Toast.fail('请输入详细地址',1);
            return;
        }
        this.props.actions.saveAddrss();
    }

    // onNameChange
    onNameChange(v) {
       const value = tools.trim(v);
       if (value.length <= 12) {
           this.setState({
               formName: value,
           });
       }
    }

    // onPhoneChange
    onPhoneChange(v) {
        const value = tools.trim(v);
        if (value.length <= 11) {
            this.setState({
                formPhone: value,
            });
        }
    }

    // onAddrChange
    onAddrChange(v) {
        const value = tools.trim(v);
        if (value.length <= 150) {
            this.setState({
                formAddr: value,
            });
        }
    }
  render() {
    return (
      <div className="newaddr-page">
          <div className="page-flex-row">
              <div className="l flex-auto">
                  <List>
                      <InputItem clear value={this.state.formName} onChange={(v) => this.onNameChange(v)}>收货人：</InputItem>
                      <InputItem type="number" clear value={this.state.formPhone} onChange={(v) => this.onPhoneChange(v)}>联系电话：</InputItem>
                      <InputItem clear value={this.state.formAddr} onChange={(v) => this.onAddrChange(v)}>详细地址：</InputItem>
                  </List>
              </div>
              <div className="r page-flex-col flex-jc-center flex-ai-center">
                  <Icon type="search" size="lg" />
                  <div>选择客户</div>
              </div>
          </div>
          <div className="page-footer">
              <WingBlank><Button type="primary" onClick={() => this.onSubmit()}>保存</Button></WingBlank>
          </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

HomePageContainer.propTypes = {
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
    actions: bindActionCreators({ saveAddrss }, dispatch),
  })
)(HomePageContainer);
