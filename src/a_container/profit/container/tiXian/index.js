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
import { List, Toast, Button } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
      document.title = '我要提现';
  }

  render() {
      const data = this.props.proDetail;
      const u = this.props.userinfo || {};
    return (
      <div className="page-tixian">
          <List>
              <Item extra={<span style={{ color: '#338CF8' }}>微信零钱</span>}>提现账户</Item>
          </List>
          <div className="tixian">
              <div className="t">提现金额</div>
              <div className="i page-flex-row">
                  <div className="flex-none">￥</div>
                  <div className="flex-auto"><input type="number" /></div>
              </div>
          </div>
          <div className="tixian-info">可提现金额：￥1000.00，<span>全部提现</span></div>
          <div className="info">买家支付后，可获得分销收益，但不可提现。自发货起15天之后，收益可提现。若发货起15天内，买家退货，收益将自动扣除。</div>
          <div className="submit-box"><Button className="submit-btn" type="primary">立即提现</Button></div>
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
  proDetail: P.any,
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      proDetail: state.shop.proDetail,
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({}, dispatch),
  })
)(HomePageContainer);
