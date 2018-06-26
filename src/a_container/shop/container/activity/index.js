/* 活动详情页 */

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
import ImgLogo from '../../../../assets/logo-img.png';

// ==================
// 本页面所需action
// ==================
import { listByActivityId } from '../../../../a_action/new-action';
import { wxInit } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: {},
        shareImg: '',
    };
  }

  UNSAFE_componentWillMount(){

  }

  componentDidMount() {
      document.title = '活动详情';
      const p = this.props.location.pathname.split('/').pop().split('_');
      const id = Number(p[0]);
      this.setState({
         shareImg: decodeURIComponent(p[1]),
      });
      if(id){
          this.getData(id);
      }
  }

    UNSAFE_componentWillReceiveProps(nextP) {
      if(nextP.location !== this.props.location) {
          const p = this.props.location.pathname.split('/').pop().split('_');
          this.setState({
              shareImg: decodeURIComponent(p[1]),
          });
          const id = Number(p[0]);
          this.getData(id);
      }
    }

    componentWillUnmount() {
      Toast.hide();
    }
  getData(id) {
      const params = {
          activityId: id,
      };
      Toast.loading('请稍后...', 0);
      this.props.actions.listByActivityId(params).then((res) => {
          if(res.status === 200) {
            this.setState({
                data: res.data || {},
            });
              this.props.actions.wxInit().then((res2)=>{
                  if(res2.status === 200) {
                      this.initWxConfig(res2.data, res.data);
                  }
              });
            Toast.hide();
          } else {
            Toast.info(res.message);
          }
      }).catch(() => {
          Toast.hide();
      });
  }

    // 初始化微信JS-SDK
    initWxConfig(d2, aData) {
        console.log('给老子触发');
        const me = this;
        if(typeof wx === 'undefined') {
            console.log('weixin sdk load failed!');
            return false;
        }
        console.log('触发');
        let title = aData.title;
        let info = `最新活动：${aData.title}`;

        console.log('到这了没有：', d2);
        wx.config({
            debug: false,
            appId: d2.appid,
            timestamp: d2.timestamp,
            nonceStr: d2.noncestr,
            signature: d2.signature,
            jsApiList: [
                'onMenuShareTimeline',      // 分享到朋友圈
                'onMenuShareAppMessage',    // 分享给微信好友
            ]
        });
        wx.ready(() => {
            console.log('微信JS-SDK初始化成功');
            /**
             * 拼接数据
             * userid - 用户ID
             * name - 名字
             * head - 头像
             * t - 当前数据ID
             * **/
            wx.onMenuShareAppMessage({
                title: title,
                desc: info,
                imgUrl: this.state.shareImg,
                type: 'link',
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });

            wx.onMenuShareTimeline({
                title: title,
                desc: info,
                imgUrl: this.state.shareImg,
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });
        });
        wx.error((e) => {
            Toast.info(e.errMsg, 1);
        });
    }

  render() {
      const d = this.state.data;
    return (
      <div className="page-activiey">
          {/* 上方iframe */}
          <div className="activity-iframe">
              <iframe  wmode="transparent" src={d.acUrl} />
          </div>
          {/* 其他推荐 */}
          {
              d.recommendProductList && d.recommendProductList.length ? (
                  <div className="others">
                      <div className="title">为你推荐</div>
                      <ul className="others-ul">
                          {
                              d.recommendProductList && d.recommendProductList.map((item, index) => {
                                  return (
                                      <li key={index}>
                                          <Link to={`/shop/gooddetail/${item.productId}`}>
                                              <img src={item.product.detailImg || ImgLogo} />
                                          </Link>
                                      </li>
                                  );
                              })
                          }
                      </ul>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ listByActivityId, wxInit }, dispatch),
  })
)(HomePageContainer);
