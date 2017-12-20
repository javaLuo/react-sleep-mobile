/* 收益管理 - 收益明细 */

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
import { List, DatePicker } from 'antd-mobile';
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
  }

  // 日期选择变化时触发
    onDateChange(obj) {
      this.setState({
          date: obj,
      });
    }

    // 点击一条数据，进入该数据的详情页
    onItemClick() {
      this.props.history.push('/profit/prodetails/1');
    }

  render() {
    return (
      <div className="profit-main">
          <DatePicker
            mode="month"
            onChange={(obj) => this.onDateChange(obj)}
          >
              <div className="head-chose page-flex-row flex-jc-sb">
                  <div className="date-chose">{tools.dateformart(this.state.date)} <img src={ImgRight} /></div>
                  <div>￥1200.00</div>
              </div>
          </DatePicker>
          <List style={{ marginTop: '.2rem' }}>
              <Item onClick={() => this.onItemClick()} extra={<span>￥400.00</span>}>健康风险评估卡<Brief>2017-01-22 23:48:00</Brief></Item>
              <Item extra={<span>￥400.00</span>}>健康风险评估卡<Brief>2017-01-22 23:48:00</Brief></Item>
              <Item extra={<span>￥400.00</span>}>健康风险评估卡<Brief>2017-01-22 23:48:00</Brief></Item>
          </List>
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
)(HomePageContainer);
