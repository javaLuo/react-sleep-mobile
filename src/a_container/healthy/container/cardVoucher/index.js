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
import { Toast, SwipeAction, Modal } from 'antd-mobile';
import Config from '../../../../config';

// ==================
// 本页面所需action
// ==================

import { wxInit, mallCardListQuan, mallQuanDel } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],   // 体检券数据
        wxReady: true, // 微信是否已初始化
        shareShow: false,   // 分享提示框是否显示
    };
  }

  componentDidMount() {
      document.title = '体检券';
      this.getData();
      this.initWeiXinPay();
  }

  // 工具 - 获取已使用了多少张卡
    getHowManyByTicket(list) {
      if (!list){ return 0; }
      return list.filter((item) => item.ticketStatus !== 1).length;
    }

    // 获取数据
    getData() {
      let id = this.props.location.pathname.split('/');
      id = id[id.length - 1];
      this.props.actions.mallCardListQuan({ cardId: id, pageNum: 1, pageSize: 99 }).then((res) => {
          if (res.status === 200) {
              this.setState({
                  data: res.data.result || [],
              });
          } else {
              Toast.fail(res.message || '获取体检券失败，请重试');
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
          alert('确认赠送?','赠送后您的券将转移给对方，您将无法再查看该券', [
              { text: '取消', onPress: () => console.log('cancel') },
              { text: '确认', onPress: () => new Promise((resolve, rej) => {
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
                  resolve();
              })},
          ]);
      }
    }

    // 删除体检券
    onDelete(item) {
      console.log('删除体检券', item);
        alert('确认删除体检券?', '删除后将无法再查看该体检券', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确认',
                onPress: () => new Promise((resolve, rej) => {
                    this.props.actions.mallQuanDel({ ticketId: item.id }).then((res) =>{
                        if (res.status === 200) {
                            Toast.success('删除成功');
                            this.getData();
                        } else {
                            Toast.fail(res.message || '删除失败，请重试');
                        }
                        resolve();
                    }).catch(() => {
                        rej();
                    });
                }),
            },
        ]);
    }
  render() {
      const ticket = this.state.data;
    return (
      <div className="page-card-voucher">
          <div className="the-ul">
              {
                  ticket.map((item, index) => {
                      return (
                          <SwipeAction
                              style={{ backgroundColor: '#F4333C' }}
                              key={index}
                              autoClose
                              right={[
                                  {
                                      text: '删除',
                                      onPress: () => this.onDelete(item),
                                      style: { backgroundColor: '#F4333C', color: 'white' },
                                  },
                              ]}
                          >
                              <div  key={index} className="cardbox page-flex-col flex-jc-sb">
                                  <div className="row1 flex-none page-flex-row flex-jc-sb">
                                      <div>
                                          <div className="t"> </div>
                                      </div>
                                      <div className="flex-none">{String(item.ticketStatus) === '1' ? '未使用' : '已使用'}</div>
                                  </div>
                                  <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end" onClick={() => this.onStartShare(item, index)}>
                                      <div>
                                          <div className="t">卡号<span>{tools.cardFormart(item.ticketNo)}</span></div>
                                          <div className="i">有效期至：{item.validEndTime ? item.validEndTime.split(' ')[0] : ''}</div>
                                      </div>
                                      {
                                          tools.isWeixin() ? <div className={ this.state.which === index ? 'flex-none share-btn check' : 'flex-none share-btn'}>赠送</div> : null
                                      }

                                  </div>
                              </div>
                          </SwipeAction>
                      );
                  })
              }
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
    actions: bindActionCreators({ wxInit, mallCardListQuan, mallQuanDel }, dispatch),
  })
)(HomePageContainer);
