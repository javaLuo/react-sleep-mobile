/* 收益管理 - 我要提现 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import tools from '../../../../util/all';
// ==================
// 所需的所有组件
// ==================
import { List, Toast, Button, InputItem } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { checkTiXianCan } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        howMuch: '',    // 提现金额
    };
  }

  componentDidMount() {
      document.title = '我要提现';
  }

  // 提现输入框修改
    onTixianInput(e) {
      let v = e;
        //先把非数字的都替换掉，除了数字和.
        v = v.replace(/[^\d\.]/g,'');
        //必须保证第一个为数字而不是.
        v = v.replace(/^\./g,'0.');
        //保证只有出现一个.而没有多个.
        v = v.replace(/\.{2,}/g,'.');
        //保证.只出现一次，而不能出现两次以上
        v = v.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
        //只能输入两个小数
        v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
        this.setState({
            howMuch: v,
        });
    }

    // 全部提现被点击
    onAllIn() {
      this.setState({
          howMuch: this.props.iwantnow.toFixed(2),
      });
    }

    // 开始提现
    onSubmit() {
      const v = Number(this.state.howMuch);
      if (!v) {
          Toast.info('请填写有效提现金额',1);
          return;
      } else if (v < 1){
          Toast.info('提现金额不得低于1元',1);
          return;
      }

      this.props.actions.checkTiXianCan({ amount: v }).then((res) => {
          if (res.status === 200) {
              this.props.history.push(`/profit/tixiannow/${v}`);
          } else {
              Toast.fail(res.message || '当前金额不可提现',1);
          }
      }).catch(() => {
          Toast.fail('网络错误，请稍后重试',1);
      });
    }

  render() {
      const u = this.props.userinfo || {};
    return (
      <div className="page-tixian">
          <List>
              <Item extra={<span style={{ color: '#338CF8' }}>微信零钱</span>}>提现账户</Item>
          </List>

          <div className="tixian">
              <div className="t">提现金额:</div>
              <InputItem
                  className="tixian-input"
                  type={'money'}
                  placeholder="请输入金额"
                  onChange={(e) => this.onTixianInput(e)}
                  moneyKeyboardAlign="left"
                  value={this.state.howMuch}
                  clear
              >￥</InputItem>
          </div>
          <div className="tixian-info">可提现金额：￥{this.props.iwantnow.toFixed(2)}，<span onClick={() => this.onAllIn()}>全部提现</span></div>
          <div className="info">买家支付后，可获得分销收益，但不可提现。自发货起15天之后，收益可提现。若发货起15天内，买家退货，收益将自动扣除。</div>
          <div className="submit-box"><Button className="submit-btn" type="primary" onClick={() => this.onSubmit()}>立即提现</Button></div>
          <div className="info">
              * 金额低于1元时不可提现<br/>
              * 预计1个工作日内可到账<br/>
              * 同一个用户，单笔单日提现额2w<br/>
              * 单日内提现次数不能超过3次
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
    userinfo: P.any,
    iwantnow: P.number,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      userinfo: state.app.userinfo,
      iwantnow: state.shop.iwantnow,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ checkTiXianCan }, dispatch),
  })
)(HomePageContainer);
