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
import ImgFenXiang from '../../../../assets/fenxiang@3x.png';
import { ActionSheet, Toast } from 'antd-mobile';
import Config from '../../../../config';

// ==================
// 本页面所需action
// ==================

import { mallCardList, wxInit, saveCardInfo } from '../../../../a_action/shop-action';
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
            ]
        });
        wx.ready(() => {
            console.log('微信JS-SDK初始化成功');
            // 在这里设置是因为用户可能直接点击右上角微信分享按钮，没有选择具体哪张卡
            wx.onMenuShareAppMessage({
                title: 'HRA健康风险评估卡',
                desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
                link: `${Config.baseURL}/gzh/#/share/0_${this.props.userinfo.id}`,
                imgUrl: 'http://isluo.com/work/logo/share_card.png',
                type: 'link',
                success: () => {
                    Toast.info('分享成功');
                }
            });

            wx.onMenuShareTimeline({
                title: 'HRA健康风险评估卡',
                desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
                link: `${Config.baseURL}/gzh/#/share/0_${this.props.userinfo.id}`,
                imgUrl: 'http://isluo.com/work/logo/share_card.png',
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
    onStartShare(obj, e) {
      e.stopPropagation();
      console.log('要分享的信息：', obj);
      if(typeof AndroidDataJs !== 'undefined') {    // 安卓系统
          // this.onShare(obj);
      } else { // H5就显示引导框
          wx.onMenuShareAppMessage({
              title: 'HRA健康风险评估卡',
              desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
              link: `${Config.baseURL}/gzh/#/share/${obj.id}_${this.props.userinfo.id}`,
              imgUrl: 'http://isluo.com/work/logo/share_card.png',
              type: 'link',
              success: () => {
                  Toast.info('分享成功');
              }
          });

          wx.onMenuShareTimeline({
              title: 'HRA健康风险评估卡',
              desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
              link: `${Config.baseURL}/gzh/#/share/${obj.id}_${this.props.userinfo.id}`,
              imgUrl: 'http://isluo.com/work/logo/share_card.png',
              success: () => {
                  Toast.info('分享成功');
              }
          });

          this.setState({
              shareShow: true,
          });
      }
    }

  // 分享框出现
    onShare(obj) {
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
                this.shareToFritend(obj);
            } else if(index === 1) {    // 分享到朋友圈
                this.shareToTimeLine(obj);
            }
            return false;
        });
    }

    // 分享给好友
    shareToFritend(obj) {
      if(typeof AndroidDataJs !== 'undefined') {
          const params = [
              `${Config.baseURL}/gzh/#/share/${obj.id}_${this.props.userinfo.id}`,
              'HRA健康风险评估卡',
              obj.productModel.modelDetail || '专注疾病早起筛查',
              'http://isluo.com/work/logo/share_card.png',
              true,
          ];
          AndroidDataJs.shareToWeChat(...params);
      }
    }

    // 分享到朋友圈
    shareToTimeLine(obj) {
        if(typeof AndroidDataJs !== 'undefined') {
            const params = [
                `${Config.baseURL}/gzh/#/share/${obj.id}_${this.props.userinfo.id}`,
                'HRA健康风险评估卡',
                obj.productModel.modelDetail || '专注疾病早起筛查',
                'http://isluo.com/work/logo/share_card.png',
                false,
            ];
            AndroidDataJs.shareToWeChat(...params);
        }
    }

    // 点击卡片进入体检券页
    onClickCard(obj) {
        this.props.actions.saveCardInfo(obj);
        setTimeout(() => this.props.history.push('/healthy/cardvoucher'), 16);
    }

  render() {
    return (
      <div className="page-mycard">
          <ul>
              {
                  this.state.data.length ? this.state.data.map((item, index) => {
                      return <li  key={index} className="cardbox page-flex-col flex-jc-sb" onClick={() => this.onClickCard(item)}>
                          <div className="row1 flex-none page-flex-row flex-jc-sb">
                              <div>
                                  <div className="t">健康风险评估卡</div>
                                  <div className="i">专注疾病早起筛查</div>
                              </div>
                              <div className="flex-none"><img src={ImgRight} /></div>
                          </div>
                          <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                              <div>
                                  <div className="t">共5张<span>已使用0张</span></div>
                                  <div className="i">有效期：2020-01-01</div>
                              </div>
                              <div className="flex-none share-btn" onClick={(e) => this.onStartShare(item, e)}><img src={ImgFenXiang} /></div>
                          </div>
                      </li>;
                  }) : <li key={0} className="nodata">您没有体检卡<br/><Link to="/">前往购买</Link></li>
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
    actions: bindActionCreators({ mallCardList, wxInit, saveCardInfo }, dispatch),
  })
)(HomePageContainer);
