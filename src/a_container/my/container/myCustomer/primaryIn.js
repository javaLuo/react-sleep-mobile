/* 我的e家 - 我的客户 - 企业版主账号点击进入此页面 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import tools from '../../../../util/all';
import './primary.scss';
// ==================
// 所需的所有组件
// ==================
import { List, Toast } from 'antd-mobile';
import ImgDefault from '../../../../assets/default-head.jpg';
import Img404 from '../../../../assets/not-found.png';
// ==================
// 本页面所需action
// ==================

import { getMyCustomers } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        document.title = '我的推广客户';
        this.getData();
    }

    getData() {
        const u = this.props.userinfo;
        if (!u) {
            return;
        }
        Toast.loading('加载中…');
        this.props.actions.getMyCustomers({ userId: u.id }).then((res) => {
            if (res.status === 200) {
                if (res.data) {
                    this.setState({
                        data: res.data,
                    });
                }
            }
            Toast.hide();
        }).catch(() => {
            Toast.hide();
        });
    }

    render() {
        const u = this.props.userinfo || {};
        return (
            <div className="page-primary">
                {u.id && <div className="data-title">主账号</div>}
                {u.id && <ul className="data-list">
                    <li className="page-flex-row flex-ai-center">
                        <div className="photo flex-none"><img src={u.headImg} /></div>
                        <div className="name flex-auto">
                            <div>{u.nickName}</div>
                            <div className="lit">e家号：{u.id}</div>
                        </div>
                        <div className="num flex-none">{u.bindTime}</div>
                    </li>
                </ul>}
                <div className="data-title">推广客户<span style={{ float: 'right' }}>总计：{this.state.data ? this.state.data.length : '0'}人</span></div>
                <ul className="data-list">
                    {
                        this.state.data.length ? this.state.data.map((item, index) => {
                            return <li key={index} className="page-flex-row flex-ai-center">
                                <div className="photo flex-none"><img src={item.headImg || ImgDefault} /></div>
                                <div className="name flex-auto">
                                    <div>{item.nickName}</div>
                                    <div className="lit">e家号：{item.id}</div>
                                </div>
                                <div className="num flex-none">{item.bindTime}</div>
                            </li>;
                        }) : <li key={0} className="data-nothing">
                            <img src={Img404}/>
                            <div>没有查询到子账号</div>
                        </li>
                    }
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
        actions: bindActionCreators({ getMyCustomers }, dispatch),
    })
)(HomePageContainer);
