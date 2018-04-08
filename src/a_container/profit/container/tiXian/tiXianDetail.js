/* 收益管理 - 提现详情 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './tiXianDetail.scss';
import tools from '../../../../util/all';
// ==================
// 所需的所有组件
// ==================
import { List, Toast, Steps } from 'antd-mobile';
import ImgStep0 from '../../../../assets/profit/step0@3x.png';
import ImgStep1 from '../../../../assets/profit/step1@3x.png';
import ImgFail from '../../../../assets/profit/fail@3x.png';
import ImgDown from '../../../../assets/profit/down@3x.png';
// ==================
// 本页面所需action
// ==================

import { getCashRecordList } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
const Step = Steps.Step;
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        document.title = '提现记录详情';
        const p = this.props.location.pathname.split('/').pop();
        this.getData(p);
    }

    getData(partnerTradeNo){
        const me = this;
        const params = {
            partnerTradeNo,
        };
        Toast.loading('请稍后...', 0);
        this.props.actions.getCashRecordList(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                me.setState({
                    data: res.data.result ? res.data.result[0] : {},
                });
                Toast.hide();
            } else {
                Toast.fail(res.message);
            }
        }).catch(() => {
            Toast.fail('查询失败，请重试', 1);
        });
    }

    render() {
        const data = this.state.data;

        const stepsInfo = [{
            title: '发起提现',
            description: '2018-02-02 14:20:59',
        }, {
            title: '处理中',
            description: '2018-02-02 14:20:59',
        }, {
            title: '提现成功',
            description: '2018-02-02 14:20:59',
        }].map((s, i) => <Step key={i} title={s.title} description={s.description} />);

        return (
            <div className="page-tixiandetail">
                {/**
                    下面这部分不要了，为了防止以后又要了，所以注释在此
                    果然，现在又要了2018-3-29，what can I say ?
                 **/}
                <ul className="step-box">
                    <li className="step">
                        <img className="step-icon" src={ImgStep1} />
                        <div className="info">
                            <div>发起提现</div>
                            <div>{data.applyTime}</div>
                        </div>
                    </li>
                    <li className="line2" />
                    <li className="step">
                        <img className="step-icon" src={(() => {
                            switch(data.withdrawStatus) {
                                case 1: return ImgStep1;
                                case 2: return ImgFail;
                                default: return ImgStep0;
                            }
                        })()} />
                        <div className="info">
                            <div>{(() => {
                                switch (data.withdrawStatus) {
                                    case 1:
                                        return '审核通过';
                                    case 2:
                                        return '审核不通过';
                                    case 3:
                                        return '审核中';
                                    default:
                                        return '审核中';
                                }
                            })()}</div>
                            <div>{data.audirTime}</div>
                        </div>
                    </li>
                    <li className={data.withdrawStatus === 1 ? 'line2' : 'line1'} />
                    <li className="step">
                        <img className="step-icon" src={(() => {
                            if (data.withdrawStatus !== 1) {
                                return ImgDown;
                            }
                            if (data.flag === 1) {
                                return ImgFail;
                            } else {
                                return ImgDown;
                            }
                        })()} />
                        <div className="info">
                            <div>{(() => {
                                if (data.withdrawStatus !== 1) {
                                    return '提现';
                                }

                                if (data.flag === 1) {
                                    return '提现失败';
                                } else {
                                    return '提现成功';
                                }
                            })()}</div>
                            <div>{data.paymentTime}</div>
                        </div>
                    </li>
                </ul>
                <List>
                    <Item extra={<span style={{ color: '#FF0303' }}>￥{data.amount ? Number(data.amount).toFixed(2) : '--'}</span>}>提现</Item>
                </List>
                <div className="info-box">
                    <div className="page-flex-row flex-jc-sb">
                        <div>类型</div>
                        <div>提现到{data.withdrawType === 1 ? '微信钱包' : '支付宝'}</div>
                    </div>
                    <div className="page-flex-row flex-jc-sb">
                        <div>时间</div>
                        <div>{data.applyTime}</div>
                    </div>
                    <div className="page-flex-row flex-jc-sb">
                        <div>交易单号</div>
                        <div>{data.partnerTradeNo}</div>
                    </div>
                    {/*<div className="page-flex-row flex-jc-sb">*/}
                        {/*<div>手续费</div>*/}
                        {/*<div>￥{Number(data.formalitiesFee).toFixed(2)}</div>*/}
                    {/*</div>*/}
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
    tiXianDetail: P.any,
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ getCashRecordList }, dispatch),
    })
)(HomePageContainer);
