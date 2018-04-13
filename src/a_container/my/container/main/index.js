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
import ImgBar8 from '../../../../assets/wodekehudingdan@3x.png';
import ImgBar9 from '../../../../assets/jxs@3x.png';
import ImgBar10 from '../../../../assets/icon_btn_yingsixieyi_normal@3x.png';
import ImgBar11 from '../../../../assets/icon_btn_yonghuxieyi_normal@3x.png';
import ImgYouHui from '../../../../assets/youhui@3x.png';
import ImgDingDan from '../../../../assets/dingdan@3x.png';
import tools from '../../../../util/all';
// ==================
// 本页面所需action
// ==================

import { getUserInfo, myAmbassador } from '../../../../a_action/app-action';
import { getMyCustomersCount } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false,    // 是否显示
        howManyCustomer: 0, // 有多少个推广用户
    };
  }

  componentDidMount() {
      document.title = '我的e家';
      console.log('location:', this.props.location);
      if (!this.props.userinfo) {
        this.getUserInfo();
      } else {
          this.getMyAmbassador();
          this.getMyCustomers();
      }

      setTimeout(() => {
          this.setState({
              show: true,
          });
      },0);
  }

  // 获取当前登录用户的相关信息
  getUserInfo() {
      const u = this.props.userinfo;
      const openId = localStorage.getItem('openId');
      if (!u && openId) {
          this.props.actions.getUserInfo({ openId }).then((res) => {
              if (res.status === 200) {
                  this.getMyAmbassador();
                  this.getMyCustomers();
              }
          });
      }
  }

  // 获得有多少个推广客户
    getMyCustomers() {
      const u = this.props.userinfo;
      if (u) {
          this.props.actions.getMyCustomersCount({ userId: u.id }).then((res) => {
              if (res.status === 200) {
                  this.setState({
                      howManyCustomer: res.data.totalCount,
                  });
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
      } else if (!a) {
          Toast.info('您还没有健康大使', 1);
      } else {
          this.props.history.push('/my/healthyamb');
      }
    }

    // 产品代言被点击
    onDaiYanClick() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }
        this.props.history.push('/my/daiyan');
    }

    // 我的推广客户被点击
    onMyCustomerClick() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }
        if ([5].includes(u.userType)) { // 是企业主账号
            this.props.history.push('/my/primary');
        } else {
            this.props.history.push(`/my/mycustomer/${u.id}/${u.userType}`);
        }

    }
    // 客户订单被点击
    onMyOrderCustomerClick() {
        const u = this.props.userinfo;
        if (!u) {
            Toast.info('请先登录', 1);
            return;
        }
        this.props.history.push('/my/ordercustomer');
    }
    // 使用帮助被点击
    onHelpClick() {
     const u = this.props.userinfo;
      /**
       * id_nickName_headImg
       * 测试：http://www.huiyuzixun.cn/index.php?m=book&f=browse&t=mhtml&bookID=3&e=${str}
       * 正式：http://e.yimaokeji.com/index.php?m=book&f=browse&t=mhtml&nodeID=385${str}
       *
       * **/
      let str = '';
      if (u && u.id) {  // 有用户信息
          str = `&e=${u.id}`;
      }
      window.open(`http://e.yimaokeji.com/index.php?m=book&f=browse&t=mhtml&nodeID=385${str}`);
    }

    // 点击绑定经销商按钮
    onBindDealear() {
        const u = this.props.userinfo;
        if (!u){
            Toast.info('请先登录',1);
            this.props.history.replace('/login');
            return false;
        }
        if (u.disUser && [0,1,2,5,6].indexOf(u.userType) >= 0){ // 已绑定经销商
            Toast.info('您已是经销商用户', 1);
        } else {    // 不是经销商就跳转到经销商绑定页
            this.props.history.push('/my/binddealer');
        }
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
                  <div className="info" />
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="big-title mt">翼猫圈</div>
              <div className="item tran1 hide page-flex-row all_active" onClick={() => this.onBindDealear()}>
                  <img src={ImgBar9} className="icon" />
                  <div className="title">绑定经销商账户</div>
                  <div className={u && u.disUser ? "info mr" : 'info'}>{(u && u.disUser) ? u.userName : ''}</div>
                  {u && u.disUser ? null : <div className="arrow"><img src={ImgRight} /></div>}
                  <div className="line"/>
              </div>
              <div className="item tran2 hide page-flex-row all_active" onClick={() => this.props.history.push(u ? '/my/atcat' : '/login')}>
                  <img src={ImgBar2} className="icon"/>
                  <div className="title">我在翼猫</div>
                  <div className="info">{u ? tools.getNameByUserType(u.userType) : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran3 hide page-flex-row all_active" onClick={() => this.onDaShiClick()}>
                  <img src={ImgBar3} className="icon" />
                  <div className="title">健康大使</div>
                  <div className="info">{this.props.ambassador ? (this.props.ambassador.nickName || this.props.ambassador.realName) : ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran4 hide page-flex-row all_active" onClick={() => this.onMyCustomerClick()}>
                  <img src={ImgBar4} className="icon"/>
                  <div className="title">我的客户</div>
                  <div className="info" >{this.state.howManyCustomer}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran5 hide page-flex-row all_active" onClick={() => this.onMyOrderCustomerClick()}>
                  <img src={ImgBar8} className="icon"/>
                  <div className="title">我的客户订单</div>
                  <div className="info" />
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran6 hide page-flex-row all_active" onClick={() => this.props.history.push(u ? '/my/myfavcards' : '/login')}>
                  <img src={ImgYouHui} className="icon" />
                  <div className="title">我的优惠卡</div>
                  <div className="info" />
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran7 hide page-flex-row all_active" onClick={() => this.onDaiYanClick()}>
                  <img src={ImgBar5} className="icon"/>
                  <div className="title">我的代言卡</div>
                  <div className="info" />
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran8 hide page-flex-row all_active" onClick={() => this.props.history.push(u ? '/profit' : '/login')}>
                  <img src={ImgBar6} className="icon"/>
                  <div className="title">收益管理</div>
                  <div className="info" />
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item tran8 hide page-flex-row all_active mt" onClick={() => window.open('http://e.yimaokeji.com/index.php?m=book&f=read&t=mhtml&articleID=464&e=')}>
                  <img src={ImgBar11} className="icon"/>
                  <div className="title">用户协议</div>
                  <div className="info" />
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item tran8 hide page-flex-row all_active" onClick={() => window.open('http://e.yimaokeji.com/index.php?m=book&f=read&t=mhtml&articleID=463&e=')}>
                  <img src={ImgBar10} className="icon"/>
                  <div className="title">隐私协议</div>
                  <div className="info" />
                  <div className="arrow"><img src={ImgRight} /></div>
              </div>
              <div className="item tran8 hide page-flex-row all_active mt" onClick={() => this.onHelpClick()}>
                  <img src={ImgBar7} className="icon"/>
                  <div className="title">使用帮助</div>
                  <div className="info" />
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
    actions: bindActionCreators({ getUserInfo, myAmbassador, getMyCustomersCount }, dispatch),
  })
)(HomePageContainer);
