/* 我的e家 - 主页 */

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
import { Toast } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgBar1 from '../../../../assets/default-head.jpg';
import ImgBar2 from '../../../../assets/wozai@3x.png';
import ImgBar3 from '../../../../assets/jianakangdashi@3x.png';
import ImgBar4 from '../../../../assets/kehu@3x.png';
import ImgBar5 from '../../../../assets/daiyanka@3x.png';
import ImgBar6 from '../../../../assets/shouyi@3x.png';
import ImgBar7 from '../../../../assets/shiyongbangzhu@3x.png';
import ImgYouHui from '../../../../assets/youhui@3x.png';
import ImgDingDan from '../../../../assets/dingdan@3x.png';

// ==================
// 本页面所需action
// ==================

import { getUserInfo, myAmbassador } from '../../../../a_action/app-action';
// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false,    // 是否显示
    };
  }

  componentDidMount() {
      document.title = '我的e家';
      console.log('location:', this.props.location);
      if (!this.props.userinfo) {
        this.getUserInfo();
      }
      this.getMyAmbassador();
      setTimeout(() => {
          this.setState({
              show: true,
          });
      },0);
  }

  // 工具 - 通过用户类型type获取对应的称号
    getNameByUserType(type) {
      switch(String(type)){
          case '0': return '体验版经销商';
          case '1': return '微创版经销商';
          case '2': return '个人版经销商';
          case '3': return '分享用户';
          case '4': return '普通用户';
          default: return '';
      }
    }

  // 获取当前登录用户的相关信息
  getUserInfo() {
      const u = this.props.userinfo;
      const openId = localStorage.getItem('openId');
      if (!u && openId) {
          this.props.actions.getUserInfo({ openId }).then((res) => {
              if (res.status === 200) {
                  this.getMyAmbassador();
              }
          });
      }
  }

  // 获取健康大使信息
    getMyAmbassador() {
      const u = this.props.userinfo;
      console.log('这个时候没有吗？', u);
      if (u) {
          this.props.actions.myAmbassador({ userId: u.id });
      }
    }

    // 健康大使按钮被点击
    onDaShiClick() {
        const u = this.props.userinfo;
        const a = this.props.ambassador;
      if (!u) {
          Toast.info('请先登录', 1);
      } else if (u.userType === 4) {
          Toast.info('您还没有健康大使哦', 1);
      } else if (!a) {
          Toast.info('获取健康大使信息失败', 1);
      } else {
          this.props.history.push('/my/healthyamb');
      }
    }

    // 产品代言被点击
    onDaiYanClick() {
        const u = this.props.userinfo;
        const a = this.props.ambassador;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }

        if (u.userType === 2 || (u.userType === 3 && a.userType === 2)) {
            this.props.history.push('/my/mydaiyan');
        } else {
            Toast.info('您没有代言卡');
        }
    }

    // 使用帮助被点击
    onHelpClick() {
      window.open('http://e.yimaokeji.com/index.php/page/weixinHelp.html');
    }
  render() {
    const u = this.props.userinfo;
    return (
      <div className={this.state.show ? 'my-main show' : 'my-main'}>
          {/* 顶部 */}
          <div className="head all_active">
              <Link to={u ? '/my/userinfo' : '/login'} className="page-flex-row" style={{ width: '100%', height: '100%'}}>
                  <div className="flex-none picture">
                      <div className="pic-box">
                          <img src={u && u.headImg ? u.headImg : ImgBar1} />
                      </div>
                  </div>
                  {
                      u ? <div className="flex-auto info">
                          <div className="name all_nowarp">{ (u && u.nickName) ? u.nickName : '未设置昵称' }</div>
                          <div className="phone all_nowarp">e家号：{ u ? u.id : ' ' }</div>
                      </div> : <div className="flex-auto info">点击登录</div>
                  }
                  <div className="flex-none arrow">
                      <img src={ImgRight} />
                  </div>
              </Link>
          </div>
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item page-flex-row all_active" onClick={() => this.props.history.push(u ? '/my/order' : '/login')}>
                  <img src={ImgDingDan} className="icon"/>
                  <div className="title">我的订单</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="big-title mt">翼猫圈</div>
              <div className="item tran1 hide page-flex-row all_active" onClick={() => this.props.history.push(u ? '/my/atcat' : '/login')}>
                  <img src={ImgBar2} className="icon"/>
                  <div className="title">我在翼猫</div>
                  <div className="info">{u ? this.getNameByUserType(u.userType) : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran2 hide page-flex-row all_active" onClick={() => this.onDaShiClick()}>
                  <img src={ImgBar3} className="icon" />
                  <div className="title">健康大使</div>
                  <div className="info">{(u && u.userType !== 4) ? this.getNameByUserType(this.props.ambassador ? this.props.ambassador.userType : '') : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran3 hide page-flex-row all_active" onClick={() => this.props.history.push(u ? '/my/mycustomer': '/login')}>
                  <img src={ImgBar4} className="icon"/>
                  <div className="title">我的推广客户</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran4 hide page-flex-row all_active" onClick={() => this.props.history.push(u ? '/my/myfavcards' : '/login')}>
                  <img src={ImgYouHui} className="icon" />
                  <div className="title">我的优惠卡</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran5 hide page-flex-row all_active" onClick={() => this.onDaiYanClick()}>
                  <img src={ImgBar5} className="icon"/>
                  <div className="title">我的产品代言卡</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran6 hide page-flex-row all_active" onClick={() => this.props.history.push(u ? '/profit' : '/login')}>
                  <img src={ImgBar6} className="icon"/>
                  <div className="title">收益管理</div>
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item tran7 hide page-flex-row all_active mt" onClick={() => this.onHelpClick()}>
                  <img src={ImgBar7} className="icon"/>
                  <div className="title">使用帮助</div>
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
    actions: bindActionCreators({ getUserInfo, myAmbassador }, dispatch),
  })
)(HomePageContainer);
