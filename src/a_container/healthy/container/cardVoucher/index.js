/* 健康管理 - 体检卡 - 体检券页 */

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
            ]
        });
        wx.ready(() => {
            console.log('微信JS-SDK初始化成功');

        });
        wx.error((e) => {
            console.log('微信JS-SDK初始化失败：', e);
            this.onFail();
        });
    }

    // 点击分享按钮，需判断是否是原生系统
    onStartShare(obj, index) {
      /**
       * 拼凑所需数据
       * userID_体检券号_有效期_是否已使用_头像
       * **/
        const str = `${this.props.userinfo.id}_${obj.ticketNo}_${obj.validEndTime.split(' ')[0]}_${obj.ticketStatus}_${encodeURIComponent(this.props.userinfo.headImg)}`;
      if(tools.isWeixin()) { // 是微信系统才能分享
          wx.onMenuShareAppMessage({
              title: 'HRA健康风险评估卡',
              desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
              link: `${Config.baseURL}/gzh/#/shareticket/${str}`,
              imgUrl: 'http://isluo.com/work/logo/share_card.png',
              type: 'link',
              success: () => {
                  Toast.info('分享成功', 1);
              }
          });

          wx.onMenuShareTimeline({
              title: 'HRA健康风险评估卡',
              desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
              link: `${Config.baseURL}/gzh/#/shareticket/${str}`,
              imgUrl: 'http://isluo.com/work/logo/share_card.png',
              success: () => {
                  Toast.info('分享成功', 1);
              }
          });

          this.setState({
              shareShow: true,
              which: index,
          });
      }
    }

  render() {
      const ticket = this.props.cardInfo.ticketList || [];
    return (
      <div className="page-card-voucher">
          <ul>
              {
                  ticket.map((item, index) => {
                      return <li  key={index} className="cardbox page-flex-col flex-jc-sb">
                          <div className="row1 flex-none page-flex-row flex-jc-sb">
                              <div>
                                  <div className="t"> </div>
                              </div>
                              <div className="flex-none">{String(item.ticketStatus) === '1' ? '未使用' : '已使用'}</div>
                          </div>
                          <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end" onClick={() => this.onStartShare(item, index)}>
                              <div>
                                  <div className="t">卡号<span>{tools.cardFormart(item.ticketNo)}</span></div>
                                  <div className="i">有效期：{item.validEndTime ? item.validEndTime.split(' ')[0] : ''}</div>
                              </div>
                              {
                                  tools.isWeixin() ? <div className={ this.state.which === index ? 'flex-none share-btn check' : 'flex-none share-btn'}>分享</div> : null
                              }

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
    cardInfo: P.any,
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      cardInfo: state.shop.cardInfo,
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ mallCardList, wxInit }, dispatch),
  })
)(HomePageContainer);
