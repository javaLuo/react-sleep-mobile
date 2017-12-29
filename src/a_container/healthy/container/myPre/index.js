/* 健康管理 - 我的预约 */

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
import { Button } from 'antd-mobile';
import Img404 from '../../../../assets/not-found.png';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dizhi@3x.png';
import ImgPhone from '../../../../assets/dianhua@3x.png';
// ==================
// 本页面所需action
// ==================
import Luo from 'iscroll-luo';
import { mecReserveList } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        pageNum: 1,
        pageSize: 10,
    };
  }

  componentDidMount() {
      document.title = '我的体检预约';
      this.getData(this.state.pageNum, this.state.pageSize, 'flash');
  }

    // 下拉刷新
    onDown() {
        this.getData(1, this.state.pageSize,  'flash');
    }
    // 上拉加载
    onUp() {
        this.getData(this.state.pageNum + 1, this.state.pageSize, 'update');
    }

  // 获取本页面所需数据
  getData(pageNum=1, pageSize=10, type='flash') {
      this.props.actions.mecReserveList({ pageNum, pageSize }).then((res) => {
          if (res.status === 200) {
              this.setState({
                  data: type === 'flash' ? (res.data.result || []) : [...this.state.data, ...(res.data.result || [])],
                  pageNum,
                  pageSize
              });
          }
      });
  }

  render() {
    return (
      <div className="page-my-pre">
          <Luo
              id="luo4"
              className="touch-none"
              onPullDownRefresh={() => this.onDown()}
              onPullUpLoadMore={() => this.onUp()}
              iscrollOptions={{
                  disableMouse: true,

              }}
          >
          <ul>
          {
              (() => {
                  if (this.state.data.length === 0) {
                      return <li key={0} className="data-nothing">
                          <img src={Img404}/>
                          <div>亲，这里什么也没有哦~</div>
                      </li>;
                  } else {
                      return this.state.data.map((item, index) => {
                          return <li className="one-box" key={index}>
                              <div className="pre-box page-flex-row">
                                  <div className="l flex-auto">
                                      <div>体检人：{item.hraCustomer.username}</div>
                                      <div>体检卡号：{tools.cardFormart(item.ticketNo)}</div>
                                      <div>预约时间：{item.reserveTime}</div>
                                  </div>
                                  <div className="r flex-none">
                                      <div className="down">已预约</div>
                                  </div>
                              </div>
                              <div className="card-box page-flex-row">
                                  <div className="l flex-auto">
                                      <div className="title">服务站名称</div>
                                      <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>姓名</span></div>
                                      <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><a href={`tel:13600000000`}>电话</a></div>
                                      <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>地址</span></div>
                                  </div>
                              </div>
                          </li>;
                      });
                  }
              })()
          }
          </ul>
          </Luo>
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
    actions: bindActionCreators({ mecReserveList }, dispatch),
  })
)(HomePageContainer);
