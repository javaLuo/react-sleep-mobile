/* 健康管理 - 主页 */

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
import {  } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgBar1 from '../../../../assets/tijianka@3x.png';
import ImgBar2 from '../../../../assets/yuyue@3x.png';
import ImgBar3 from '../../../../assets/wodeyuyue@3x.png';
import ImgBar4 from '../../../../assets/baogao@3x.png';
import ImgBar5 from '../../../../assets/HRA@3x.png';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false,
    };
  }

  componentDidMount() {
      document.title = '健康管理';
      setTimeout(() =>{
              this.setState({
                  show: true
              });
          }
      ,0);
  }

  // HRA知识库点击
    onHraClick() {
      window.open('http://e.yimaokeji.com/index.php/page/HRAknowledge.mhtml');
    }

  render() {
    const user = sessionStorage.getItem('userinfo');
    return (
      <div className={this.state.show ? 'healthy-main show' : 'healthy-main'}>
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item hide tran1 page-flex-row all_active" onClick={() => this.props.history.push('/healthy/mycard')}>
                  <img className="icon" src={ImgBar1} />
                  <div className="title">我的体检卡</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item hide tran2 page-flex-row all_active" onClick={() => this.props.history.push('/healthy/precheck')}>
                  <img className="icon" src={ImgBar2} />
                  <div className="title">预约体检</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item hide tran3 page-flex-row all_active mt" onClick={() => this.props.history.push('/healthy/mypre')}>
                  <img className="icon" src={ImgBar3} />
                  <div className="title">我的预约</div>
                  {/*<div className="info">1次</div>*/}
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item hide tran4 page-flex-row all_active" onClick={() => this.props.history.push('/healthy/myreport')}>
                  <img className="icon" src={ImgBar4} />
                  <div className="title">体检报告</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item hide tran5 page-flex-row all_active mt" onClick={() => this.onHraClick()}>
                  <img className="icon" src={ImgBar5} />
                  <div className="title">HRA知识库</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({

  }), 
  (dispatch) => ({
    actions: bindActionCreators({}, dispatch),
  })
)(HomePageContainer);
