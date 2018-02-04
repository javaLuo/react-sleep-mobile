/* 收益管理 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import Echarts from 'echarts';
import './index.scss';
import { userIncomeMain } from '../../../../a_action/shop-action';
// ==================
// 所需的所有组件
// ==================
import { List, Toast } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],       // 图表所需数据
        totalIncome: 0,  // 总价格
    };
    this.dom = null;    // 图表实例
    this.colors = ['#ffb937', '#5c99ff', '#9942f9', '#ff4e83'];
  }

  componentDidMount() {
      document.title = '收益管理';
      const me = this;
      if (!this.props.userinfo) {   // 没有获取到用户信息，直接返回
        return;
      }
      // setTimeout是因为初次加载时，CSS可能还没加载完毕，导致图表样式有问题
      setTimeout(() => {
          this.dom = Echarts.init(document.getElementById('echarts-1'));
          this.getData();
      }, 16);
  }

    componentWillUpdate(nextP, nextS) {
      if (this.state.data !== nextS.data) {
          this.dom && this.dom.setOption(this.makeOption(nextS.data), true);
      }
    }

    // 获取原始数据
    getData(){
      const u = this.props.userinfo;
      this.props.actions.userIncomeMain({ userId: u.id}).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data.incomeList,
                    totalIncome: res.data.totalIncome,
                });
            } else {

            }
      });
    }

    // 处理图表数据
    makeOption(data = []) {
        const list = data.map((item, index) => {
            return {value: item.income, name: item.productTypeName};
        });

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: (p) => {
                   return `<span class="dit" style="color:${p.color}">·</span>${p.data.name}：<br/>￥${p.data.value}`;
                }
            },
            color: this.colors,
            series: [
                {
                    name:'累计收益',
                    type:'pie',
                    radius: ['55%', '70%'],
                    avoidLabelOverlap: false,
                    color: this.color,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            color: '#333',
                            fontSize: 22,
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: list,
                }
            ]
        };
        return option;
    }

  render() {
    const d = this.state.data;
    return (
      <div className="profit-main">
        <div className="charts-box">
          <div id="echarts-1" className="echarts" />
          <div className="center-label">
              <div className="t">￥{this.state.totalIncome || 0}</div>
              <div className="label">累计收益</div>
          </div>
        </div>
          <ul className="data-ul all_clear">
              {
                  this.state.data.map((item, index) => {
                      return <li key={index}><i style={{ backgroundColor: this.colors[index>this.colors.length-1 ? this.colors.length -1 : index] }}/>{item.productTypeName}：￥{item.income}</li>;
                  })
              }
          </ul>
          <div className="shouyi page-flex-row">
              <div className="flex-1">
                  <div className="title">已结算金额</div>
                  <div className="money">￥11.00</div>
              </div>
              <div className="flex-1">
                  <div className="title">可结算金额</div>
                  <div className="money">￥111.00</div>
              </div>
              <div className="flex-1">
                  <div className="title">待结算金额</div>
                  <div className="money">￥1.00</div>
              </div>
          </div>
          <List>
              <Item arrow="horizontal" onClick={() => this.props.history.push('/profit/prodetail')}>收益明细</Item>
          </List>
          <List className="mt">
              <Item arrow="horizontal" onClick={() => this.props.history.push('/profit/tixian')} extra={<span style={{ color: '#4191F8'}}>￥150.00</span>}>我要提现</Item>
          </List>
          <List>
              <Item arrow="horizontal" >提现记录</Item>
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
    actions: bindActionCreators({ userIncomeMain }, dispatch),
  })
)(HomePageContainer);
