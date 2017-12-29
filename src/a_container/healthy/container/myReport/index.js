/* 健康管理 - 体检报告 */

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
import { Button, Modal } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';

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

    componentDidMount() {
        document.title = '我的体检报告';
    }
    render() {
        return (
            <div className="page-report">
                <ul>
                    <li className="card-box page-flex-row">
                        <div className="l flex-auto">
                            <div><span>张三</span><span>男</span><span>2017-09-09</span></div>
                            <div>体检卡号：3458934759027502</div>
                            <div>上海市嘉定区翼猫体验服务店体检中心</div>
                        </div>
                        <div className="r flex-none page-flex-col flex-ai-center flex-jc-center"><img src={ImgRight} /></div>
                    </li>
                    <li className="card-box page-flex-row">
                        <div className="l flex-auto">
                            <div><span>张三</span><span>男</span><span>2017-09-09</span></div>
                            <div>体检卡号：3458934759027502</div>
                            <div>上海市嘉定区翼猫体验服务店体检中心</div>
                        </div>
                        <div className="r flex-none page-flex-col flex-ai-center flex-jc-center"><img src={ImgRight} /></div>
                    </li>
                    <li className="card-box page-flex-row">
                        <div className="l flex-auto">
                            <div><span>张三</span><span>男</span><span>2017-09-09</span></div>
                            <div>体检卡号：3458934759027502</div>
                            <div>上海市嘉定区翼猫体验服务店体检中心</div>
                        </div>
                        <div className="r flex-none page-flex-col flex-ai-center flex-jc-center"><img src={ImgRight} /></div>
                    </li>
                </ul>
                <div className="thefooter">
                    <Button type="primary" onClick={() => this.props.history.push('/healthy/addreport')}>添加报告</Button>
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
