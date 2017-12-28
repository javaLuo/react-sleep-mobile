/* 健康管理 - 我的体检卡 */

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
import Luo from 'iscroll-luo';
import ImgRight from '../../../../assets/xiangyou2@3x.png';
import Img404 from '../../../../assets/not-found.png';
import { } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { mallCardList, savePreInfo, saveReportInfo } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], // 用户拥有的体检卡
            wxReady: false, // 微信是否已初始化
        };
    }

    componentDidMount() {
        this.getData();
    }

    // 获取体检卡列表
    getData(pageNum=1, pageSize=10, type='flash') {
        this.props.actions.mallCardList({ pageNum, pageSize }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: type === 'flash' ? (res.data.result || []) : [...this.state.data, ...(res.data.result || [])],
                    pageNum,
                    pageSize,
                });
            }
        });
    }

    // 选择某一张卡，将卡信息保存到store的体检预约信息中
    onCardClick(data) {
        const path = tools.makePathname(this.props.location.pathname);
        if (path === 'addreport') { // 来自添加报告选择
            this.props.actions.saveReportInfo({ ticketNo: String(data.orderId) });
            setTimeout(() => this.props.history.replace('/healthy/addreport'), 16);
        } else if(path === 'precheck'){ // 来自体检预约选择体检卡
            this.props.actions.savePreInfo({ ticketNo: String(data.orderId) });
            setTimeout(() => this.props.history.replace('/healthy/precheck'), 16);
        }
    }

    // 工具 - 获取已使用了多少张卡
    getHowManyByTicket(list) {
        if (!list){ return 0; }
        return list.filter((item) => item.ticketStatus !== 1).length;
    }

    // 下拉刷新
    onDown() {
        this.getData(1, this.state.pageSize, 'flash');
    }
    // 上拉加载
    onUp() {
        this.getData(this.state.pageNum + 1, this.state.pageSize, 'update');
    }

    render() {
        return (
            <div className="page-chose-card">
                <Luo
                    id="luo3"
                    className="touch-none"
                    onPullDownRefresh={() => this.onDown()}
                    onPullUpLoadMore={() => this.onUp()}
                    iscrollOptions={{
                        disableMouse: true,
                        momentum: false,
                    }}
                >
                    <ul>
                        {(() => {
                            let map = [];
                            if (this.state.data.length <= 0) {
                                map.push(<li key={0} className="data-nothing">
                                    <img src={Img404}/>
                                    <div>亲，这里什么也没有哦~</div>
                                </li>);
                            } else {
                                map = this.state.data.map((item, index) => {
                                    return <li  key={index} className="cardbox page-flex-col flex-jc-sb" onClick={() => this.onCardClick(item)}>
                                        <div className="row1 flex-none page-flex-row flex-jc-sb">
                                            <div>
                                                <div className="t">健康风险评估卡</div>
                                                <div className="i">专注疾病早起筛查</div>
                                            </div>
                                            <div className="flex-none"><img src={ImgRight} /></div>
                                        </div>
                                        <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                                            <div>
                                                <div className="t">共{item.ticketNum}张<span>已使用{this.getHowManyByTicket(item.ticketList)}张</span></div>
                                                <div className="i">有效期：{tools.dateToStr(new Date(item.validTime))}</div>
                                            </div>
                                        </div>
                                    </li>;
                                });
                            }
                            return map;
                        })()}
                    </ul>
                </Luo>
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
        actions: bindActionCreators({ mallCardList, savePreInfo, saveReportInfo }, dispatch),
    })
)(HomePageContainer);
