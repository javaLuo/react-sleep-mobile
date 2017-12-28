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
import Luo from 'iscroll-luo';
import ImgRight from '../../../../assets/xiangyou2@3x.png';
import ImgShare1 from '../../../../assets/share-wx.png';
import ImgShare2 from '../../../../assets/share-friends.png';
import ImgShare3 from '../../../../assets/share-qq.png';
import ImgShareArr from '../../../../assets/share-arr.png';
import ImgFenXiang from '../../../../assets/fenxiang@3x.png';
import Img404 from '../../../../assets/not-found.png';
import { ActionSheet, Toast } from 'antd-mobile';
import Config from '../../../../config';

// ==================
// 本页面所需action
// ==================

import { mallCardList, wxInit, saveCardInfo, saveMyCardInfo } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        wxReady: true, // 微信是否已初始化
        shareShow: false,   // 分享提示框是否显示
        which: -1,  // 当前选中哪一个进行分享
    };
  }

  componentDidMount() {
      if ((!this.props.myCard.data) || (!this.props.myCard.data.length)) {
          console.log('你还是执行了这里：', this.props.myCard.data);
          this.getData();
      }
      this.initWeiXinPay();
  }

  // 工具 - 获取已使用了多少张卡
    getHowManyByTicket(list) {
      if (!list){ return 0; }
      return list.filter((item) => item.ticketStatus !== 1).length;
    }

  /**
   * 获取体检卡列表
   * type=falsh 刷新
   * type=update 累加
   * **/
  getData(pageNum = 1, pageSize = 10, type) {
      this.props.actions.mallCardList({ pageNum, pageSize }).then((res) => {
            if (res.status === 200) {
                console.log('我的体检卡：', res.data.result);
                if (!res.data || !res.data.result || res.data.result.length === 0) {
                    Toast.info('没有更多数据了', 1);
                }
                this.props.actions.saveMyCardInfo((res.data && res.data.result) ? ( type === 'update' ? [...(this.props.myCard.data || []), ...res.data.result] : res.data.result ) : [], pageNum, pageSize);
            } else {
                Toast.info(res.message || '数据加载失败', 1);
                this.props.actions.saveMyCardInfo([], this.props.myCard.pageNum, this.props.myCard.pageSize);
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
    onStartShare(obj, index, e) {
      e.stopPropagation();
      console.log('要分享的信息：', obj, tools.isWeixin());
      if(tools.isWeixin()) { // 是微信中才能分享
          /**
           * 拼凑要带过去的数据
           * 用户ID_共几张_价格_有效期_5张卡号_头像
           * **/
          const str = `${this.props.userinfo.id}_${obj.ticketNum}_${obj.productModel.price}_${tools.dateformart(new Date(obj.validTime))}_${obj.ticketList.map((item, index) => `${item.ticketNo}@${item.ticketStatus}`).join('+')}_${encodeURIComponent(this.props.userinfo.headImg)}`;
          console.log('走到这里了没有：', str);
          wx.onMenuShareAppMessage({
              title: 'HRA健康风险评估卡',
              desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
              link: `${Config.baseURL}/gzh/#/share/${str}`,
              imgUrl: 'http://isluo.com/work/logo/share_card.png',
              type: 'link',
              success: () => {
                  Toast.info('分享成功', 1);
              }
          });

          wx.onMenuShareTimeline({
              title: 'HRA健康风险评估卡',
              desc: '专注疾病早期筛查，5分钟出具检测报告，为您提供干预方案',
              link: `${Config.baseURL}/gzh/#/share/${str}`,
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

    // 工具 - 计算使用了多少张体检券
    useNum(list) {
      let num = 0;
      if (!list) {
          return num;
      }
      list.forEach((item) => {
          if (item.ticketStatus !== 1) {
              num++;
          }
      });
      return num;
    }

    // 下拉刷新
    onDown() {
        this.getData(1, this.props.myCard.pageSize, 'flash');
    }
    // 上拉加载
    onUp() {
      this.getData(this.props.myCard.pageNum + 1, this.props.myCard.pageSize, 'update');
    }

  render() {
    return (
      <div className="page-mycard">
          <Luo
            id="luo1"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
            iscrollOptions={{
                disableMouse: true,
                disablePointer: true,
                momentum: false,
            }}
          >
              <ul className="the-ul">
                  {
                      (() => {
                          if (!this.props.myCard.data) {
                              return <li key={0} className="nodata">加载中...</li>;
                          } else if (this.props.myCard.data.length === 0) {
                              return <li key={0} className="data-nothing">
                                  <img src={Img404}/>
                                  <div>亲，这里什么也没有哦~</div>
                              </li>;
                          } else {
                              return this.props.myCard.data.map((item, index) => {
                                  return <li key={index} className="cardbox page-flex-col flex-jc-sb" onClick={() => this.onClickCard(item)}>
                                      <div className="row1 flex-none page-flex-row flex-jc-sb" >
                                          <div>
                                              <div className="t">健康风险评估卡</div>
                                              <div className="i">专注疾病早起筛查</div>
                                          </div>
                                          <div className="flex-none"><img src={ImgRight}/></div>
                                      </div>
                                      <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end" onClick={(e) => this.onStartShare(item, index, e)}>
                                          <div>
                                              <div className="t">
                                                  共{item.ticketNum}张<span>已使用{this.useNum(item.ticketList)}张</span></div>
                                              <div className="i">有效期至：{tools.dateformart(new Date(item.validTime))}</div>
                                          </div>
                                          {
                                              tools.isWeixin() ? <div className={this.state.which === index ? 'flex-none share-btn check' : 'flex-none share-btn'} >分享</div> : null
                                          }
                                      </div>
                                  </li>;
                              });
                          }
                      })()
                  }
              </ul>
          </Luo>
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
    myCard: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    userinfo: state.app.userinfo,
      myCard: state.shop.myCard,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ mallCardList, wxInit, saveCardInfo, saveMyCardInfo }, dispatch),
  })
)(HomePageContainer);
