/**
 * 嵌在其他页面中的模版
 * **/

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './shareHra.scss';
// ==================
// 所需的所有组件
// ==================
import ImgTitle from '../../assets/share/han@3x.png';
import ImgDefault from '../../assets/logo-img.png';
import ImgQrCode from '../../assets/share/qrcode_for_gh.jpg';   // 二维码图标
import ImgZhiWen from '../../assets/share/zhiwen@3x.png';
// ==================
// 本页面所需action
// ==================

import { shareBuild } from '../../a_action/app-action';

// ==================
// Definition
// ==================

class Register extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imgCode: '',
            data: {},
        };
    }

    componentWillMount() {
        // 处理location中的数据 id_nickName_headImg
        const pathname = this.props.location.pathname.split('/');
        const p = pathname[pathname.length - 1];
        const data = p.split('_');
        if (data.length > 2) {  // 获取到了信息
            this.setState({
                data: {
                    id: data[0],
                    name: data[1],
                    head: data[2],
                }
            });
            setTimeout(() => this.getCode(data[0]));
        }
    }

    componentDidMount() {
        this.getCode();
    }

    // 获取二维码图片
    getCode(userId) {
        this.props.actions.shareBuild({ userId, shareType: 0 }).then((res) => {
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
            <div className="flex-auto page-box page-sharehra" style={{ minHeight: '100vh' }}>
                <div className="title">{d.name ? '本页包含您的专属二维码，快快转发分享给您的好友吧' : '好东西别忘了分享哦！快快转发分享给您的好友吧'}</div>
                <div className="info-box">
                    <img className="t" src={ImgTitle} />
                    <div className="head-box">
                        <img className="head" src={d.head ? decodeURIComponent(d.head) : ImgDefault}/>
                        <div className="line"/>
                        <div className="circle-left"/>
                        <div className="circle-right"/>
                    </div>
                    <div className="info"><span>[{d.name ? decodeURIComponent(d.name) : '健康e家'}]</span>邀请您关注更多健康资讯</div>
                    <div className="info">长按识别二维码接受邀请</div>
                    <div className="codes page-flex-row flex-jc-center">
                        <div>
                            <img src={this.state.imgCode || ImgQrCode}/>
                            {d.head && <img className="head" src={decodeURIComponent(d.head)} />}
                        </div>
                        <div>
                            <img src={ImgZhiWen} />
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

Register.propTypes = {
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
)(Register);
