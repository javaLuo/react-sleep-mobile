/* 我的代言卡 - 选择哪一种 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import Config from '../../../../config';
import './daiyan.scss';
// ==================
// 所需的所有组件
// ==================

import ImgA1 from '../../../../assets/one_yikatong@3x.png';
import ImgB1 from '../../../../assets/one_jingshui@3x.png';
import ImgC1 from '../../../../assets/one_shipin@3x.png';
import ImgD1 from '../../../../assets/one_liliao@3x.png';
import ImgE1 from '../../../../assets/one_pingguka@3x.png';
import ImgR from '../../../../assets/xiangyou@3x.png';
// ==================
// 本页面所需action
// ==================

import { wxInit, getDaiYanList } from '../../../../a_action/shop-action';
import { shareBuild } from '../../../../a_action/app-action';
// ==================
// Definition
// ==================

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillUnmount() {

    }

    componentDidMount() {
        document.title = '我的产品代言卡';
        if(!this.props.daiyanList) {
            this.getData();
        }
    }

    /**
     * 点击一个选项触发
     * @type: 这条数据的ID
     * @type2: 这条数据的类型ID
     * **/
    onChose(type, type2) {
        this.props.history.push(`/my/mydaiyan/${type}_${type2}`);
    }

    getData() {
        this.props.actions.getDaiYanList();
    }

    makeData(data) {
        if (!data) { return null; }
        const map = Object.entries(data);
        return map.map((item, index) => {
            return (
                <div key={index} className="abox">
                    <div className="title">{this.switchType(item[0])}</div>
                    <ul className="the-ul">
                    {
                        item[1].map((v, i) => {
                            return <li key={i} onClick={() => this.onChose(v.id, item[0])}>
                                <img className="pic" src={v.titleImage}/>
                                <div className="info">{v.name}</div>
                                <img className="r" src={ImgR}/>
                            </li>;
                        })
                    }
                    </ul>
                </div>
            );
        });
    }

    switchType(t) {
        switch(Number(t)){
            case 0: return '其他';
            case 1: return '净水服务';
            case 2: return '健康食品';
            case 3: return '生物科技';
            case 5: return '智能评估';
            default: return '';
        }
    }

    render() {
        return (
            <div className="flex-auto page-box page-daiyan">
                {
                    this.makeData(this.props.daiyanList)
                }
            </div>
        );
    }
}

// ==================
// PropTypes
// ==================

Register.propTypes = {
    location: P.any,
    history: P.any,
    actions: P.any,
    daiyanList: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        daiyanList: state.shop.daiyanList,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ wxInit, shareBuild, getDaiYanList }, dispatch),
    })
)(Register);
