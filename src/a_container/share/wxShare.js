/* 微信公众号分享页 */

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
import ImgLogo from '../../assets/logo@3x.png';
import ImgRight from '../../assets/xiangyou@3x.png';
// ==================
// 本页面所需action
// ==================

import { saveWxCode } from '../../a_action/app-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="flex-auto page-box page-share">
                <div className="weixin">
                    <img src="#" />
                    <div>翼猫健康e家公众号</div>
                    <div>关注公众号，享受更多服务</div>
                    <div className="more page-flex-row flex-jc-sb">
                        <div className="page-flex-col flex-jc-center"><div>查询体检<br/>服务中心</div></div>
                        <div className="page-flex-col flex-jc-center"><div>预约体检</div></div>
                        <div className="page-flex-col flex-jc-center"><div>查看<br/>体检报告</div></div>
                    </div>
                </div>
                <div className="weixin-info">
                    <div>关注方式：</div>
                    <div>保存二维码到手机相册</div>
                    <div>打开微信扫一扫</div>
                    <div>打开右上角的相册</div>
                    <div>选择刚才保存的二维码识别后关注</div>
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
        actions: bindActionCreators({ saveWxCode }, dispatch),
    })
)(HomePageContainer);
