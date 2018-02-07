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

import { wxInit } from '../../../../a_action/shop-action';
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
    }

    onChose(type) {
        this.props.history.push(`/my/mydaiyan/${type}`);
    }

    render() {
        return (
            <div className="flex-auto page-box page-daiyan">
                <div className="abox">
                    <div className="title">净水服务</div>
                    <ul className="the-ul">
                        <li onClick={() => this.onChose(1)}>
                            <img className="pic" src={ImgB1}/>
                            <div className="info">翼猫智能净水系统代言卡</div>
                            <img className="r" src={ImgR}/>
                        </li>
                    </ul>
                </div>
                <div className="abox">
                    <div className="title">健康食品</div>
                    <ul className="the-ul">
                        <li onClick={() => this.onChose(2)}>
                            <img className="pic" src={ImgC1}/>
                            <div className="info">翼猫养未来健康食品系统代言卡</div>
                            <img className="r" src={ImgR}/>
                        </li>
                    </ul>
                </div>
                <div className="abox">
                    <div className="title">生物科技</div>
                    <ul className="the-ul">
                        <li onClick={() => this.onChose(3)}>
                            <img className="pic" src={ImgD1}/>
                            <div className="info">翼猫冷敷贴系统代言卡</div>
                            <img className="r" src={ImgR}/>
                        </li>
                    </ul>
                </div>
                <div className="abox">
                    <div className="title">健康评估</div>
                    <ul className="the-ul">
                        <li onClick={() => this.onChose(5)}>
                            <img className="pic" src={ImgE1}/>
                            <div className="info">翼猫HRA健康风险评估系统代言卡</div>
                            <img className="r" src={ImgR}/>
                        </li>
                    </ul>
                </div>
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
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ wxInit, shareBuild }, dispatch),
    })
)(Register);
