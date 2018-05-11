/* 商城 - 体验活动主页 */

// ==================
// 所需的各种插件
// ==================
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';

import './index.scss';

// ==================
// 所需的所有组件
// ==================

import { Checkbox, SwipeAction } from 'antd-mobile';
import ImgTest from '../../../../assets/test/new.png';
import StepLuo from '../../../../a_component/StepperLuo';
// ==================
// 本页面所需action
// ==================

import {  } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount(){

  }

  componentDidMount() {
      document.title = '购物车';
  }


  render() {
    const u = this.props.userinfo;
    return (
      <div className="shopping-car">
          <div className={"bodys"}>
          <div className="type-box">
              <div className="title">
                  <Checkbox onChange={() => {}}>
                    <span className="word">净水服务</span>
                  </Checkbox>
              </div>
              <div className="list">
                  <SwipeAction
                    autoClose
                    right={[
                        {
                            text: '删除',
                            onPress: () => console.log('删除'),
                            style: { color: 'white', padding: '10px' }
                        }
                    ]}
                  >
                      <div className="one">
                          <Checkbox onChange={() => {}} />
                          <div className="pic">
                              <img src={ImgTest} />
                          </div>
                          <div className="infos">
                              <div className="t all_warp">翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水</div>
                              <div className="num">
                                  <span className="money">￥1000.00</span>
                                  <StepLuo
                                    min={1}
                                    max={5}
                                    value={1}
                                    onChange={() => {}}
                                  />
                              </div>
                              <div className={"foot-info"}>商品已下架</div>
                          </div>
                      </div>
                  </SwipeAction>
                  <SwipeAction
                      autoClose
                      right={[
                          {
                              text: '删除',
                              onPress: () => console.log('删除'),
                              style: { color: 'white' }
                          }
                      ]}
                  >
                      <div className="one">
                          <Checkbox onChange={() => {}} />
                          <div className="pic">
                              <img src={ImgTest} />
                          </div>
                          <div className="infos">
                              <div className="t all_warp">翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水</div>
                              <div className="num">
                                  <span className="money">￥1000.00</span>
                                  <StepLuo
                                      min={1}
                                      max={5}
                                      value={1}
                                      onChange={() => {}}
                                  />
                              </div>
                              <div className={"foot-info"}>商品已下架</div>
                          </div>
                      </div>
                  </SwipeAction>
              </div>
          </div>
          <div className="type-box">
              <div className="title">
                  <Checkbox onChange={() => {}}>
                      <span className="word">健康体检</span>
                  </Checkbox>
              </div>
              <div className="list">
                  <SwipeAction
                      autoClose
                      right={[
                          {
                              text: '删除',
                              onPress: () => console.log('删除'),
                              style: { color: 'white' }
                          }
                      ]}
                  >
                      <div className="one">
                          <Checkbox onChange={() => {}} />
                          <div className="pic">
                              <img src={ImgTest} />
                          </div>
                          <div className="infos">
                              <div className="t all_warp">翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水</div>
                              <div className="num">
                                  <span className="money">￥1000.00</span>
                                  <StepLuo
                                      min={1}
                                      max={5}
                                      value={1}
                                      onChange={() => {}}
                                  />
                              </div>
                              <div className={"foot-info"}>商品已下架</div>
                          </div>
                      </div>
                  </SwipeAction>
                  <SwipeAction
                      autoClose
                      right={[
                          {
                              text: '删除',
                              onPress: () => console.log('删除'),
                              style: { color: 'white' }
                          }
                      ]}
                  >
                      <div className="one">
                          <Checkbox onChange={() => {}} />
                          <div className="pic">
                              <img src={ImgTest} />
                          </div>
                          <div className="infos">
                              <div className="t all_warp">翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水翼猫智能系统净水</div>
                              <div className="num">
                                  <span className="money">￥1000.00</span>
                                  <StepLuo
                                      min={1}
                                      max={5}
                                      value={1}
                                      onChange={() => {}}
                                  />
                              </div>
                              <div className={"foot-info"}>商品已下架</div>
                          </div>
                      </div>
                  </SwipeAction>
              </div>
          </div>
          </div>
          <div className={"footer-control"}>
              <Checkbox
                onChange={() => {}}
              >
                  <span style={{ paddingLeft: '10px' }}>全选</span>
              </Checkbox>
              <div style={{ flex : 'auto' }}/>
              <div className="all">合计：<span>￥ 9999999</span></div>
              <div className="all2">结算(999999)</div>
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
    actions: bindActionCreators({  }, dispatch),
  })
)(HomePageContainer);
