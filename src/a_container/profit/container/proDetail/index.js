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
import { List, DatePicker, Toast } from 'antd-mobile';
import Luo from 'iscroll-luo';
import ImgRight from '../../../../assets/xiangyou@3x.png';
// ==================
// 本页面所需action
// ==================

import { userIncomeDetails, saveProDetail } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],   // 数据
        pageNum: 1,
        pageSize: 10,
        date: undefined, // 当前选中的年月
        totalIncome: 0, // 合计

    };
  }

  componentDidMount() {
      document.title = '收益明细';
      this.getData();
  }

  // 日期选择变化时触发
    onDateChange(obj) {
      this.setState({
          date: obj,
      });
      this.getData(obj, 1, this.state.pageSize, 'flash');
    }

    getData(date = null, pageNum=1, pageSize=10, type='flash') {
      const u = this.props.userinfo;
      if (!u){
          return;
      }
      const params = {
          userId: u.id,
          balanceTime: tools.dateformart(date),
          pageNum,
          pageSize,
      };
      Toast.loading('搜索中...',0);
      this.props.actions.userIncomeDetails(tools.clearNull(params)).then((res) => {
        if (res.status === 200) {
            if (res.data && res.data.basePage && res.data.basePage.result && res.data.basePage.result.length) {
                this.setState({
                    totalIncome: res.data.totalIncome,
                    data: type==='flash' ? res.data.basePage.result : [...this.state.data, ...res.data.basePage.result],
                    pageNum,
                    pageSize,
                });
                Toast.hide();
            } else {    // 没有数据后台返回的是null
                this.setState({
                    data: this.state.data,
                });
                if (type === 'update') {
                    Toast.info('没有更多数据了',1);
                }
            }
        } else {
            if (type === 'flash') {
                console.log('传了一个');
                this.setState({
                    data: [],
                });
            } else {
                this.setState({
                    data: this.state.data,
                });
            }
            Toast.fail(res.message || '获取数据失败',1);
        }
      }).catch(() => {
          this.setState({
              data: this.state.data,
          });
          Toast.fail('网络错误，请稍后重试',1);
      });
    }

    // 点击一条数据，进入该数据的详情页
    onItemClick(d) {
      this.props.actions.saveProDetail(d);  // 将当前选中的这条数据保存到store
      setTimeout(() => this.props.history.push('/profit/prodetails/1'), 16);
    }

    onDown(){
      this.getData(this.state.date, 1, this.state.pageSize, 'flash');
    }

    onUp() {
      this.getData(this.state.date, this.state.pageNum+1, this.state.pageSize, 'update');
    }

  render() {
    return (
      <div className="profit-main">
          <DatePicker
            mode="month"
            value={this.state.date}
            onChange={(obj) => this.onDateChange(obj)}
          >
              <div className="head-chose page-flex-row flex-jc-sb">
                  <div className="date-chose"><span>{tools.dateformart(this.state.date, 'month') || '选择时间'}</span><img src={ImgRight} /></div>
                  <div>￥{this.state.totalIncome}</div>
              </div>
          </DatePicker>
          <div className="list-box">
              <Luo
                  id="luo1"
                  className="touch-none"
                  onPullDownRefresh={() => this.onDown()}
                  onPullUpLoadMore={() => this.onUp()}
                  iscrollOptions={{
                      disableMouse: true,
                  }}
              >
                  <List>
                      {
                          this.state.data.map((item, index) => {
                              return <Item key={index} onClick={() => this.onItemClick(item)} extra={<span>￥{item.income}</span>}>
                                      {item.productTypeName}<Brief>{item.balanceTime}</Brief>
                              </Item>;
                          })
                      }
                  </List>
              </Luo>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ userIncomeDetails, saveProDetail }, dispatch),
  })
)(HomePageContainer);
