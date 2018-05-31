/* 经销商加盟页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import config from '../../../../config';
// ==================
// 所需的所有组件
// ==================
import { Toast, Picker} from 'antd-mobile';
import tools from '../../../../util/all';
import ImgClose from './assets/close@3x.png';
import ImgPeople from './assets/people@3x.png';
import ImgPhone from './assets/phone@3x.png';

// ==================
// 本页面所需action
// ==================

import { getUserInfo, myAmbassador, getAreaList } from '../../../../a_action/app-action';
import { getMyCustomersCount,  } from '../../../../a_action/shop-action';
import { customerMessage,getAreaManagerByArea, getAllJMType } from '../../../../a_action/new-action';
// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceData: [], // 所有省市数据（层级）
            allJM: [],  // 所有的加盟类型
            btn1Show: false,
            btn2Show: false,
            form1Name: "",  // 姓名
            form1Phone: "", // 手机
            form1Area: undefined, // 加盟区域
            form1Type: undefined, // 加盟类型
            form1Words: "", // 留言内容
            form2Area: undefined,   // form2 加盟区域
            areaFuckerInfo: null,   // 区域经理信息
            url: null, // URL地址
        };
    }

    componentDidMount() {
        document.title = '经销商加盟';
        this.init();
        if (!this.props.userinfo) {
            this.getUserInfo();
        }
        if (!this.props.areaData.length) {
            this.getArea();
        } else {
            this.makeAreaData(this.props.areaData);
        }
    }

    componentWillReceiveProps(nextP) {
        if (nextP.areaData !== this.props.areaData) {
            this.makeAreaData(nextP.areaData);
        }
        this.getAllJMType();
    }

    init(){
        const id = this.props.location.pathname.split('/').slice(-1);
        let url = '';
        switch(Number(id)){
            case 1: url = `${config.baseURL}/cms/c?id=1`;break;
            case 2: url = `${config.baseURL}/cms/c?id=2`;break;
            case 3: url = `${config.baseURL}/cms/c?id=3`;break;
            case 4: url = `${config.baseURL}/cms/c?id=4`;break;
            case 5: url = `${config.baseURL}/cms/c?id=5`;break;
            case 6: url = `${config.baseURL}/cms/c?id=6`;break;
            default:
        }
        this.setState({
           url,
        });
    }
    // 获取所有省市区
    getArea() {
        this.props.actions.getAreaList();
    }

    // 获取当前登录用户的相关信息
    getUserInfo() {
        const u = this.props.userinfo;
        const openId = localStorage.getItem('openId');
        if (!u && openId) {
            this.props.actions.getUserInfo({ openId });
        }
    }

    // 获取所有的加盟类型
    getAllJMType() {
        this.props.actions.getAllJMType().then((res) => {
            if(res.status === 200) {
                this.setState({
                    allJM: res.data.result,
                });
            }
        });
    }

    // 按钮被点击
    onBtnClick(type) {
        if(type === 1) {
            this.setState({
                btn1Show: !this.state.btn1Show,
                btn2Show: false,
            });
        } else if(type===2){
            this.setState({
                btn2Show: !this.state.btn2Show,
                btn1Show: false,
            });
        }
    }

    // 通过区域原始数据组装Picker所需数据
    makeAreaData(d) {
        const data = d.map((item, index) => {
            return {label: item.areaName, value: item.areaName, parentId: item.parentId, id: item.id, level: item.level };
        });
        // 每一个市下面加一个“全部”
        const temp = data.filter((item, index) => item.level === 1);
        console.log('TEMP:', temp);
        temp.forEach((item, index) => {
            data.unshift({label: '全部', value: '', parentId: item.id, id: null, level: item.level + 1 });
        });
        const areaData = this.recursionAreaData(null, data);
        console.log('变成什么了', areaData);
        this.setState({
            sourceData: areaData || [],
        });
    }

    // 工具 - 递归生成区域层级数据
    recursionAreaData(one, data) {
        let kids;
        if (!one) { // 第1次递归
            kids = data.filter((item) => item.level === 0);
        } else {
            kids = data.filter((item) => item.parentId === one.id);
        }
        kids.forEach((item) => item.children = this.recursionAreaData(item, data));
        return kids;
    }

    // 城市选择
    onCityChose(data) {
        console.log('Area:', data);
        this.setState({
            form1Area: data,
        });
    }

    onForm1Name(e) {
        this.setState({
           form1Name: tools.trim(e.target.value),
        });
    }

    onForm1Phone(e){
        this.setState({
            form1Phone: tools.trim(e.target.value),
        });
    }

    onInputWords(e) {
        this.setState({
            form1Words: tools.trim(e.target.value),
        });
    }
    onTypeChose(e) {
        console.log('是个什么：', e);
        this.setState({
            form1Type: e,
        });
    }

    onCity2Chose(e) {
        this.setState({
            form2Area: e,
        });
        const params = {
            province: e && e[0],
          //  city: e && e[1],
          //  region: e && e[2],
        };
        this.props.actions.getAreaManagerByArea(params).then((res) => {
            if(res.status === 200) {
                this.setState({
                    areaFuckerInfo: res.data || null,
                });
            } else {
                Toast.info(res.message, 1);
            }
        });
    }

    // 留言提交
    onSubmitForm1() {
       if(!this.state.form1Name){
           Toast.info("请输入姓名", 1);
           return;
       }
       if (!tools.checkStr(this.state.form1Name)){
           Toast.info("姓名不能包含特殊字符", 1);
           return;
       }
       if(!tools.checkPhone(this.state.form1Phone)){
           Toast.info("请输入有效手机号", 1);
           return;
       }

       const params = {
           customerName: this.state.form1Name, // 姓名
           mobile: this.state.form1Phone,   // 电话
           province: this.state.form1Area ? this.state.form1Area[0] : null,
           city: this.state.form1Area ? this.state.form1Area[1] : null,
           region: this.state.form1Area ? this.state.form1Area[2] : null,
           content: this.state.form1Words || null,
           joinType: this.state.form1Type && this.state.form1Type[0],
       };

       this.props.actions.customerMessage(tools.clearNull(params)).then((res) => {
           if(res.status === 200) {
               Toast.success('留言成功', 1);
               this.setState({
                   form1Name: "",  // 姓名
                   form1Phone: "", // 手机
                   form1Area: undefined, // 加盟区域
                   form1Type: undefined, // 加盟类型
                   form1Words: "", // 留言内容
                   btn1Show: false,
               });
           } else {
               Toast.info(res.message, 1);
           }
       });
    }

    render() {
        return (
            <div className='jxs-page'>
                <div className="activity-iframe">
                    <iframe wmode="transparent" src={this.state.url} />
                </div>
                <div className="footer">
                    <div className={this.state.btn1Show ? 'check' : null} onClick={() => this.onBtnClick(1)}>留言咨询</div>
                    <div className={this.state.btn2Show ? 'check' : null} onClick={() => this.onBtnClick(2)}>立即咨询</div>
                </div>

                {/** Modal1 **/}
                <div className={this.state.btn1Show ? 'modal1 show' : 'modal1'}>
                    <div className="title">
                        <span className={"t"}>我对此项目感兴趣，马上留言</span>
                        <span className={"close"} onClick={() => this.setState({ btn1Show: false })}><img src={ImgClose} /></span>
                    </div>
                    <div className="modal-form">
                        <div className="form-in">
                            <div className={"label"}><span>*</span>姓&#12288;名:<i /></div>
                            <div className={"input-box"}><input type="text" maxLength="16" placeholder={"请输入您的姓名"} value={this.state.form1Name} onInput={(e) => this.onForm1Name(e)}/></div>
                        </div>
                        <div className="form-in">
                            <div className={"label"}><span>*</span>手机号:<i /></div>
                            <div className={"input-box"}><input type="tel" maxLength="11" placeholder={"请输入您的手机号"} value={this.state.form1Phone} onInput={(e) => this.onForm1Phone(e)}/></div>
                        </div>
                        <Picker
                            data={this.state.sourceData}
                            extra={'区域搜索'}
                            value={this.state.form1Area}
                            format={(v) => v.join('>')}
                            cols={3}
                            onOk={(v) => this.onCityChose(v)}
                        >
                            <div className="form-in">
                                <div className={"label"}>加盟区域:<i /></div>
                                <div className={"input-box"}><input readOnly={true} type="text" value={this.state.form1Area ? this.state.form1Area.filter((item) => item).join('/') : ""} placeholder={"请选择区域"}/></div>
                            </div>
                        </Picker>
                        <Picker
                            data={this.state.allJM.map((item) => {
                                return { label: item.dicValue, value: item.id };
                            })}
                            value={this.state.form1Type}
                            cols={1}
                            onOk={(v) => this.onTypeChose(v)}
                        >
                            <div className="form-in">
                                <div className={"label"}>加盟类型:<i /></div>
                                <div className={"input-box"}><input readOnly={true} value={this.state.form1Type ? this.state.allJM.find((item) => item.id === this.state.form1Type[0]).dicCode : ""} type="text" placeholder={"请选择类型"}/></div>
                            </div>
                        </Picker>
                        <div className="form-in">
                            <div className={"label"}>留&#12288;&#12288;言:<i /></div>
                            <div className={"input-box"}><input type="text" maxLength="100" placeholder={"请留言"} value={this.state.form1Words} onInput={(e) => this.onInputWords(e)}/></div>
                        </div>
                    </div>
                    <div className={"submit-btn"} onClick={() => this.onSubmitForm1()}>
                        提交留言
                    </div>
                    <div className={"info"}>* 招商经理将在24小时内联系您。翼猫绝不外泄您的信息!</div>
                </div>

                {/** Modal2 **/}
                <div className={this.state.btn2Show ? 'modal1 show' : 'modal1'}>
                    <div className="title">
                        <span className={"t"}>选择你想加盟的区域，联系招商经理，了解更多</span>
                        <span className={"close"} onClick={() => this.setState({ btn2Show: false })}><img src={ImgClose} /></span>
                    </div>
                    <div className="modal-form">
                        <Picker
                            data={this.state.sourceData}
                            extra={'区域搜索'}
                            value={this.state.form2Area}
                            cols={3}
                            onOk={(v) => this.onCity2Chose(v)}
                        >
                            <div className="form-in">
                                <div className={"label"}>加盟区域:<i /></div>
                                <div className={"input-box"}><input readOnly={true} type="text" value={this.state.form2Area && this.state.form2Area.filter((item) => item).join('/')} placeholder={"请选择区域"}/></div>
                            </div>
                        </Picker>
                    </div>
                    {
                        this.state.areaFuckerInfo ? (
                            <div className={"fucker-info"}>
                                <img className="photo" src={ImgPeople} />
                                <div className="infos">
                                    <div>{this.state.areaFuckerInfo.technicalName}</div>
                                    <div>{this.state.areaFuckerInfo.technicalArea}</div>
                                </div>
                                <a className={"phone-call"} href={`tel:${this.state.areaFuckerInfo.mobile}`}><img src={ImgPhone} /></a>
                            </div>
                        ) : (
                            <div className={"fucker-info"}>
                                <div style={{margin: '0 auto'}}>暂无招商经理</div>
                            </div>
                        )
                    }

                    <div className={"info"}>* 客服热线：<a href="tel:4001519999">4001519999</a></div>
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
    areaData: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        userinfo: state.app.userinfo,
        areaData: state.app.areaData,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ getUserInfo, myAmbassador, getMyCustomersCount, getAreaList, customerMessage, getAreaManagerByArea, getAllJMType }, dispatch),
    })
)(HomePageContainer);
