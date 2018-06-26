/* 我的优惠卡 - 详情 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import Config from '../../../../config';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

import ImgTest from '../../../../assets/test/new.png';
// ==================
// 本页面所需action
// ==================

import { } from '../../../../a_action/shop-action';
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
        document.title = '赠送记录';
    }

    // 返回标签状态咯
    makeType() {

    }

    render() {
        return (
            <div className="page-fav-record">
                <div className="title">卡号：M0000 0000 0000 000</div>
                <div className="left">
                    <div className="t-box">
                        <div className="t-info">
                            <div className="t-info-1">2018-05-05 17:00</div>
                            <div className="t-info-2">
                                <img src={ImgTest} />
                                <div className="soming">
                                    <div>昵称昵昵称称昵称</div>
                                    <div>e家号: 15001</div>
                                </div>
                            </div>
                        </div>
                        <div className="dot" />
                    </div>
                </div>
                <div className="right">
                    <div className="t-box">
                        <div className="t-info">
                            <div className="t-info-1">2018-05-05 17:00</div>
                            <div className="t-info-2">
                                <img src={ImgTest} />
                                <div className="soming">
                                    <div>昵称昵昵称称昵称</div>
                                    <div>e家号: 15001</div>
                                </div>
                            </div>
                        </div>
                        <div className="type-card red">领取</div>
                    </div>
                </div>
                <div className="left">
                    <div className="t-box">
                        <div className="t-info">
                            <div className="t-info-1">2018-05-05 17:00</div>
                            <div className="t-info-2">
                                <img src={ImgTest} />
                                <div className="soming">
                                    <div>昵称昵昵称称昵称</div>
                                    <div>e家号: 15001</div>
                                </div>
                            </div>
                        </div>
                        <div className="type-card red">领取</div>
                    </div>
                </div>
                <div className="right">
                    <div className="t-box">
                        <div className="t-info">
                            <div className="t-info-1">2018-05-05 17:00</div>
                            <div className="t-info-2">
                                <img src={ImgTest} />
                                <div className="soming">
                                    <div>昵称昵昵称称昵称</div>
                                    <div>e家号: 15001</div>
                                </div>
                            </div>
                        </div>
                        <div className="type-card red">领取</div>
                    </div>
                </div>
                <div className="left">
                    <div className="t-box">
                        <div className="t-info">
                            <div className="t-info-1">2018-05-05 17:00</div>
                            <div className="t-info-2">
                                <img src={ImgTest} />
                                <div className="soming">
                                    <div>昵称昵昵称称昵称</div>
                                    <div>e家号: 15001</div>
                                </div>
                            </div>
                        </div>
                        <div className="type-card red">领取</div>
                    </div>
                </div>
                <div className="right">
                    <div className="t-box">
                        <div className="t-info">
                            <div className="t-info-1">2018-05-05 17:00</div>
                            <div className="t-info-2">
                                <img src={ImgTest} />
                                <div className="soming">
                                    <div>昵称昵昵称称昵称</div>
                                    <div>e家号: 15001</div>
                                </div>
                            </div>
                        </div>
                        <div className="type-card red">领取</div>
                    </div>
                </div>
                <div className="foot">卡已使用</div>
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
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        userinfo: state.app.userinfo,
    }),
    (dispatch) => ({
        actions: bindActionCreators({}, dispatch),
    })
)(Register);
