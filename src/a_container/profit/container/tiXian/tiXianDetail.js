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
// ==================
// 本页面所需action
// ==================


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
            date: new Date(), // 当前选中的年月

        };
    }

    componentDidMount() {
        document.title = '收益详情';
        if (!this.props.proDetail) {
            Toast.fail('未获取到收益详情信息',1);
        }
    }

    render() {
        const data = this.props.proDetail;
        const u = this.props.userinfo || {};

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
                <div className="step-box">
                    <Steps current={1} direction="horizontal" size="small">
                        <Step title="发起提现" description={'2018-02-02 14:20:59'} icon={<img className="step-icon" src={ImgStep1} />}/>
                        <Step title="处理中" icon={<img className="step-icon" src={ImgStep0} />}/>
                        <Step title="提现成功" description={'2018-02-02 14:20:59'} icon={<img className="step-icon" src={ImgStep0} />}/>
                    </Steps>
                </div>
                <List>
                    <Item extra={<span style={{ color: '#FF0303' }}>￥{data.income || '--'}</span>}>提现</Item>
                </List>
                <div className="info-box">
                    <div className="page-flex-row flex-jc-sb">
                        <div>类型</div>
                        <div>{data.productTypeName}</div>
                    </div>
                    <div className="page-flex-row flex-jc-sb">
                        <div>时间</div>
                        <div>{data.balanceTime}</div>
                    </div>
                    <div className="page-flex-row flex-jc-sb">
                        <div>交易单号</div>
                        <div>{data.orderId}</div>
                    </div>
                    <div className="page-flex-row flex-jc-sb">
                        <div>手续费</div>
                        <div>{data.orderId}</div>
                    </div>
                    <div className="page-flex-row flex-jc-sb">
                        <div>到账微信</div>
                        <div>{data.orderId}</div>
                    </div>
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
    proDetail: P.any,
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        proDetail: state.shop.proDetail,
        userinfo: state.app.userinfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({}, dispatch),
    })
)(HomePageContainer);
