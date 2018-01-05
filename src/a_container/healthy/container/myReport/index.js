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
import { Button, Toast } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import Img404 from '../../../../assets/not-found.png';
// ==================
// 本页面所需action
// ==================

import { queryReportList } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================

class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        document.title = '我的体检报告';
        this.getData();
    }

    getData() {

        this.props.actions.queryReportList({pageNum: 1, pageSize: 999}).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data.result,
                });
            } else {
                Toast.fail(res.message, 1);
            }
        }).catch(() => {
            Toast.fail(res.message, 1);
        });
    }

    // 打开PDF
    onPdf(url) {
        window.open(url);
    }

    render() {
        return (
            <div className="page-report">
                <ul>
                    {
                        this.state.data.length ? this.state.data.map((item, index) => {
                               return <li key={index} className="card-box page-flex-row" onClick={() => this.onPdf(item.reportPDF)}>
                                    <div className="l flex-auto">
                                        <div><span>{item.username}</span><span>{item.sex}</span><span>{item.examDate}</span></div>
                                        <div>体检卡号：</div>
                                        <div>{item.stationName}</div>
                                    </div>
                                    <div className="r flex-none page-flex-col flex-ai-center flex-jc-center"><img src={ImgRight} /></div>
                                </li>;
                            })
                         : (
                            <li key={0} className="data-nothing">
                                <img src={Img404}/>
                                <div>亲，这里什么也没有哦~</div>
                            </li>
                        )
                    }
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
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ queryReportList }, dispatch),
    })
)(HomePageContainer);
