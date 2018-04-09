/* 视频直播 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import IScroll from 'iscroll';
import Luo from 'iscroll-luo';
// ==================
// 所需的所有组件
// ==================
import { Toast, Tabs } from 'antd-mobile';

// ==================
// 本页面所需action
// ==================

import { getLiveTypes } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================

class LiveContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false,    // 是否显示
    };
    this.allScroll = []; // 所有的2级scroll
  }

  componentDidMount() {
      document.title = '视频直播';
      if(!this.props.liveTypes.length) {
          this.getLiveTypes();
      } else {
          this.initAllScroll(this.props.liveTypes);
      }
      setTimeout(() => {
          this.setState({
              show: true,
          });
      },0);
  }

  /**
   * 改变时
   * */
  componentWillReceiveProps(nextP) {
      if (nextP.liveTypes !== this.props.liveTypes && nextP.liveTypes.length) { // 更新的types
          this.initAllScroll(nextP.liveTypes);
      }
  }
  /**
   * 退出时
   * */
  componentWillUnmount() {
      Toast.hide();
  }
  /**
   * 获取直播分类
   * **/
  getLiveTypes() {
      Toast.loading('请稍后...', 0);
      this.props.actions.getLiveTypes().finally(() => {
          Toast.hide();
      });
  }

  /**
   * 初始化所有的2级iscroll
   *
   * **/
  initAllScroll(data) {
      return;
      setTimeout(() => {
          // 先释放所有的
          this.allScroll.forEach((item ,index) => {
              item.destroy();
          });
          this.allScroll.length = 0;

          // 筛选出有Lv2的
          const h = data.filter((item, index) => {
              return !item.deleteFlag && item.subList && item.subList.length;
          });
          // 创建新的iscroll
          h.forEach((item, index) => {
              const temp = new IScroll(`#lv2-${item.id}`, {
                  scrollX: true,
                  snap: true
              });
              this.allScroll.push(temp);
          });
      });
  }
  /**
   * 处理1级分类
   * */
  makeTypesLv1(data) {
      return data.filter((item, index) => item.level === 1 && !item.deleteFlag).sort((a, b) => a.sorts - b.sorts).map((item, index) => {
          return { id: item.id, title: item.name, sub: index, children: item.subList};
      });
      // return [
      //     { title: '推荐', sub: 99, children: []},
      //     { title: '推荐2', sub: 98, children: []},
      //     { title: '推荐3', sub: 97, children: [
      //         { name: '巴拉巴拉' },
      //         { name: '巴拉巴拉2' },
      //         { name: '巴拉巴拉3' },
      //         { name: '巴拉巴拉3' },
      //         { name: '巴拉巴拉4' },
      //         { name: '巴拉巴拉4' },
      //     ]},
      //     { title: '推荐4', sub: 96, children: []},
      //     { title: '推荐5', sub: 95, children: []}
      // ];
  }

  render() {
    const tabs = this.makeTypesLv1(this.props.liveTypes);
    return (
      <div className={this.state.show ? 'live-main show' : 'live-main'}>
          {
              this.props.liveTypes.length ? (
                  <Tabs tabs={tabs}
                        renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
                        initialPage={0}
                        swipeable={true}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                  >
                      {
                          tabs.map((item, index) => {
                              return (
                                  <div key={index} className="live-tab-box">
                                      {
                                          item.children && item.children.length ? (
                                              <div className="lv2box" id={`lv2-${item.id}`} onTouchStart={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                                                  <ul className="swiper" style={{ width: `${68 * item.children.length}px` }}>
                                                  {
                                                      item.children.map((v, i) => {
                                                          return <li key={i}>
                                                              <div>{v.name}</div>
                                                          </li>;
                                                      })
                                                  }
                                                      <li>
                                                          <div><span>test1</span></div>
                                                      </li>
                                                      <li>
                                                          <div><span>test1</span></div>
                                                      </li>
                                                      <li>
                                                          <div><span>test1</span></div>
                                                      </li>
                                                      <li>
                                                          <div><span>test1</span></div>
                                                      </li>
                                                      <li>
                                                          <div><span>test1</span></div>
                                                      </li>
                                                      <li>
                                                          <div><span>test1</span></div>
                                                      </li>
                                                  </ul>
                                              </div>
                                          ) : null
                                      }
                                      <div className={ item.children && item.children.length ? "body-box shot" : "body-box" }>
                                          <Luo id={`luo-${index}`}>
                                              <ul>
                                                  <li>1</li>
                                              </ul>
                                          </Luo>
                                      </div>
                                  </div>
                              );
                          })
                      }
                  </Tabs>
              ) : null
          }

      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

LiveContainer.propTypes = {
  location: P.any,
  history: P.any,
  actions: P.any,
  userinfo: P.any,
  liveTypes: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
    liveTypes: state.shop.liveTypes,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getLiveTypes }, dispatch),
  })
)(LiveContainer);
