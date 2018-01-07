/* 分享页 - 优惠卡的分享页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './shareTicket.scss';
import tools from '../../util/all';
// ==================
// 所需的所有组件
// ==================

import ImgQrCode from '../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
import ImgZhiWen from '../../assets/share/zhiwen@3x.png';    // 指纹图标
import ImgTitle from '../../assets/share/youhuika@3x.png';
import ImgShiXiao from '../../assets/share/beilinqu@3x.png';    // 被领取
// ==================
// 本页面所需action
// ==================

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
        document.title = '我的体检券分享';
        this.getData();
    }

    getData() {
        const path = this.props.location.pathname.split('/');
        let p = path[path.length - 1].split('_');
        this.setState({
            data: {
                userId: p[0],
                name: p[1],
                head: p[2],
                no: p[3],
                date: p[4],
            }
        });

        this.props.actions.shareBuild({ userId: Number(p[0]), shareType: 2, shareNo: p[3]}).then((res) => {
            if (res.status === 200) {
                this.setState({
                    imgCode: res.data,
                });
            }
        });
    }

    render() {
        const d = this.state.data;
        return (
            <div className="flex-auto page-share-ticket">
                <div className="title-box">
                    <img src={ImgTitle}/>
                </div>
                <div className="body-box">
                    <div className='img-box'>
                        <div className="head-box">
                            <div className="pic"><img src={decodeURIComponent(d.head)} /></div>
                            <div className="name">{decodeURIComponent(d.name) || '-'}</div>
                            <div className="name-info">送您一张健康风险评估卡</div>
                        </div>
                        <div className="cardbox page-flex-col flex-jc-sb">
                            <div className="row1 flex-none page-flex-row flex-jc-sb">
                                <div>
                                    <div className="t"></div>
                                </div>
                            </div>
                            <div className="row-center page-flex-row flex-jc-end">
                            </div>
                            <div className="row2 flex-none page-flex-row flex-jc-sb flex-ai-end">
                                <div>
                                    <div className="i">有效期至：{d.date}</div>
                                </div>
                                <div className="flex-none">￥1000</div>
                            </div>
                        </div>
                        <div className="info-box">
                            <div className="page-flex-row">
                                <div className="flex-none">查看方式：</div>
                                <div className="flex-auto">进入公众号[我的e家]-[我的优惠卡]中查看。</div>
                            </div>
                        </div>
                    </div>
                    <div className="code-box">
                        <div className="t">长按识别二维码领取优惠卡</div>
                        <div className="codes page-flex-row flex-jc-center">
                            <div>
                                <img src={this.state.imgCode || ImgQrCode}/>
                                <img className="head" src={decodeURIComponent(d.head)} />
                            </div>
                            <div>
                                <img src={ImgZhiWen} />
                            </div>
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
        actions: bindActionCreators({ shareBuild }, dispatch),
    })
)(HomePageContainer);