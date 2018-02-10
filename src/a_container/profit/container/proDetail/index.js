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
import { List, Toast, Picker } from 'antd-mobile';
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
        allAccount: [], // 所有的子账号
        pageNum: 1,
        pageSize: 10,
        date: undefined, // 当前选中的年月
        searchAccount: ['all'],    // 选中的子账号
        totalIncome: 0, // 合计

    };
  }

  componentDidMount() {
      document.title = '收益明细';
      this.getData();
  }

  // 收益来源选择变化
    onAccountChange(obj) {
      console.log('是各什111么：', obj);
        this.setState({
            searchAccount: obj,
        });
        this.getData(this.state.date, obj, 1, this.state.pageSize, 'flash');
    }

  // 日期选择变化时触发
    onDateChange(obj) {
      console.log('返回的什么：', obj);
      this.setState({
          date: obj,
      });
      this.getData(obj, this.state.searchAccount, 1, this.state.pageSize, 'flash');
    }

    getData(date = null, account=null, pageNum=1, pageSize=10, type='flash') {
      const u = this.props.userinfo;
      if (!u){
          return;
      }
      // 处理是否选择了收益来源
      let userId;
      let userType; // 后台分了两个接口，查自己用1，查子账户用2
      if (account && account[0] !== 'all') {
          userId = account[0];
          userType = 2;
      } else {
          userId = u.id;
          userType = 1;
      }
      const params = {
          userId,
          balanceTime: date ? (date[1] === '全年' ? date[0] : `${date.join('-')}-01`) : null,
          pageNum,
          pageSize,
      };
      Toast.loading('搜索中...',0);
      this.props.actions.userIncomeDetails(tools.clearNull(params), userType).then((res) => {
        if (res.status === 200) {
            this.setState({
                allAccount: userType === 1 ? res.data.sonDistributor : this.state.allAccount,
            });
            if (res.data && res.data.basePage && res.data.basePage.result && res.data.basePage.result.length) {
                this.setState({
                    totalIncome: res.data.totalIncome,
                    data: type==='flash' ? res.data.basePage.result : [...this.state.data, ...res.data.basePage.result],
                    pageNum,
                    pageSize,
                });
                Toast.hide();
            } else {    // 没有数据后台返回的是null
                if (type === 'update') {
                    this.setState({
                        data: this.state.data,
                    });
                    Toast.info('没有更多数据了',1);
                } else{
                    this.setState({
                        totalIncome: 0,
                        data: [],
                    });
                    Toast.hide();
                }
            }
        } else {
            if (type === 'flash') {
                console.log('传了一个');
                this.setState({
                    data: [],
                    totalIncome: 0,
                });
            } else {
                this.setState({
                    data: this.state.data,
                });
            }
            Toast.info(res.message || '获取数据失败',1);
        }
      }).catch(() => {
          this.setState({
              data: this.state.data,
          });
          Toast.fail('网络错误，请稍后重试',1);
      });
    }

    // 工具 - 根据子账号ID查子账号userType;
    getTypeByUserId(id) {
      const t = this.state.allAccount.find((item) => {
          return item.id === Number(id);
      });
      return t && t.userType;
    }

    // 点击一条数据，进入该数据的详情页
    onItemClick(d) {
      let userType = this.props.userinfo.userType;
      if (this.state.searchAccount[0] !== 'all') { // 选的子账号，用子账号的userType
          userType = this.getTypeByUserId(this.state.searchAccount[0]);
      }
      console.log('userType是：', userType);
      this.props.actions.saveProDetail(d);  // 将当前选中的这条数据保存到store
      setTimeout(() => this.props.history.push(`/profit/prodetails/${userType}`), 16);
    }

    onDown(){
      this.getData(this.state.date, this.state.searchAccount, 1, this.state.pageSize, 'flash');
    }

    onUp() {
      this.getData(this.state.date, this.state.searchAccount, this.state.pageNum+1, this.state.pageSize, 'update');
    }

  render() {
        const u = this.props.userinfo || {};
    return (
      <div className="profit-main">
          {
              (u && u.userType === 5) ? (
                  <List>
                      <Picker
                          extra={'收益来源选择'}
                          cols={1}
                          data={[[{label:'全部', value: 'all'}, ...this.state.allAccount.map((item) => ({ label: item.realName || item.nickName, value: item.id }))]]}
                          cascade={false}
                          value={this.state.searchAccount}
                          onOk={(obj) => this.onAccountChange(obj)}
                      >
                          <Item >收益来源账户</Item>
                      </Picker>
                  </List>
              ) : null
          }
          <Picker
              data={[
                  (() => {
                      const nowYear = new Date().getFullYear();
                      const y = [];
                      for(let i= 2010; i<=nowYear; i++) {
                          y.push({label: i, value: `${i}`});
                      }
                      return y;
                  })(),
                  [
                      {label: '1月',value: '01'},
                      {label: '2月',value: '02'},
                      {label: '3月',value: '03'},
                      {label: '4月',value: '04'},
                      {label: '5月',value: '05'},
                      {label: '6月',value: '06'},
                      {label: '7月',value: '07'},
                      {label: '8月',value: '08'},
                      {label: '9月',value: '09'},
                      {label: '10月',value: '10'},
                      {label: '11月',value: '11'},
                      {label: '12月',value: '12'},
                  ],
                  ]}
              cascade={false}
              value={this.state.date}
              onOk={(obj) => this.onDateChange(obj)}
          >
              <div className="head-chose page-flex-row flex-jc-sb">
                  <div className="date-chose"><span>{this.state.date ?  this.state.date.join('-') : '选择时间'}</span><img src={ImgRight} /></div>
                  <div>￥{this.state.totalIncome}</div>
              </div>
          </Picker>
          <div className="list-box" style={{ height: u.userType === 5 ? 'calc(100vh - 88px)' : 'calc(100vh - 44px)' }}>
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
