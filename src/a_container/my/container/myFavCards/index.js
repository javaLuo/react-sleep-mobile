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
import _ from 'lodash';
// ==================
// 所需的所有组件
// ==================
import Luo from 'iscroll-luo';
import ImgRight from '../../../../assets/xiangyou2@3x.png';
import ImgShareArr from '../../../../assets/share-arr.png';
import Img404 from '../../../../assets/not-found.png';
import ImgGuoQi from '../../../../assets/favcards/guoqi@3x.png';
import ImgShiYong from '../../../../assets/favcards/shiyong@3x.png';
import { Tabs, Toast,List,Modal,Badge } from 'antd-mobile';
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
        data: [
            { title: '未使用', data: [], type: 1, badge: true, pageNum: 1, total: 0 },
            { title: '已使用', data: [], type: 2, badge: true, pageNum: 1, total: 0 },
            { title: '待付款', data: [], type: 3, badge: true, pageNum: 1, total: 0 },
            { title: '已赠出', data: [], type: 5, badge: true, pageNum: 1, total: 0 },
            { title: '已过期', data: [], type: 4, badge: true, pageNum: 1, total: 0 },
        ],
        pageSize: 10,
        wxReady: true, // 微信是否已初始化
        shareShow: false,   // 分享提示框是否显示
        which: -1,  // 当前选中哪一个进行分享
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
      this.getData(1, this.state.pageSize, 'flash', search, 1);
      this.setState({
          search,
      });
      this.initWeiXinPay();
  }

    componentWillUnmount() {
      Toast.hide();
    }

    /**
     * 获取数据
     * @param pageNum
     * @param pageSize
     * @param type flash刷新，update加载更多
     * @param search 来自我的订单优惠卡查询，会有值
     * @param which 是哪一个tab页获取数据
     */
  getData(pageNum = 1, pageSize = 10, type = 'flash', search = null, which = 1) {
      console.log('searh是什么2：', this.props.location, search);
      const u = this.props.userinfo || {};
      const params = {
          userId: u.id,
          pageNum,
          pageSize,
          orderId: search,
          ticketStatus: which,
      };
      Toast.loading('请稍后...', 0);
      this.props.actions.queryListFree(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                if (!res.data || !res.data.result || res.data.result.length === 0) {
                    if (type === 'update') {
                        Toast.info('没有更多数据了', 1);
                    } else{
                      Toast.hide();
                  }
                    this.setState({
                        data: this.state.data,
                    });
                    return;
                }

                // 获得是哪一个tab的数据
                const temp = _.cloneDeep(this.state.data);
                for(let i=0; i<temp.length; i++){
                    if(temp[i].type === which) {
                        temp[i].data = type === 'flash' ? res.data.result : [...temp[i].data, ...res.data.result];
                        temp[i].pageNum = pageNum;
                        temp[i].total = res.data.total;
                        break;
                    }
                }
                this.setState({
                    data: temp,
                });
                Toast.hide();
            } else {
                Toast.info(res.message || '数据加载失败', 1);
                this.setState({
                    data: this.state.data,
                });
            }
      }).catch(() => {
          Toast.hide();
      });
  }

  // Tab切换时触发
    onTabsChange(tab, index) {
      const which = tab.type;
      const t = this.state.data.find((item) => item.type === which);
      console.log('来了吗：', tab, index, t, which);
      if(t.data.length === 0) {
          this.getData(1, this.state.pageSize, 'flash', this.state.search, which);
      }
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
    onStartShare(obj, indexSrc, e) {
      e.stopPropagation();
      const me = this;
      if(tools.isWeixin() && obj.handsel) { // 是微信中并且卡的状态正常才能分享
          alert('确认赠送?', '赠送后您的卡将转移给对方，您将无法再查看该卡，该赠送24小时内有效', [
              { text: '取消', onPress: () => console.log('cancel') },
              {
                  text: '确认',
                  onPress: () => new Promise((resolve, rej) => {
                      /**
                       * 拼凑要带过去的数据
                       * 用户ID_昵称_头像_有效期_分享日期_卡类型_类型信息
                       * userId: p[0],
                       name: p[1],
                       head: p[2],
                       date: p[3],  有效期
                       dateTime: p[4], 分享日期
                       type: P[5] 1金卡，2紫卡，3普通卡
                       str: p[6] 金卡为公司名，紫卡为“分销版”，普通卡没有
                       * **/
                      const u = this.props.userinfo;
                      const dateTime = new Date().getTime();
                      const str = `${u.id}_fff_${encodeURIComponent(u.nickName)}_fff_${encodeURIComponent(u.headImg)}_fff_${encodeURIComponent(obj.validEndTime.split(' ')[0])}_fff_${dateTime}_fff_${obj.ticketStyle}_fff_${encodeURIComponent(obj.ticketContent)}`;
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
                          which: indexSrc,
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
    onDown(which) {
        this.getData(1, this.state.pageSize, 'flash', this.state.search, which);
    }
    // 上拉加载
    onUp(which) {
      // 先得到该第几页了
      const t = this.state.data.find((item)=>item.type === which) || {};
      this.getData(Number(t.pageNum + 1) || 1, this.state.pageSize, 'update', this.state.search, which);
    }

    // 工具 - 判断当前评估卡状态（正常1、过期2、已使用3）
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

    // 点击一张评估卡
    onCardClick(item) {
      this.props.actions.saveFreeCardInfo(item);    // 保存该张卡信息，下个页面要用
      setTimeout(() => this.props.history.push(`/my/favcardsdetail`), 16);
    }

  render() {
    return (
      <div className="page-myfavcards">
              <Tabs
                  tabs={this.state.data.map((item)=> ({ title: <Badge className="tabs-bars-div"><div>{ item.title }</div><div>{ item.data.length }</div></Badge>, type: item.type }))}
                  swipeable={false}
                  onChange={(tab, index) => this.onTabsChange(tab, index)}
              >
                  {
                      this.state.data.map((item, index)=>{
                        return (
                            <div key={index} className="tabs-div">
                                <Luo
                                    id={`luo-${index}`}
                                    className="touch-none"
                                    onDown={() => this.onDown(item.type)}
                                    onUp={() => this.onUp(item.type)}
                                    iscrollOptions={{
                                        disableMouse: true,
                                    }}
                                >
                                    <div className="the-ul">
                                        {
                                            (() => {
                                                if (item.data.length === 0) {
                                                    return <div key={0} className="data-nothing">
                                                        <img src={Img404}/>
                                                        <div>亲，这里什么也没有哦~</div>
                                                    </div>;
                                                } else {
                                                    return item.data.map((item_son, index_son) => {
                                                        return (
                                                            <div key={index_son} className={(()=>{
                                                                const classNames = ['cardbox', 'page-flex-col','flex-jc-sb'];
                                                                if(this.checkCardStatus(item_son) !== 1){
                                                                    classNames.push('abnormal');
                                                                }
                                                                switch(item_son.ticketStyle){
                                                                    case 1: classNames.push('a');break;
                                                                    case 2: classNames.push('b');break;
                                                                }
                                                                return classNames.join(' ');
                                                            })()} onClick={() => this.onCardClick(item_son)}>
                                                                <div className="row1 flex-none page-flex-row flex-jc-sb" >
                                                                    <div>
                                                                        <div className="t" />
                                                                    </div>
                                                                    {(() => {
                                                                        const type = this.checkCardStatus(item_son);
                                                                        if (type === 2) {   // 已过期
                                                                            return <img className="tip" src={ImgGuoQi} />;
                                                                        } else if (type === 3) {   // 已使用
                                                                            return <img className="tip" src={ImgShiYong} />;
                                                                        }
                                                                        return <div className="flex-none">{item_son.handselStatus === 1 ? '赠送中 ' : null}<img src={ImgRight} /></div>;
                                                                    })()}
                                                                </div>
                                                                <div className="row-center all_nowarp">{(()=>{
                                                                    switch(item_son.ticketStyle){
                                                                        case 1: return item_son.ticketContent;
                                                                        case 2: return '乐享卡';
                                                                        case 3: return '乐购卡';
                                                                        default: return '';
                                                                    }
                                                                })()}</div>
                                                                <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end" onClick={(e) => this.onStartShare(item_son, `${index}_${index_son}`, e)}>
                                                                    <div>
                                                                        <div className="t">卡号：{tools.cardFormart(item_son.ticketNo)}</div>
                                                                        <div className="i">有效期至：{item_son.validEndTime ? item_son.validEndTime.split(' ')[0] : ''}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="money">￥1000</div>
                                                                        {
                                                                            item_son.handsel ? <div className={ this.state.which === `${index}_${index_son}` ? 'flex-none share-btn check' : 'flex-none share-btn'}>赠送</div> : null
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
                        );
                      })
                  }
              </Tabs>
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
