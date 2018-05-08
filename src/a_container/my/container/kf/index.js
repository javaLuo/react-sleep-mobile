/* 客服助手 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import { Transition } from 'react-spring';
import './index.scss';
import $ from 'jquery';
// ==================
// 所需的所有组件
// ==================
import Talk from './component/list';
import ImgRobot from './assets/robot@3x.png';
import ImgFill1 from './assets/Fill1@3x.png';
import ImgFill2 from './assets/Fill2@3x.png';

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
        tempData: [
            {type: 1, date: new Date()},
            {type: 2},
            {type: 3},
        ],   // 零时数据
    };
  }

  componentDidMount() {
      document.title = '客服助手';
  }

  // 滑动到最下面
    static scrollToDown() {
        $("#word-body").scrollTop($("#word-body")[0].scrollHeight);
    }

    onTypeClick(e) {
      const qid = e.target.getAttribute('data-id');
      const t = [...this.state.tempData];
      if(t[t.length-1].qid === qid && t[t.length-1].type === 4) { // 上一个已经是同样类型的回答了
          return;
      }
      t.push({ type: 4, qid });
      console.log(t);
      this.setState({
          tempData: t,
      }, () => {
          HomePageContainer.scrollToDown();
      });
    }

  render() {
    return (
      <div className="page-kf">
          <div className="word-body" id="word-body">
              <Transition
                keys = {this.state.tempData.map((item, index) => index)}
                from={{ opacity: 0, transform: 'translateY(20px)'}}
                enter={{ opacity: 1,transform: 'translateY(0)' }}
              >
                  {this.state.tempData.map(item => styles => {
                      return (<Talk
                          style={styles}
                          listOne={item}
                          source={[

                          ]}
                      />);
                  })}
              </Transition>
          </div>
          <div className="types" onClick={(e) => this.onTypeClick(e)}>
              <div data-id={1}>热门咨询</div>
              <div data-id={2}>关于分销</div>
              <div data-id={3}>关于分销</div>
          </div>
          <div className="footer-btn">
              {
                  [3, 7].includes(this.props.userinfo && this.props.userinfo.userType) ? (<a className="btn btn1"><img src={ImgFill1} /><span>销售咨询</span></a>) : null
              }

              <a className="btn btn2" href="tel:4001519999"><img src={ImgFill2} /><span>客服热线</span></a>
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
