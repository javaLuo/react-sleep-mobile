/* 健康管理 - 我的体检卡 */

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

import ImgRight from '../../../../assets/xiangyou2@3x.png';
import ImgShare from '../../../../assets/fenxiang@3x.png';
import ImgLogo from '../../../../assets/logo@3x.png';
import ImgShare1 from '../../../../assets/share-wx.png';
import ImgShare2 from '../../../../assets/share-friends.png';
import ImgShare3 from '../../../../assets/share-qq.png';
import { ActionSheet, Toast } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { mallCardList } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        wxReady: false, // 微信是否已初始化
    };
  }

  componentDidMount() {
      this.getData();
  }

  // 获取体检卡列表
  getData() {
      this.props.actions.mallCardList({ pageNum: 0, pageSize: 9999 }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data.result,
                });
            }
      });
  }

    // 获取微信初始化所需参数
    initWeiXinPay() {
        // 后台需要给个接口，返回appID,timestamp,nonceStr,signature
        // 然后调用initWxConfig()
    }

    // 初始化微信JS-SDK
    initWxConfig() {
        const me = this;
        if(typeof wx === 'undefined') {
            console.log('weixin sdk load failed!');
            return false;
        }
        console.log('到这里了');
        wx.config({
            debug: false,
            appID: 'wx57f6ee39cbea7654',
            timestamp: new Date().getTime(),
            nonceStr: 'asfasdfsd',
            signature: 'afdasdf',
            jsApiList: [
                'onMenuShareTimeline',   // 分享到朋友圈
                'onMenuShareAppMessage',    // 分享给微信好友
                'onMenuShareQQ'             // 分享到QQ
            ]
        });
        wx.ready(() => {
            me.setState({
                wxReady: true,
            });
        });
        wx.error((e) => {
            console.log('微信JS-SDK初始化失败：', e);
        });
    }

  // 分享框出现
    onShare() {
        ActionSheet.showShareActionSheetWithOptions({
            options: [
                { icon: <img src={ImgShare1} style={{ width: 36 }}/>, title: '微信好友' },
                { icon: <img src={ImgShare2} style={{ width: 36 }}/>, title: '朋友圈' },
                { icon: <img src={ImgShare3} style={{ width: 36 }}/>, title: 'QQ' },
            ],
            // title: 'title',
            maskClosable: true,
            message: '分享到：',
        },
        (index) => {
            console.log("选的那一个", index);
            if(index === 0) {   // 分享到微信
                this.shareToFritend();
            } else if(index === 1) {    // 分享到朋友圈
                this.shareToTimeLine();
            } else if(index === 2) {    // 分享到QQ
                this.shareToQQ();
            }
            return false;
        });
    }

    // 分享给好友
    shareToFritend() {
      wx.onMenuShareAppMessage({
          title: '健康风险评估卡',
          desc: '健康风险评估卡',
          link: 'http://hdr.yimaokeji.com/#/share/1',
          imgUrl: '#',
          type: 'link',
          success: () => {
              Toast.info('分享成功');
          }
      });
    }

    // 分享到朋友圈
    shareToTimeLine() {
        wx.onMenuShareTimeline({
            title: '健康风险评估卡',
            link: 'http://hdr.yimaokeji.com/#/share/1',
            imgUrl: '#',
            success: () => {
                Toast.info('分享成功');
            }
        });
    }

    // 分享到QQ
    shareToQQ() {
        wx.onMenuShareQQ({
            title: '健康风险评估卡',
            desc: '健康风险评估卡',
            link: 'http://hdr.yimaokeji.com/#/share/1',
            imgUrl: '#',
            success: () => {
                Toast.info('分享成功');
            }
        });
    }

  render() {
    return (
      <div className="page-mycard">
          <ul>
              {
                  this.state.data.map((item, index) => {
                      return <li  key={index} className="cardbox">
                          <div className="title page-flex-row flex-jc-sb flex-ai-center">
                              <img className="logo" src={ImgLogo} />
                              <span className="num">共5张<i>已使用0张</i></span>
                          </div> 
                          <div className="info page-flex-row">
                              <div className="t flex-auto">
                                  <div className="t-big">健康风险评估卡</div>
                                  <div className="t-sm">专注疾病早起筛查</div>
                              </div>
                              <div className="r flex-none page-flex-col flex-jc-center">
                                  <img src={ImgRight} />
                              </div>
                          </div>
                          <div className="info2 page-flex-row flex-jc-sb">
                              <span>有效期：2017-08-29</span>
                              <span onClick={() => this.onShare()}><img src={ImgShare} /></span>
                          </div>
                      </li>;
                  })
              }
          </ul>
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
    actions: bindActionCreators({ mallCardList }, dispatch),
  })
)(HomePageContainer);
