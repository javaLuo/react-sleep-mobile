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

import ImgRight from '../../../../assets/xiangyou2@3x.png';
import ImgShare from '../../../../assets/fenxiang@3x.png';
import ImgLogo from '../../../../assets/logo@3x.png';
import ImgShare1 from '../../../../assets/share-wx.png';
import ImgShare2 from '../../../../assets/share-friends.png';
import ImgShare3 from '../../../../assets/share-qq.png';
import { ActionSheet, Toast } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================

import { mallCardList, savePreInfo } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null, // 用户拥有的体检卡
            wxReady: false, // 微信是否已初始化
        };
    }

    componentDidMount() {
        this.getData();
    }

    // 获取体检卡列表
    getData() {
        this.props.actions.mallCardList({ pageNum: 0, pageSize: 9999 }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data.result,
                });
            }
        });
    }

    // 选择某一张卡，将卡信息保存到store的体检预约信息中
    onCardClick(data) {
        // 然后返回体检预约页
        this.props.actions.savePreInfo({ ticketNo: String(data.orderId) });
        setTimeout(() => this.props.history.push('/healthy/precheck'), 16);

    }

    // 工具 - 获取已使用了多少张卡
    getHowManyByTicket(list) {
        if (!list){ return 0; }
        return list.filter((item) => item.ticketStatus !== 1).length;
    }

    render() {
        return (
            <div className="page-chose-card">
                <ul>
                    {(() => {
                        let map = [];
                        if(!this.state.data) {
                            map.push(<li key={0} className="nodata">正在加载您的体检卡…</li>);
                        } else if (this.state.data.length <= 0) {
                            map.push(<li key={0} className="nodata">您没有体检卡<br/><Link to="/">前往购买</Link></li>);
                        } else {
                            map = this.state.data.map((item, index) => {
                                return <li  key={index} className="cardbox" onClick={() => this.onCardClick(item)}>
                                    <div className="title page-flex-row flex-jc-sb flex-ai-center">
                                        <img className="logo" src={ImgLogo} />
                                        <span className="num">共{item.ticketNum}张<i>已使用{this.getHowManyByTicket(item.ticketList)}张</i></span>
                                    </div>
                                    <div className="info page-flex-row">
                                        <div className="t flex-auto">
                                            <div className="t-big">健康风险评估卡</div>
                                            <div className="t-sm">专注疾病早起筛查</div>
                                        </div>
                                        <div className="r flex-none page-flex-col flex-jc-center">
                                            <img src={ImgRight} />
                                        </div>
                                    </div>
                                    <div className="info2 page-flex-row flex-jc-sb">
                                        <span>有效期：{tools.dateToStr(new Date(item.validTime))}</span>
                                    </div>
                                </li>;
                            });
                        }
                        return map;
                    })()}
                </ul>
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
        actions: bindActionCreators({ mallCardList, savePreInfo }, dispatch),
    })
)(HomePageContainer);
