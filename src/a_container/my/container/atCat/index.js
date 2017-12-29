/* 我的e家 - 我在翼猫 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import IScroll from 'iscroll';
import tools from '../../../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button } from 'antd-mobile';
import ImgBlue from '../../../../assets/yimaoka_one@3x.png';
import ImgRed from '../../../../assets/yimaoka_two@3x.png';
import ImgYellow from '../../../../assets/yimaoka_three@3x.png';
import ImgBlack from '../../../../assets/yimaoka_four@3x.png';
import ImgDuiGou from '../../../../assets/duigou@3x.png';
import ImgA1 from '../../../../assets/one_yikatong@3x.png';
import ImgA2 from '../../../../assets/two_yikatong@3x.png';
import ImgB1 from '../../../../assets/one_jingshui@3x.png';
import ImgB2 from '../../../../assets/two_jingshui@3x.png';
import ImgC1 from '../../../../assets/one_shipin@3x.png';
import ImgC2 from '../../../../assets/two_shipin@3x.png';
import ImgD1 from '../../../../assets/one_liliao@3x.png';
import ImgD2 from '../../../../assets/two_liliao@3x.png';
import ImgE1 from '../../../../assets/one_pingguka@3x.png';
import ImgE2 from '../../../../assets/two_pingguka@3x.png';
// ==================
// 本页面所需action
// ==================

import { } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
    this.scrollDom = null;  // iscroll 实例，退出时需销毁
  }

  componentDidMount() {
    this.getMyAmbassador();
    setTimeout(() => {
        this.scrollDom = new IScroll('#scroll1', {
            scrollX: true,

            snap: true
        });
        // 滚动结束时，判断当前是哪一页
        this.scrollDom.on('scrollEnd', () => {
            this.setState({
                page: this.scrollDom.currentPage.pageX,
            });
        });
        this.init();
    }, 16);
  }

  componentWillUnmount() {
      document.title = '我在翼猫';
      this.scrollDom.destroy();
      this.scrollDom = null;
      console.log('USERINFO:', this.props.userinfo);
  }

  /** 进入页面初始化 **/
  init() {
      const u = this.props.userinfo;
      let page = 0;
      if (u.userType === 0) { // 体验版经销商
          page = 1;
      } else if (u.userType === 1) { // 微创版经销商
          page = 2;
      } else if (u.userType === 2) { // 个人版经销商
          page = 3;
      }
      this.onScrollPageTo(page, 0);
  }

  // 点击iscroll下方的按钮，跳转到指定的页
    onScrollPageTo(page, time = 300) {
      this.setState({
          page,
      });
      this.scrollDom && this.scrollDom.goToPage(page, 1, time);
    }

    // 获取健康大使信息
    getMyAmbassador() {
        const u = this.props.userinfo;
        if (u && !this.props.ambassador) {
            this.props.actions.myAmbassador({ userId: u.id });
        }
    }

  render() {
    const u = this.props.userinfo;
    return (
      <div className="page-at-cat">
        <div className="iscroll-box">
          <div className="scroll" id="scroll1">
            <ul className="scroll-ul" style={{ width: '400%' }}>
              <li>
                <div style={{ backgroundImage: `url(${ImgBlue})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">用户版翼猫卡</div>
                    {[3,4].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                    <div className="foot"><span>全国翼猫体验店通用</span>{[3,4].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                </div>
              </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgRed})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">体验版翼猫卡</div>
                    {[0].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                    <div className="foot"><span>全国翼猫体验店通用</span>{[0].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                </div>
              </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgYellow})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">微创版黄金卡</div>
                    {[1].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                    <div className="foot"><span>全国翼猫体验店通用</span>{[1].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                </div>
              </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgBlack})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">个人版钻石卡</div>
                    {[2].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                    <div className="foot"><span>全国翼猫体验店通用</span>{[2].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="scroll-btns page-flex-row flex-jc-center">
          <div className={this.state.page === 0 ? 'check' : ''} onClick={() => this.onScrollPageTo(0)}/>
          <div className={this.state.page === 1 ? 'check' : ''} onClick={() => this.onScrollPageTo(1)}/>
          <div className={this.state.page === 2 ? 'check' : ''} onClick={() => this.onScrollPageTo(2)}/>
          <div className={this.state.page === 3 ? 'check' : ''} onClick={() => this.onScrollPageTo(3)}/>
        </div>
        <div className="info-all-box">
            {(() => {
                const u = this.props.userinfo;
                if (this.state.page !== 0) {
                    return (
                        <ul>
                            <li className="page-flex-row flex-ai-center">
                                <div className="pic flex-none"><img src={ImgA1} /></div>
                                <div className="info-box flex-auto">
                                    <div className="t">翼猫一卡通，千店共享</div>
                                    <div className="i">全国体验店免费服务，进店体验，休闲娱乐</div>
                                </div>
                            </li>
                            <li className="page-flex-row flex-ai-center">
                                <div className="pic flex-none"><img src={ImgB1} /></div>
                                <div className="info-box flex-auto">
                                    <div className="t">智能净水设备经销权({(() => {
                                        console.log('这个时候：', u);
                                        switch (this.state.page) {
                                            case 1: return '3';
                                            case 2: return '20';
                                            case 3: return '300';
                                            default: return '-';
                                        }
                                    })()}台)</div>
                                    {/*<div className="i">每台设备每年收益</div>*/}
                                </div>
                                {/*<div className="info2 flex-none">收益：40%</div>*/}
                            </li>
                            <li className="page-flex-row flex-ai-center">
                                <div className="pic flex-none"><img src={this.state.page >= 3 ? ImgC1 : ImgC2} /></div>
                                <div className="info-box flex-auto">
                                    <div className="t">健康食品经销权</div>
                                </div>
                                {/*<div className="info2 flex-none">收益：30%</div>*/}
                            </li>
                            <li className="page-flex-row flex-ai-center">
                                <div className="pic flex-none"><img src={this.state.page >= 3 ? ImgD1 : ImgD2} /></div>
                                <div className="info-box flex-auto">
                                    <div className="t">生物理疗经销权</div>
                                </div>
                                {/*<div className="info2 flex-none">收益：30%</div>*/}
                            </li>
                            <li className="page-flex-row flex-ai-center">
                                <div className="pic flex-none"><img src={this.state.page >= 3 ? ImgE1 : ImgE2} /></div>
                                <div className="info-box flex-auto">
                                    <div className="t">健康风险评估卡经销权</div>
                                </div>
                                {/*<div className="info2 flex-none">收益：30%</div>*/}
                            </li>
                        </ul>
                    );
                } else {
                    return (
                        <div className="card1">
                            <div className="title"><span>产品购买权</span></div>
                            <ul className="ul page-flex-row">
                                <li>
                                    <img src={ImgB2} />
                                    <div>智能净水</div>
                                </li>
                                <li>
                                    <img src={ImgC2} />
                                    <div>健康食品</div>
                                </li>
                                <li>
                                    <img src={this.props.ambassador.userType === 2 ? ImgD1 : ImgD2} />
                                    <div>生物理疗产品</div>
                                </li>
                                <li>
                                    <img src={ImgE2} />
                                    <div>健康风险评估卡</div>
                                </li>
                            </ul>
                            <div className="title"><span>温馨提示</span></div>
                            <div className="info">1.拥有健康大使的用户，可以购买您的健康大使拥有经销权的产品，暂不支持在线购买其他产品。</div>
                            <div className="info">2.还没有健康大使的用户，我们不建议您在线直接购买，请您到附近的体验服务站现场体验购买</div>
                        </div>
                    );
                }
            })()}
        </div>
          {
              this.state.page === 0 ? (
                  <div className="thefooter">
                      <Button type="primary" onClick={() => this.props.history.push('/shop/exprshop')}>查看翼猫体验服务中心</Button>
                  </div>
              ) : null
          }

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
  ambassador: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
    ambassador: state.app.ambassador,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ }, dispatch),
  })
)(HomePageContainer);
