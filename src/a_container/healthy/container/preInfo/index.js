/* 健康管理 - 填写体检人信息 */

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

// ==================
// 本页面所需action
// ==================

import { savePreInfo } from '../../../../a_action/shop-action';

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

  componentDidMount() {
      const p = this.props.preInfo;
      console.log('是什么：', p);
      this.setState({
          formName: p.name,
          formPhone: p.mobile,
          formSex: String(p.sex),
          formTall: p.height,
          formWeight: p.weight,
      });
  }

  componentWillReceiveProps(nextP) {
      if (nextP.preInfo !== this.props.preInfo) {
          const p = nextP.preInfo;
          this.setState({
              formName: p.name,
              formPhone: p.mobile,
              formSex: String(p.sex),
              formTall: p.height,
              formWeight: p.weight,
          });
      }
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

    // 保存
    savePreInfo() {
      if (!this.state.formName) {
          Toast.fail('请输入体检人姓名');
          return;
      } else if (!tools.checkPhone(this.state.formPhone)) {
          Toast.fail('请输入正确的手机号');
          return;
      }
      this.props.actions.savePreInfo({
          name: this.state.formName,
          mobile: this.state.formPhone,
          sex: Number(this.state.formSex),
          height: Number(this.state.formTall),
          weight: Number(this.state.formWeight),
      });
      setTimeout(() => {
          this.props.history.push('/healthy/precheck');
      }, 16);
    }

  render() {
    return (
      <div className="page-pre-info">
          {/* 下方各横块 */}
          <div className="bar-list">
              <div className="item page-flex-row all_active" onClick={() => this.setName()}>
                  <div className="title2">姓名：</div>
                  <div className="info">{this.state.formName}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              <div className="item page-flex-row all_active" onClick={() => this.setPhone()}>
                  <div className="title2">手机号：</div>
                  <div className="info">{this.state.formPhone}</div>
                  <div className="arrow"><img src={ImgRight} /></div>
                  <div className="line"/>
              </div>
              {/* 接口无此字段 */}
              {/*<DatePicker*/}
                  {/*mode="date"*/}
                  {/*value={this.state.date}*/}
                  {/*minDate={new Date('1900-01-01')}*/}
                  {/*onChange={date => this.setState({ formDate: date })}*/}
              {/*>*/}
                  {/*<div className="item page-flex-row all_active mt" >*/}
                      {/*<div className="title">出生日期</div>*/}
                      {/*<div className="info">{tools.dateformart(this.state.formDate)}</div>*/}
                      {/*<div className="arrow"><img src={ImgRight} /></div>*/}
                      {/*<div className="line"/>*/}
                  {/*</div>*/}
              {/*</DatePicker>*/}
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
              <Button type="primary" onClick={() => this.savePreInfo()}>保存</Button>
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
    actions: bindActionCreators({ savePreInfo }, dispatch),
  })
)(HomePageContainer);
