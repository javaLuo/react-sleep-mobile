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
import { List, Toast, Modal } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { saveIWantNow } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],       // 图表所需数据
        totalIncome: 0,  // 总收益
        moneyWait: 0,   // 待提现金额（不可提现）
        moneyCan: 0,    // 可提现金额
        moneyOk: 0,     // 已提现金额
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
                    moneyWait: Number(res.data.canNotBeWithdrawCsh) || 0,
                    moneyCan: Number(res.data.canBeWithdrawCash) || 0,
                    moneyOk: Number(res.data.totalWithdrawCash) || 0,
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

    // 我要提现被点击
    onIWantNow() {
        // 保存当前提现数据到store
        this.props.actions.saveIWantNow(this.state.moneyCan);
        this.props.history.push('/profit/tixian');
    }

    // 右上角问号被点击
    onAqShow() {
        this.setState({
            aqShow: true,
        });
    }

    onAqClose() {
        this.setState({
            aqShow: false,
        });
    }
  render() {
    const u = this.props.userinfo;
    return (
      <div className="profit-main">
          <div className="aq" onClick={() => this.onAqShow()}>?</div>
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
              {
                  u && u.userType === 7 ? (
                      [
                          <div key={0} className="flex-1">
                              <div className="title">已提现金额</div>
                              <div className="money">￥{this.state.moneyOk.toFixed(2)}</div>
                          </div>,
                          <div key={1} className="flex-1">
                              <div className="title">可提现金额</div>
                              <div className="money">￥{this.state.moneyCan.toFixed(2)}</div>
                          </div>
                      ]
                  ) : null
              }

              <div className="flex-1">
                  <div className="title">待结算金额</div>
                  <div className="money">￥{this.state.moneyWait.toFixed(2)}</div>
              </div>
          </div>
          <List>
              <Item arrow="horizontal" onClick={() => this.props.history.push('/profit/prodetail')}>收益明细</Item>
          </List>
          { /** 只有分销用户(type === 7)可以提现 **/
              u && u.userType === 7 ? (
                  <List className="mt">
                      <Item arrow="horizontal" onClick={() => this.onIWantNow()} extra={<span style={{ color: '#4191F8'}}>￥{this.state.moneyCan.toFixed(2)}</span>}>我要提现</Item>
                      <Item arrow="horizontal" onClick={() => this.props.history.push('/profit/tixianrecord')}>提现记录</Item>
                  </List>
              ) : null
          }

          <Modal
              visible={this.state.aqShow}
              transparent
              wrapClassName={'aq-modal'}
              onClose={() => this.onAqClose()}
              footer={[{ text: '确定', onPress: () => this.onAqClose() }]}
          >
                  {
                      u && u.userType === 7 ? (
                          <div>
                              <h4>累积收益：</h4>
                              <p>指用户所有已完成订单产生的总收益。</p>
                              <p>累积收益=已提现金额+可提现金额。</p>

                              <h4>已提现金额：</h4>
                              <p>指用户已提现到微信零钱的金额；</p>

                              <h4>可提现金额：</h4>
                              <p>指用户当前已完成订单产生的收益，但在尚未提现的金额。</p>

                              <h4>暂不可提现金额：</h4>
                              <p>指用户已支付，但处于未完成的订单产生的收益。</p>

                              <p>买家支付后，可获得分销收益，但不可提现。自发货起15天之后，订单自动更新为已完成状态，收益可提现。若发货起15天内，买家退货，收益将自动扣除。当订单更新为已完成后，该订单收益将自动归入到可提现收益中。</p>
                          </div>
                      ) : (
                          <div>
                              <h4>累积收益：</h4>
                              <p>指用户所有已完成订单产生的总收益。</p>
                              <h4>待结算金额：</h4>
                              <p>指用户已支付，但处于未完成的订单产生的收益。</p>
                              <p>买家支付后，可获得分销收益，但不可结算。财务将按月进行审核结算，审核通过后，将结算给服务站，该订单收益将自动从待结算金额归入到累积收益中。</p>
                          </div>
                      )
                  }
          </Modal>
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
    actions: bindActionCreators({ userIncomeMain, saveIWantNow }, dispatch),
  })
)(HomePageContainer);
