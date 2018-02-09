/* 我的e家 - 我在翼猫 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import IScroll from 'iscroll';
import tools from '../../../../util/all';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { Button } from 'antd-mobile';
import ImgPutong from '../../../../assets/atCar/card_putong.png';
import ImgFenxiang from '../../../../assets/atCar/card_fenxiang.png';
import ImgFenxiao from '../../../../assets/atCar/card_fenxiao.png';
import ImgGeren from '../../../../assets/atCar/card_geren.png';
import ImgQiye from '../../../../assets/atCar/card_qiye.png';
import ImgWeichuang from '../../../../assets/atCar/card_weichuang.png';

import ImgDuiGou from '../../../../assets/duigou@3x.png';
import ImgA1 from '../../../../assets/one_yikatong@3x.png';
import ImgA2 from '../../../../assets/two_yikatong@3x.png';
import ImgB1 from '../../../../assets/one_jingshui@3x.png';
import ImgB2 from '../../../../assets/two_jingshui@3x.png';
import ImgC1 from '../../../../assets/one_shipin@3x.png';
import ImgC2 from '../../../../assets/two_shipin@3x.png';
import ImgD1 from '../../../../assets/one_liliao@3x.png';
import ImgD2 from '../../../../assets/two_liliao@3x.png';
import ImgE1 from '../../../../assets/one_pingguka@3x.png';
import ImgE2 from '../../../../assets/two_pingguka@3x.png';
// ==================
// 本页面所需action
// ==================

import { myAmbassador } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
    this.scrollDom = null;  // iscroll 实例，退出时需销毁
  }

  componentDidMount() {
    this.getMyAmbassador();
    setTimeout(() => {
        this.scrollDom = new IScroll('#scroll1', {
            scrollX: true,
            snap: true
        });
        // 滚动结束时，判断当前是哪一页
        this.scrollDom.on('scrollEnd', () => {
            this.setState({
                page: this.scrollDom.currentPage.pageX,
            });
        });
        this.init();
    }, 16);
  }

  componentWillUnmount() {
      document.title = '我在翼猫';
      this.scrollDom.destroy();
      this.scrollDom = null;
      console.log('USERINFO:', this.props.userinfo);
  }

  /** 进入页面初始化 **/
  init() {
      const u = this.props.userinfo;
      let page = 0;
      switch(u.userType) {
          case 0:
          case 4: page = 0;break;   // 体验版、普通用户
          case 3: page = 1;break;   // 分享用户
          case 7: page = 2;break;   // 分销用户
          case 1: page = 3;break;   // 微创版经销商
          case 2: page = 4;break;   // 个人版经销商
          case 5: page = 6;break;   // 企业版经销商（主）
          case 6: page = 5;break;   // 企业版经销商（子）
      }
      this.onScrollPageTo(page, 0);
  }

  // 点击iscroll下方的按钮，跳转到指定的页
    onScrollPageTo(page, time = 300) {
      this.setState({
          page,
      });
      this.scrollDom && this.scrollDom.goToPage(page, 1, time);
    }

    // 获取健康大使信息
    getMyAmbassador() {
        const u = this.props.userinfo;
        if (u && !this.props.ambassador) {
            this.props.actions.myAmbassador({ userId: u.id });
        }
    }

    /**
     * 产品分销权，亮还是不亮，真尼玛服了
     * @page: 当前处于哪一页，处于分销用户页时，需动态亮与不亮
     * @a: 亮的图片
     * @b: 不亮的图片
     * @type: 1-智能净水,2-健康食品,3-生物理疗,4-健康睡眠,5-健康体检
     * **/
    youWantLight(page, a, b, type){
      if([0, 1].includes(page)) {
          return b;
      } else if ([2].includes(page)) {  // 处于分销用户页
          const u = this.props.userinfo;
          const p = (u && u.incomePermission) ? u.incomePermission.split(',') : [];
          if (p.includes(String(type))) {
              return a;
          } else {
              return b;
          }
      } else {
          return a;
      }
    }

  render() {
    const u = this.props.userinfo || {};
    return (
      <div className="page-at-cat">
        <div className="iscroll-box">
          <div className="scroll" id="scroll1">
            <ul className="scroll-ul" style={{ width: '700%' }}>
              <li>
                <div style={{ backgroundImage: `url(${ImgPutong})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">普通用户</div>
                    {[4].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                    <div className="foot"><span>&#12288;</span>{[4].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                </div>
              </li>
                <li>
                    <div style={{ backgroundImage: `url(${ImgFenxiang})` }} className="page-flex-col flex-jc-sb">
                        <div className="t">分享用户</div>
                        {[3].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                        <div className="foot"><span>&#12288;</span>{[3].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                    </div>
                </li>
                <li>
                    <div style={{ backgroundImage: `url(${ImgFenxiao})` }} className="page-flex-col flex-jc-sb">
                        <div className="t">分销用户</div>
                        {[7].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                        <div className="foot"><span>&#12288;</span>{[7].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                    </div>
                </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgWeichuang})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">微创版经销商</div>
                    {[1].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                    <div className="foot"><span>&#12288;</span>{[1].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                </div>
              </li>
              <li>
                <div style={{ backgroundImage: `url(${ImgGeren})` }} className="page-flex-col flex-jc-sb">
                  <div className="t">个人版经销商</div>
                    {[2].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                    <div className="foot"><span>&#12288;</span>{[2].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                </div>
              </li>
                <li>
                    <div style={{ backgroundImage: `url(${ImgQiye})` }} className="page-flex-col flex-jc-sb">
                        <div className="t">企业版经销商(子账号)</div>
                        {[6].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                        <div className="foot"><span>&#12288;</span>{[6].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                    </div>
                </li>
                <li>
                    <div style={{ backgroundImage: `url(${ImgQiye})` }} className="page-flex-col flex-jc-sb">
                        <div className="t">企业版经销商(主账号)</div>
                        {[5].indexOf(u.userType) >= 0 ? <div className="u"><span>e家号：</span>{u.id}</div> : null}
                        <div className="foot"><span>&#12288;</span>{[5].indexOf(u.userType) >= 0 ? <img src={ImgDuiGou} /> : null}</div>
                    </div>
                </li>
            </ul>
          </div>
        </div>
        <div className="scroll-btns page-flex-row flex-jc-center">
          <div className={this.state.page === 0 ? 'check' : ''} onClick={() => this.onScrollPageTo(0)}/>
          <div className={this.state.page === 1 ? 'check' : ''} onClick={() => this.onScrollPageTo(1)}/>
          <div className={this.state.page === 2 ? 'check' : ''} onClick={() => this.onScrollPageTo(2)}/>
          <div className={this.state.page === 3 ? 'check' : ''} onClick={() => this.onScrollPageTo(3)}/>
          <div className={this.state.page === 4 ? 'check' : ''} onClick={() => this.onScrollPageTo(4)}/>
          <div className={this.state.page === 5 ? 'check' : ''} onClick={() => this.onScrollPageTo(5)}/>
          <div className={this.state.page === 6 ? 'check' : ''} onClick={() => this.onScrollPageTo(6)}/>
        </div>
        <div className="info-all-box">
            <div className="card1">
                <div className="title"><span>商城产品购买权</span></div>
                <ul className="ul page-flex-row">
                    <li>
                        <img src={[1,2,3,4,5,6].includes(this.state.page) ? ImgB1 : ImgB2} />
                        <div>净水服务</div>
                    </li>
                    <li>
                        <img src={[1,2,3,4,5,6].includes(this.state.page) ? ImgC1 : ImgC2} />
                        <div>健康食品</div>
                    </li>
                    <li>
                        <img src={[1,2,3,4,5,6].includes(this.state.page) ? ImgD1 : ImgD2} />
                        <div>生物理疗</div>
                    </li>
                    <li>
                        <img src={[1,2,3,4,5,6].includes(this.state.page) ? ImgE1 : ImgE2} />
                        <div>健康评估</div>
                    </li>
                </ul>
            </div>
            <div className="card1">
                <div className="title"><span>产品分销权</span></div>
                <ul className="ul page-flex-row" key='1'>
                    <li>
                        <img src={this.youWantLight(this.state.page, ImgB1, ImgB2, 1)} />
                        <div>净水服务</div>
                    </li>
                    <li>
                        <img src={this.youWantLight(this.state.page, ImgC1, ImgC2, 2)} />
                        <div>健康食品</div>
                    </li>
                    <li>
                        <img src={this.youWantLight(this.state.page, ImgD1, ImgD2, 3)} />
                        <div>生物理疗</div>
                    </li>
                    <li>
                        <img src={this.youWantLight(this.state.page, ImgE1, ImgE2, 5)} />
                        <div>健康评估</div>
                    </li>
                </ul>
            </div>
            {(() => {
                switch(this.state.page) {
                    case 0: return (
                        <div className="card1">
                            <div className="title"><span>用户说明</span></div>
                            <div className="info">1.普通用户：普通用户是指健康大使不是翼猫经销商或间接不是翼猫经销商的用户。</div>
                            <div className="info">2.商城产品购买权：在没有翼猫经销商作为健康大使的指导和帮助下，我们不建议在翼猫健康商城直接购买产品，请到附近的翼猫体验服务站体验后再购买。</div>
                            <div className="info">3.商城产品分销权：不具有翼猫健康商城产品分销权，成为翼猫分销用户或经销商后，才拥有商城产品的分销、经销权。</div>
                            <div className="info">4.用户升级：请您到附近的翼猫体验服务站，了解如何成为分享用户、分销用户或翼猫经销商。</div>
                        </div>
                    );
                    case 1: return (
                        <div className="card1">
                            <div className="title"><span>用户说明</span></div>
                            <div className="info">1.分享用户：分享用户是指翼猫经销商直接或间接分享二维码创建的用户。</div>
                            <div className="info">2.商城产品购买权：可以在线购买翼猫健康商城中的所有产品。</div>
                            <div className="info">3.商城产品分销权：不具有商城产品分销权，成为分销用户或经销商，才拥有商城产品分销、经销权。</div>
                            <div className="info">4.用户升级：分享用户在翼猫健康商城中购买任意一款产品后，即可自动升级为分销用户，享受该系列产品的分销权，享受分销收益。</div>
                        </div>
                    );
                    case 2: return (
                        <div className="card1">
                            <div className="title"><span>用户说明</span></div>
                            <div className="info">1. 分销用户：分享用户在商城购买任一款产品后就变成分销用户，分销用户可以帮助翼猫经销商分销产品，享受分销收益。</div>
                            <div className="info">2. 商城产品购买权：可以在线购买翼猫健康商城中的所有产品。</div>
                            <div className="info">3. 商城产品分销权：</div>
                            <div className="info">分销用户可分销某产品系列的所有产品，并享受分销收益。</div>
                            <div className="info">自己多次购买产品不享受分销折扣，分销给他人才能享受分销收益。</div>
                            <div className="info">4.用户升级：分销用户想成为翼猫经销商，请您到附近的翼猫体验服务站咨询，稍后我们支持在线升级为翼猫经销商，享受产品经销收益。</div>
                        </div>
                    );
                    case 3: return (
                        <div className="card1">
                            <div className="title"><span>用户说明</span></div>
                            <div className="info">1. 微创版经销商：仅需加盟费¥2980元即可成为翼猫微创版经销商。</div>
                            <div className="info">2. 商城产品购买权：可以在线购买翼猫健康商城中的所有产品。</div>
                            <div className="info">3. 商城产品分销权：</div>
                            <div className="info">具有经销翼猫智能净水服务的权利，并可发展分销用户协助分销翼猫净水服务，能按翼猫微创版经销商政策享受净水服务的收益。</div>
                            <div className="info">4.用户升级：稍后我们支持在线升级为个人版经销商，享受个人版经销商产品经销权益。</div>
                        </div>
                    );
                    case 4: return (
                        <div className="card1">
                            <div className="title"><span>用户说明</span></div>
                            <div className="info">1. 个人版经销商：需加盟费¥29800元成为个人版经销商。</div>
                            <div className="info">2. 商城产品购买权：可以在线购买翼猫健康商城中的所有产品。</div>
                            <div className="info">3. 商城产品分销权：</div>
                            <div className="info">具有经销翼猫健康商城中所有产品的权利，并可发展分销用户协助分销翼猫商城中所有产品，能按翼猫个人版经销商政策享受产品经销代理收益。</div>
                        </div>
                    );
                    case 5: return (
                        <div className="card1">
                            <div className="title"><span>用户说明</span></div>
                            <div className="info">1. 企业版经销商（子账户）：企业版经销商主账户分出来的的子账户。</div>
                            <div className="info">2. 商城产品购买权：可以在线购买翼猫健康商城中的所有产品。</div>
                            <div className="info">3. 商城产品分销权：</div>
                            <div className="info">可发展分销用户协助分销翼猫商城中所有产品，并由企业版主账户自行分配收益。</div>
                        </div>
                    );
                    case 6: return (
                        <div className="card1">
                            <div className="title"><span>用户说明</span></div>
                            <div className="info">1. 企业版经销商（主账户）：需加盟费¥59800元成为企业版经销商。</div>
                            <div className="info">2. 商城产品购买权：可以在线购买翼猫健康商城中的所有产品。</div>
                            <div className="info">3. 商城产品分销权：</div>
                            <div className="info">可以分销商城中的所有产品，并可按翼猫企业版经销商政策享受产品经销代理收益。</div>
                            <div className="info">可以自主发展子账户，由子账户分销翼猫商城产品。</div>
                            <div className="info">可以发展分销用户协助分销翼猫商城中所有产品。</div>
                        </div>
                    );
                }
            })()}
        </div>
          {
              [0,1].includes(this.state.page) ? (
                  <div className="thefooter">
                      <Button type="primary" onClick={() => this.props.history.push('/shop/exprshop2')}>查看翼猫体验服务中心</Button>
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
    actions: bindActionCreators({ myAmbassador }, dispatch),
  })
)(HomePageContainer);
