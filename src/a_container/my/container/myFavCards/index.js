/*  我的优惠卡 */

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
import ImgShareArr from '../../../../assets/share-arr.png';
import Img404 from '../../../../assets/not-found.png';
import ImgGuoQi from '../../../../assets/share/yiguoqi@3x.png';
import ImgShiYong from '../../../../assets/share/yishiyong@3x.png';
import { Toast, SwipeAction,List,Modal } from 'antd-mobile';
import Config from '../../../../config';

// ==================
// 本页面所需action
// ==================

import { wxInit, queryListFree, saveFreeCardInfo, ticketHandsel } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
const Item = List.Item;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        wxReady: true, // 微信是否已初始化
        shareShow: false,   // 分享提示框是否显示
        which: -1,  // 当前选中哪一个进行分享
        pageNum: 1,
        pageSize: 10,
        total: 0,   // 总数
        search: null,
    };
  }

  componentDidMount() {
      document.title = '我的优惠卡';
      let p = this.props.location.pathname.split('/');
      p = p[p.length - 1];
      const arr = p.split('_');
      let search = null;
      if (arr[0] === 'fav') {   // 来自我的订单优惠卡点击进入
          search = arr[1];
      }
      console.log('searh是什么：', this.props.location, search);
      this.getData(this.state.pageNum, this.state.pageSize, 'flash', search);
      this.setState({
          search,
      });
      this.initWeiXinPay();
  }


  /**
   * 获取体检卡列表
   * type=falsh 刷新
   * type=update 累加
   * **/
  getData(pageNum = 1, pageSize = 10, type = 'flash', search = null) {
      console.log('searh是什么2：', this.props.location, search);
      const u = this.props.userinfo || {};
      const params = {
          userId: u.id,
          pageNum,
          pageSize,
          orderId: search,
      };
      this.props.actions.queryListFree(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                console.log('我的优惠卡：', res.data.result);
                if (!res.data || !res.data.result || res.data.result.length === 0) {
                    if (type === 'update') {
                        Toast.info('没有更多数据了', 1);
                    } else{
                      Toast.hide();
                  }
                    this.setState({
                        data: type === 'flash' ? [] : this.state.data,
                        total: type === 'flash' ? 0 : this.state.total,
                    });
                    return;
                }
                this.setState({
                    data: type === 'flash' ? res.data.result : [...this.state.data, ...res.data.result],
                    total: res.data.total,
                    pageNum,
                    pageSize,
                });
            } else {
                Toast.info(res.message || '数据加载失败', 1);
                this.setState({
                    data: type === 'flash' ? [] : this.state.data,
                    total: type === 'flash' ? 0 : this.state.total,
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
            // 如果没有点选，就分享主页
            wx.onMenuShareAppMessage({
                title: '翼猫健康e家',
                desc: '欢迎关注 - 翼猫健康e家 专注疾病早期筛查',
                link: `${Config.baseURL}/gzh`,
                imgUrl: 'http://isluo.com/work/logo/share_card.png',
                type: 'link',
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });
            wx.onMenuShareTimeline({
                title: '翼猫健康e家',
                desc: '欢迎关注 - 翼猫健康e家 专注疾病早期筛查',
                link: `${Config.baseURL}/gzh`,
                imgUrl: 'http://isluo.com/work/logo/share_card.png',
                success: () => {
                    Toast.info('分享成功', 1);
                }
            });
        });
        wx.error((e) => {
            console.log('微信JS-SDK初始化失败：', e);
            this.onFail();
        });
    }

    // 点击分享按钮，需判断是否是原生系统
    onStartShare(obj, index, e) {
      e.stopPropagation();
      const me = this;
      console.log('要分享的信息：', obj);
      if(tools.isWeixin() && obj.handsel) { // 是微信中并且卡的状态正常才能分享
          alert('确认赠送?', '赠送后您的卡将转移给对方，您将无法再查看该卡', [
              { text: '取消', onPress: () => console.log('cancel') },
              {
                  text: '确认',
                  onPress: () => new Promise((resolve, rej) => {
                      /**
                       * 拼凑要带过去的数据
                       * 用户ID_共几张_价格_有效期_头像
                       * userId: p[0],
                       name: p[1],
                       head: p[2],
                       no: p[3],
                       date: p[4],
                       type: p[5] 1未使用，2已使用，3已禁用，4过期
                       * **/
                      const u = this.props.userinfo;
                      const dateTime = new Date().getTime();
                      const str = `${u.id}_${encodeURIComponent(u.nickName)}_${encodeURIComponent(u.headImg)}_${obj.ticketNo}_${encodeURIComponent(obj.validEndTime.split(' ')[0])}_${dateTime}`;
                      wx.onMenuShareAppMessage({
                          title: `${u.nickName}赠送您一张翼猫HRA健康风险评估优惠卡`,
                          desc: '请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。',
                          link: `${Config.baseURL}/gzh/?#/sharefreecard/${str}`,
                          imgUrl: 'http://isluo.com/work/logo/share_card.png',
                          type: 'link',
                          success: () => {
                              Toast.info('分享成功', 1);
                              me.ticketHandsel({ userId: u.id, shareType: 2, shareNo: obj.ticketNo, dateTime });
                          }
                      });
                      wx.onMenuShareTimeline({
                          title: `${u.nickName}赠送您一张翼猫HRA健康风险评估优惠卡`,
                          desc: '请您在奋斗的时候不要忘记家人身体健康，关注疾病早期筛查和预防。',
                          link: `${Config.baseURL}/gzh/?#/sharefreecard/${str}`,
                          imgUrl: 'http://isluo.com/work/logo/share_card.png',
                          success: () => {
                              Toast.info('分享成功', 1);
                              me.ticketHandsel({ userId: u.id, shareType: 2, shareNo: obj.ticketNo, dateTime });
                          }
                      });
                      this.setState({
                          shareShow: true,
                          which: index,
                      });
                      resolve();
                  }),
              },
          ]);
      }
    }

    // 分享成功后还要调个接口更改状态
    ticketHandsel(params) {
        this.props.actions.ticketHandsel(params).then((res) => {
            if (res.status === 200) {
                this.onDown();
            }
        });
    }

    // 下拉刷新
    onDown() {
        this.getData(1, this.state.pageSize, 'flash', this.state.search);
    }
    // 上拉加载
    onUp() {
      this.getData(this.state.pageNum + 1, this.state.pageSize, 'update', this.state.search);
    }

    // 工具 - 判断当前体检卡状态（正常1、过期2、已使用3）
    checkCardStatus(item) {
      try{
          if (item.ticketStatus === 4) {   // 已过期
              return 2;
          } else if (item.ticketStatus === 2) {   // 已使用
              return 3;
          }
          return 1;
      }catch(e){
          return 1;
      }
    }

    // 点击一张体检卡
    onCardClick(item) {
      this.props.actions.saveFreeCardInfo(item);    // 保存该张卡信息，下个页面要用
      setTimeout(() => this.props.history.push(`/my/favcardsdetail`), 16);
    }

  render() {
    return (
      <div className="page-myfavcards">
          <List>
              <Item extra={`总计：${this.state.total}张`}>优惠卡</Item>
          </List>
          <div className="luo-box">
          <Luo
            id="luo1"
            className="touch-none"
            onPullDownRefresh={() => this.onDown()}
            onPullUpLoadMore={() => this.onUp()}
            iscrollOptions={{
                disableMouse: true,

            }}
          >
              <div className="the-ul">
                  {
                      (() => {
                         if (this.state.data.length === 0) {
                              return <div key={0} className="data-nothing">
                                  <img src={Img404}/>
                                  <div>亲，这里什么也没有哦~</div>
                              </div>;
                          } else {
                              return this.state.data.map((item, index) => {
                                  return (
                                      <div key={index} className={this.checkCardStatus(item) === 1 ? 'cardbox page-flex-col flex-jc-sb' : 'cardbox abnormal page-flex-col flex-jc-sb'} onClick={() => this.onCardClick(item)}>
                                          <div className="row1 flex-none page-flex-row flex-jc-sb" >
                                              <div>
                                                  <div className="t" />
                                              </div>
                                              {(() => {
                                                  const type = this.checkCardStatus(item);
                                                  if (type === 2) {   // 已过期
                                                      return <img className="tip" src={ImgGuoQi} />;
                                                  } else if (type === 3) {   // 已使用
                                                      return <img className="tip" src={ImgShiYong} />;
                                                  }
                                                  return <div className="flex-none">{item.handselStatus === 1 ? '赠送中 ' : null}<img src={ImgRight} /></div>;
                                              })()}
                                          </div>
                                          <div className="row-center page-flex-row flex-jc-end">
                                          </div>
                                          <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end" onClick={(e) => this.onStartShare(item, index, e)}>
                                              <div>
                                                  <div className="t">卡号：{tools.cardFormart(item.ticketNo)}</div>
                                                  <div className="i">有效期至：{item.validEndTime ? item.validEndTime.split(' ')[0] : ''}</div>
                                              </div>
                                              <div>
                                                  <div className="money">￥1000</div>
                                                  {
                                                      tools.isWeixin() && item.handsel ? <div className={ this.state.which === index ? 'flex-none share-btn check' : 'flex-none share-btn'}>赠送</div> : null
                                                  }
                                              </div>
                                          </div>
                                      </div>
                                  );
                              });
                          }
                      })()
                  }
              </div>
          </Luo>
          </div>
          <div className={this.state.shareShow ? 'share-modal' : 'share-modal hide'} onClick={() => this.setState({ shareShow: false })}>
              <img className="share" src={ImgShareArr} />
              <div className="title">点击右上角进行赠送</div>
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
    actions: bindActionCreators({ wxInit, queryListFree, saveFreeCardInfo, ticketHandsel }, dispatch),
  })
)(HomePageContainer);
