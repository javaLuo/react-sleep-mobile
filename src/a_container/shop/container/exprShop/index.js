/* 健康管理 - 选择体检服务中心 */

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
import { SearchBar, PullToRefresh, Toast } from 'antd-mobile';
import Luo from 'iscroll-luo';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dizhi@3x.png';
import ImgPhone from '../../../../assets/dianhua@3x.png';
import Img404 from '../../../../assets/not-found.png';

// ==================
// 本页面所需action
// ==================

import { mallStationListAll, saveServiceInfo } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],   // 所有数据
            loading: false, // 搜索中
            pageNum: 1,
            pageSize: 10,
            search: '',
            refreshing: false, // 加载更多搜索中
        };
    }

    componentDidMount() {
        document.title = '选择服务中心';
        this.getData(this.state.pageNum, this.state.pageSize, this.state.search, 'flash');
    }

    getData(pageNum, pageSize, search, flash = 'flash') {
        const me = this;
        const params = {
            pageNum,
            pageSize,
            stationName: search,
        };
        Toast.loading('搜索中...', 0);
        this.props.actions.mallStationListAll(params).then((res) => {
            console.log('得到了什么：', res);
            if (res.status === 200) {
                me.setState({
                    data: flash === 'flash' ? (res.data.result || []) : [...this.state.data, ...(res.data.result || [])],
                    pageNum,
                    pageSize,
                    search,
                });
                Toast.hide();
            } else {
                Toast.fail('查询失败，请重试',1);
            }
        }).catch(() => {
            Toast.fail('查询失败，请重试', 1);
        });
    }

    // 开始搜索
    onSearch(e) {
        this.getData(1, this.state.pageSize, e, 'flash');
    }

    // 下拉刷新
    onDown() {
        this.getData(1, this.state.pageSize, this.state.search, 'flash');
    }
    // 上拉加载
    onUp() {
        this.getData(this.state.pageNum + 1, this.state.pageSize, this.state.search, 'update');
    }

    render() {
        return (
            <div className="page-expr-shop">
                <SearchBar
                    placeholder="输入省/市/区/服务站名称"
                    maxLength={25}
                    onSubmit={(e) => this.onSearch(e)}
                    onChange={(e) => this.onSearch(e)}
                    iscrollOptions={{
                        disableMouse: true,

                        preventDefault: true,

                    }}
                />
                <div className="iscroll-box">
                    <Luo
                        id="luo2"
                        className="touch-none"
                        onPullDownRefresh={() => this.onDown()}
                        onPullUpLoadMore={() => this.onUp()}
                    >
                        <ul>
                            {
                                this.state.data.length ? this.state.data.map((item, index) => {
                                    return (
                                        <li key={index} className="card-box page-flex-row">
                                            <div className="l flex-auto">
                                                <div className="title">{item.name}</div>
                                                <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>{item.person}</span></div>
                                                <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span>{item.phone}</span></div>
                                                <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>{item.address}</span></div>
                                            </div>
                                        </li>
                                    );
                                }) : <li key={0} className="data-nothing">
                                    <img src={Img404}/>
                                    <div>亲，这里什么也没有哦~</div>
                                </li>
                            }
                        </ul>
                    </Luo>
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
        actions: bindActionCreators({ mallStationListAll, saveServiceInfo }, dispatch),
    })
)(HomePageContainer);