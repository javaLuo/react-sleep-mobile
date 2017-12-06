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
        };
    }

    render() {
        return (
            <div className="page-add-report">
                <div className="bar-list">
                    <div className="item page-flex-row all_active">
                        <div className="title2">体检卡号:</div>
                        <div className="info2">460456840568</div>
                        <div className="arrow2"><img src={ImgCard} /></div>
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
