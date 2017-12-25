/* 健康管理 - 添加报告 */

// ==================
// 所需的各种插件
// ==================

import  React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import tools from '../../../../util/all';
// ==================
// 所需的所有组件
// ==================
import { Button, Modal } from 'antd-mobile';
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
            phone: this.props.reportInfo.phone,
        };
    }

    // phone改变时触发
    onPhoneInput(e) {
        const v = tools.trim(e.target.value);
        if (v.length <= 11) {
            this.setState({
                phone: e.target.value,
            });
        }
    }

    render() {
        return (
            <div className="page-add-report">
                <div className="bar-list">
                    <div className="item page-flex-row all_active" onClick={() => this.props.history.push('/healthy/chosecard/addreport')}>
                        <div className="title2">体检卡号:</div>
                        <div className="info2">{this.props.reportInfo.ticketNo}</div>
                        <div className="arrow2"><img src={ImgCard} /></div>
                        <div className="line"/>
                    </div>
                    <div className="item page-flex-row all_active">
                        <div className="title2">手机号:</div>
                        <div className="info2"><input maxLength="11" type="tel" value={this.state.phone} onInput={() => this.onPhoneInput()}/></div>
                        <div className="line"/>
                    </div>
                </div>
                <div className="thefooter">
                    <Button type="primary">确认添加</Button>
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
    reportInfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        reportInfo: state.shop.reportInfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({}, dispatch),
    })
)(HomePageContainer);
