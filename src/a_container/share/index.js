/* 分享页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import ImgRight from '../../assets/xiangyou2@3x.png';    // 右箭头
import ImgShare from '../../assets/fenxiang@3x.png';    // 分享箭头
import ImgQrCode from '../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
import ImgZhiWen from '../../assets/share/zhiwen@3x.png';    // 指纹图标
import ImgChaXun from '../../assets/fenxiang_one@3x.png';    // 查询图标
import ImgYuYue from '../../assets/fenxiang_two@3x.png';    // 预约图标
import ImgBaoGao from '../../assets/fenxiang_three@3x.png'; // 报告图标
// ==================
// 本页面所需action
// ==================

import { productById } from '../../a_action/shop-action';
import { shareBuild } from '../../a_action/app-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            productData: {}, // 分享的卡片信息
            imgCode: '',  // 分享的二维码、
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const ids = this.props.location.pathname.split('/');
        const cardId_userId = ids[ids.length - 1].split('_');


        if (!cardId_userId || cardId_userId.length<2) {
            return;
        }
        this.props.actions.productById({productId: cardId_userId[0]}).then((res) => {

        });
        this.props.actions.shareBuild({ userId: Number(cardId_userId[1]) }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    imgCode: res.data,
                });
            }
        });
    }

    render() {
        return (
            <div className="flex-auto page-box page-share">
                <div style={{ padding: '.2rem' }}>
                    <div className="cardbox page-flex-col flex-jc-sb">
                        <div className="row1 flex-none page-flex-row flex-jc-sb">
                            <div>
                                <div className="t">健康风险评估卡</div>
                                <div className="i">专注疾病早起筛查</div>
                            </div>
                            <div className="flex-none"><img src={ImgRight} /></div>
                        </div>
                        <div className="row2 flex-none">
                            <div>
                                <div className="t">共{this.state.data.count || "--" }张<span>已使用0张</span></div>
                                <div className="i">有效期：--</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="weixin">
                    <div className="t">翼猫健康e家公众号</div>
                    <div className="page-flex-row flex-jc-sb"><img src={this.state.imgCode || ImgQrCode}/><img src={ImgZhiWen} /></div>
                    <div className="little">长按二维码 “识别” 关注</div>
                </div>
                <div className="weixin-info">
                    <div className="page-flex-row flex-ai-center">
                        <div className="line flex-auto"/>
                        <div className="t flex-none">关注公众号，享受更多服务</div>
                        <div className="line flex-auto"/>
                    </div>
                    <div className="icons-box page-flex-row flex-jc-sb">
                        <div>
                            <div className="img-box"><img src={ImgChaXun} /></div>
                            <div className="info">查询<br/>体检服务中心</div>
                        </div>
                        <div>
                            <div className="img-box"><img src={ImgYuYue} /></div>
                            <div className="info">预约体检</div>
                        </div>
                        <div>
                            <div className="img-box"><img src={ImgBaoGao} /></div>
                            <div className="info">查看<br/>体检报告</div>
                        </div>
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
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ productById, shareBuild }, dispatch),
    })
)(HomePageContainer);
