/* 健康管理 - 体检预约 */

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
import { DatePicker, Button, Toast } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgDh from '../../../../assets/daohang@3x.png';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dianhua@3x.png';
import ImgPhone from '../../../../assets/dizhi@3x.png';
import ImgCard from '../../../../assets/xuanzeka@3x.png';

// ==================
// 本页面所需action
// ==================

import { mallReserveSave } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        formDate: new Date(),   // 预约体检时间
    };
  }

  componentDidMount() {

  }


   onSubmit() {
      const p = this.props.preInfo;
      // 检查各必要的信息
       if(!p.name || !p.mobile) {
           Toast.fail('请填写体检人信息');
           return false;
       } else if (!p.stationId) {
           Toast.fail('请选择体检服务中心');
           // return false;
       }
      // 调用预约接口
        this.props.actions.mallReserveSave(tools.clearNull(p)).then((res) => {
            if(res.returnCode === '0') {
                Toast.success('预约成功');
                setTimeout(() => {
                    this.props.history.push('/healthy/mypre');
                }, 1000);
            } else {
                Toast.fail(res.returnMessaage || '服务器错误');
            }
        }).catch(() => {
            Toast.fail(res.returnMessaage || '服务器错误');
        });
   }

  render() {
    return (
      <div className="page-pre-check">
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item page-flex-row all_active" onClick={() => this.props.history.push('/healthy/chosecard')}>
                  <div className="title2">体检卡号：</div>
                  <div className="info2">{this.props.preInfo.code || ''}</div>
                  <div className="arrow2"><img src={ImgCard} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.props.history.push('/healthy/preinfo')}>
                  <div className="title">体检人信息</div>
                  <div className="info">{this.props.preInfo.name || ''}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.props.history.push('/healthy/choseservice')}>
                  <div className="title">选择体检服务中心</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
          </div>
          <ul className="card-ul">
              <li className="card-box page-flex-row">
                  <div className="l flex-auto">
                      <div className="title">上海市嘉定区翼猫体验服务中心</div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>姓名</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span>13600000000</span></div>
                      <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>上海市嘉定区南翔镇众人路399号B座1楼</span></div>
                  </div>
              </li>
          </ul>
          <div className="bar-list">
              <DatePicker
                  mode="datetime"
                  value={this.state.date}
                  minDate={new Date()}
                  onChange={date => this.setState({ formDate: date })}
              >
                  <div className="item page-flex-row all_active" >
                      <div className="title">选择体检时间</div>
                      <div className="info">{tools.dateToStrMin(this.state.formDate)}</div>
                      <div className="arrow"><img src={ImgRight} /></div>
                      <div className="line"/>
                  </div>
              </DatePicker>
          </div>
          <div className="thefooter">
              <Button type="primary" onClick={() => this.onSubmit()}>立即预约</Button>
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
    preInfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
    preInfo: state.shop.preInfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ mallReserveSave }, dispatch),
  })
)(HomePageContainer);
