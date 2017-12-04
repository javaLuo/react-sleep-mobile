/* 健康管理 - 体检人信息 */

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
import { DatePicker, Button, Modal, Toast, Picker } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgCard from '../../../../assets/xuanzeka@3x.png';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
const prompt = Modal.prompt;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        formDate: undefined,   // 出生日期
        formName: '',           // 体检人姓名
        formPhone: '',          // 设置手机号
        formSex: '1',           // 性别
        formTall: '',           // 身高
        formWeight: '',         // 体重
    };
  }

  // 设置体检人姓名
  setName() {
      prompt('输入姓名', '', [
          { text: '取消' },
          { text: '确定', onPress: value => {
              const v = tools.trim(value);
              if(!v){Toast.info('姓名不能为空',1);return false;}
              else if(v.length>12){Toast.info('做多输入12个字符',1);return false;}
              this.setState({formName: v});
          }},
      ]);
  }

  // 设置手机号
   setPhone() {
       prompt('输入手机号', '', [
           { text: '取消' },
           { text: '确定', onPress: value => {
               const v = tools.trim(value);
               if(!tools.checkPhone(v)){Toast.info('请输入有效手机号',1);return false;}
               this.setState({formPhone: v});
           }},
       ]);
   }

   // 设置身高
    setTall() {
        prompt('输入身高(cm)', '', [
            { text: '取消' },
            { text: '确定', onPress: value => {
                const v = Number(tools.trim(value));
                if(!v || v<0 || v>300){Toast.info('请输入有效身高',1);return false;}
                this.setState({formTall: v});
            }},
        ]);
    }

    // 设置体重
    setWeight() {
        prompt('输入体重(kg)', '', [
            { text: '取消' },
            { text: '确定', onPress: value => {
                const v = Number(tools.trim(value));
                if(!v || v<0 || v>500){Toast.info('请输入有效体重',1);return false;}
                this.setState({formWeight: v});
            }},
        ]);
    }
  render() {
    return (
      <div className="page-pre-info">
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item page-flex-row all_active">
                  <div className="title2">体检卡号：</div>
                  <div className="info2">90807327422533</div>
                  <div className="arrow2"><img src={ImgCard} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.setName()}>
                  <div className="title2">体检人姓名：</div>
                  <div className="info2">{this.state.formName}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.setPhone()}>
                  <div className="title2">手机号：</div>
                  <div className="info2">{this.state.formPhone}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <DatePicker
                  mode="date"
                  value={this.state.date}
                  minDate={new Date('1900-01-01')}
                  onChange={date => this.setState({ formDate: date })}
              >
                  <div className="item page-flex-row all_active mt" >
                      <div className="title">出生日期</div>
                      <div className="info">{tools.dateformart(this.state.formDate)}</div>
                      <div className="arrow"><img src={ImgRight} /></div>
                      <div className="line"/>
                  </div>
              </DatePicker>
              <Picker
                data={[
                    { value: '1', label: '男' },
                    { value: '0', label: '女' },
                ]}
                cols={1}
                onOk={v => this.setState({ formSex: v })}
              >
                  <div className="item page-flex-row all_active">
                      <div className="title">性别</div>
                      <div className="info">{this.state.formSex === '1' ? '男' : '女'}</div>
                      <div className="arrow"><img src={ImgRight} /></div>
                      <div className="line"/>
                  </div>
              </Picker>
              <div className="item page-flex-row all_active" onClick={() => this.setTall()}>
                  <div className="title">身高</div>
                  <div className="info">{this.state.formTall ? `${this.state.formTall}cm` : null}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.setWeight()}>
                  <div className="title">体重</div>
                  <div className="info">{this.state.formWeight ? `${this.state.formWeight}kg` : null}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
          </div>
          <div className="thefooter">
              <Button type="primary">保存</Button>
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
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({

  }), 
  (dispatch) => ({
    actions: bindActionCreators({}, dispatch),
  })
)(HomePageContainer);
