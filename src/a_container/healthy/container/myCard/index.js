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
import tools from '../../../../util/all';
// ==================
// 所需的所有组件
// ==================

import ImgRight from '../../../../assets/xiangyou2@3x.png';
import ImgShare from '../../../../assets/fenxiang@3x.png';
import ImgLogo from '../../../../assets/logo@3x.png';
import ImgShare1 from '../../../../assets/share-wx.png';
import ImgShare2 from '../../../../assets/share-friends.png';
import ImgShare3 from '../../../../assets/share-qq.png';
import ImgShareArr from '../../../../assets/share-arr.png';
import { ActionSheet, Toast } from 'antd-mobile';
import Config from '../../../../config';

// ==================
// 本页面所需action
// ==================

import { mallCardList, wxInit } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        wxReady: true, // 微信是否已初始化
        shareShow: false,   // 分享提示框是否显示
    };
  }

  componentDidMount() {
      this.getData();
      this.initWeiXinPay();
  }

  // 工具 - 获取已使用了多少张卡
    getHowManyByTicket(list) {
      if (!list){ return 0; }
      return list.filter((item) => item.ticketStatus !== 1).length;
    }
  // 获取体检卡列表
  getData() {
      this.props.actions.mallCardList({ pageNum: 0, pageSize: 9999 }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data ? res.data.result : [],
                });
            }
      });
  }

  // 失败
    onFail() {
        this.setState({
            wxReady: false,
        });
    }
    // 获取微信初始化所需参数
    initWeiXinPay() {
        // 后台需要给个接口，返回appID,timestamp,nonceStr,signature
        this.props.actions.wxInit().then((res) => {
            console.log('返回的是什么：', res);
            if (res.status === 200) {
                console.log('走这里：', res);
                this.initWxConfig(res.data);
            } else {
                this.onFail();
            }
        }).catch(() => {
            this.onFail();
        });
    }

    // 初始化微信JS-SDK
    initWxConfig(data) {
        const me = this;
        if(typeof wx === 'undefined') {
            console.log('weixin sdk load failed!');
            this.onFail();
            return false;
        }
        console.log('到这里了', data);
        wx.config({
            debug: false,
            appId: Config.appId,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',      // 分享到朋友圈
                'onMenuShareAppMessage',    // 分享给微信好友
                'onMenuShareQQ',             // 分享到QQ
                'shareTimeline'
            ]
        });
        wx.ready(() => {
            console.log('微信JS-SDK初始化成功');
            wx.onMenuShareAppMessage({
                title: '健康风险评估卡',
                desc: '健康风险评估卡',
                link: `${Config.baseURL}/gzh/#/share/${id}`,
                imgUrl: '#',
                type: 'link',
                success: () => {
                    Toast.info('分享成功');
                }
            });

            wx.onMenuShareTimeline({
                title: '健康风险评估卡',
                link: `${Config.baseURL}/gzh/#/share/${id}`,
                imgUrl: '#',
                success: () => {
                    Toast.info('分享成功');
                }
            });

            wx.onMenuShareQQ({
                title: '健康风险评估卡',
                desc: '健康风险评估卡',
                link: 'http://hdr.yimaokeji.com/gzh/#/share/1',
                imgUrl: '#',
                success: () => {
                    Toast.info('分享成功');
                }
            });
        });
        wx.error((e) => {
            console.log('微信JS-SDK初始化失败：', e);
            this.onFail();
        });
    }

    // 点击分享按钮，需判断是否是原生系统
    onStartShare(id) {
      if(typeof AndroidDataJs !== 'undefined') {    // 安卓系统
          this.onShare(id);
      } else { // H5就显示引导框
          this.setState({
              shareShow: true,
          });
      }
    }

  // 分享框出现
    onShare(id) {
        ActionSheet.showShareActionSheetWithOptions({
            options: [
                { icon: <img src={ImgShare1} style={{ width: 36 }}/>, title: '微信好友' },
                { icon: <img src={ImgShare2} style={{ width: 36 }}/>, title: '朋友圈' }
            ],
            // title: 'title',
            maskClosable: true,
            message: '分享到：',
        },
        (index) => {
            console.log("选的那一个", index);
            if(index === 0) {   // 分享到微信
                this.shareToFritend(id);
            } else if(index === 1) {    // 分享到朋友圈
                this.shareToTimeLine(id);
            }
            return false;
        });
    }

    // 分享给好友
    shareToFritend(id) {
      if(typeof AndroidDataJs !== 'undefined') {
          const params = [
              `${Config.baseURL}/gzh/#/share/${id}`,
              '健康风险评估卡',
              '翼猫科技 - 健康风险评估卡',
              '#',
              true,
          ];
          AndroidDataJs.shareToWeChat(...params);
      }
    }

    // 分享到朋友圈
    shareToTimeLine(id) {
        if(typeof AndroidDataJs !== 'undefined') {
            const params = [
                `${Config.baseURL}/gzh/#/share/${id}`,
                '健康风险评估卡',
                '翼猫科技 - 健康风险评估卡',
                '#',
                false,
            ];
            AndroidDataJs.shareToWeChat(...params);
        }
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
                              <span className="num">共{item.ticketNum}张<i>已使用{this.getHowManyByTicket(item.ticketList)}张</i></span>
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
                              <span>有效期：{tools.dateToStr(new Date(item.validTime))}</span>
                              <span onClick={() => this.onStartShare(item.id)}><img src={ImgShare} /></span>
                          </div>
                      </li>;
                  })
              }
          </ul>
          <div className={this.state.shareShow ? 'share-modal' : 'share-modal hide'} onClick={() => this.setState({ shareShow: false })}>
              <img className="share" src={ImgShareArr} />
              <div className="title">点击右上角进行分享</div>
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
    actions: bindActionCreators({ mallCardList, wxInit }, dispatch),
  })
)(HomePageContainer);
