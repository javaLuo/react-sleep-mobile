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
import { } from 'antd-mobile';
import ImgBlue from '../../../../assets/yimaoka_one@3x.png';
import ImgRed from '../../../../assets/yimaoka_two@3x.png';
import ImgYellow from '../../../../assets/yimaoka_three@3x.png';
import ImgBlack from '../../../../assets/yimaoka_four@3x.png';
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
    setTimeout(() => {
        this.scrollDom = new IScroll('#scroll1', {
            scrollX: true,
            momentum: false,
            snap: true
        });
        // 滚动结束时，判断当前是哪一页
        this.scrollDom.on('scrollEnd', () => {
            this.setState({
                page: this.scrollDom.currentPage.pageX,
            });
        });
    }, 16);
  }

  componentWillUnmount() {
      this.scrollDom.destroy();
      this.scrollDom = null;
  }

  // 点击iscroll下方的按钮，跳转到指定的页
    onScrollPageTo(page) {
      this.setState({
          page,
      });
      this.scrollDom && this.scrollDom.goToPage(page, 1, 300);
    }

  render() {
    return (
      <div className="page-at-cat">
        <div className="iscroll-box">
          <div className="scroll" id="scroll1">
            <ul className="scroll-ul" style={{ width: '400%' }}>
              <li>
                <div style={{ backgroundImage: `url(${ImgBlue})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">用户版翼猫卡</div>
                  <div className="u">
                    <div className="name">姓名</div>
                    <div>9900 2345 2345 2354 3454</div>
                  </div>
                  <div className="foot">全国翼猫体验店通用</div>
                </div>
              </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgRed})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">体验版翼猫卡</div>
                  <div className="u"><span>e家号：</span>990028</div>
                  <div className="foot">全国翼猫体验店通用</div>
                </div>
              </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgYellow})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">微创版黄金卡</div>
                  <div className="u">
                    <div className="name">姓名</div>
                    <div>9900 2345 2345 2354 3454</div>
                  </div>
                  <div className="foot">全国翼猫体验店通用</div>
                </div>
              </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgBlack})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">个人版砖石卡</div>
                  <div className="u"><span>e家号：</span>990028</div>
                  <div className="foot">全国翼猫体验店通用</div>
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
        <div className="info-box">
          <div>

          </div>
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
    actions: bindActionCreators({ }, dispatch),
  })
)(HomePageContainer);
