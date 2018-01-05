/* 收益管理 - 收益明细 - 详情 */

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
import { List, Toast } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
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
        date: new Date(), // 当前选中的年月

    };
  }

  componentDidMount() {
      document.title = '收益详情';
      if (!this.props.proDetail) {
          Toast.fail('未获取到收益详情信息');
      }
  }

  render() {
      const data = this.props.proDetail;
    return (
      <div className="page-details">
          <List>
              <Item extra={<span style={{ color: '#FF0303' }}>￥{data.income || '--'}</span>}>收益</Item>
          </List>
          <div className="info-box">
              <div className="page-flex-row flex-jc-sb">
                  <div>类型</div>
                  <div>{data.productTypeName}</div>
              </div>
              <div className="page-flex-row flex-jc-sb">
                  <div>时间</div>
                  <div>{data.balanceTime}</div>
              </div>
              <div className="page-flex-row flex-jc-sb">
                  <div>交易流水号</div>
                  <div>{data.orderId}</div>
              </div>
              <div className="page-flex-row flex-jc-sb">
                  <div>下单e家号</div>
                  <div>{data.userId}</div>
              </div>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      proDetail: state.shop.proDetail,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({}, dispatch),
  })
)(HomePageContainer);
