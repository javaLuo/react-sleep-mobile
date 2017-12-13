/* 健康管理 - 选择体检服务中心 */

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
import { Picker, Button, List, SearchBar, Toast, PullToRefresh } from 'antd-mobile';
import IscrollLuo from 'iscroll-luo';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgDh from '../../../../assets/daohang@3x.png';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dianhua@3x.png';
import ImgPhone from '../../../../assets/dizhi@3x.png';
import ImgCard from '../../../../assets/xuanzeka@3x.png';

// ==================
// 本页面所需action
// ==================

import { mallStationList } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],   // 所有数据
        loading: false, // 搜索中
        pageNum: 1,
        pageSize: 10,
        search: '',
        refreshing: false, // 加载更多搜索中
    };
  }

  componentDidMount() {
      this.getData(this.state.pageNum, this.state.pageSize, this.state.search);
  }

  getData(pageNum, pageSize, search) {
      const me = this;
    const params = {
        pageNum,
        pageSize,
        stationName: search,
    };
        // Toast.loading('搜索中…', 0);
      this.setState({
          refreshing: true,
      });
      this.props.actions.mallStationList(params).then((res) => {
          console.log('得到了什么：', res);
            if (res.status === 200) {
                me.setState({
                    data: [...this.state.data, ...res.data.result],
                    pageNum,
                    pageSize,
                    search,
                });
                //Toast.hide();
            } else {
                //Toast.fail('查询失败，请重试');
            }
          this.setState({
              refreshing: false,
          });
      }).catch(() => {
          this.setState({
              refreshing: false,
          });
          //Toast.fail('查询失败，请重试');
      });
  }

    // 开始搜索
    onSearch(e) {
      this.getData(this.state.pageNum, this.state.pageSize, e);
    }

    // 加载更多
    onDown() {

    }

    // 刷新
    onUp() {

    }

  render() {
    return (
      <div className="page-pre-check">
          <SearchBar
              placeholder="输入省/市/区/服务站名称"
              maxLength={25}
              onSubmit={(e) => this.onSearch(e)}
              iscrollOptions={{
                  preventDefault: true,
              }}
          />
          <div className="iscroll-box">
              <IscrollLuo
                id="luo1"
                onPullDownRefresh={() => this.onDown()}
                onPullUpLoadMore={() => this.onUp()}
                iscrollOptions={{
                    preventDefault: true,
                }}
              >
                  <ul className="card-ul">
                      {
                          this.state.data.length ? this.state.data.map((item, index) => {
                              return (
                                  <li key={index} className="card-box page-flex-row">
                                      <div className="l flex-auto">
                                          <div className="title">{item.name}</div>
                                          <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>{item.contactPerson}</span></div>
                                          <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span>{item.contactPhone}</span></div>
                                          <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>{item.address}</span></div>
                                      </div>
                                  </li>
                              );
                          }) : <li style={{ textAlign: 'center', padding: '.2rem' }}>搜索到0个结果</li>
                      }
                  </ul>
              </IscrollLuo>
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
    actions: bindActionCreators({ mallStationList }, dispatch),
  })
)(HomePageContainer);
