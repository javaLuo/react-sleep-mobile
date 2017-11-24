/* 我的e家 - 主页 - 个人信息 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button } from 'antd-mobile';

import ImgRight from '../../../../assets/xiangyou@3x.png';
import defaultPic from '../../../../assets/logo@3x.png';
// ==================
// 本页面所需action
// ==================

import { getUserInfo, upLoadImg } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
      if (!this.props.userinfo) {
        this.getUserInfo();
      }
  }

  // 获取当前登录用户的相关信息
  getUserInfo() {
      this.props.actions.getUserInfo();
  }

  render() {
      const u = this.props.userinfo;
    return (
      <div className="userinfo-main">
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item all_active">
                  <Link to="/my/perinfo" className="page-flex-row">
                      <div className="title">基本信息</div>
                      <div className="photo"><img src={(u && u.headImg) ? u.headImg : defaultPic} /></div>
                      <div className="line"/>
                  </Link>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">手机号</div>
                  <div className="info">{u ? tools.addMosaic(u.mobile) : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">身份认证</div>
                  <div className="info">{u ? u.userName : ' '}</div>
                  <div className="arrow"><Button type="primary" size="small">已实名</Button></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">地区</div>
                  <div className="info">上海 嘉定</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active mt">
                  <div className="title">微信号</div>
                  <div className="info">微信账号</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">支付宝</div>
                  <div className="info">支付宝</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item page-flex-row all_active mt">
                  <div className="title">收货地址</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active">
                  <div className="title">我的二维码</div>
                  <div className="arrow"><img src={ImgRight} /></div>
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
    actions: bindActionCreators({ getUserInfo, upLoadImg }, dispatch),
  })
)(HomePageContainer);
