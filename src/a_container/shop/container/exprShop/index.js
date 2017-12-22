/* 健康管理 - 单纯的查看-搜索服务站 */

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
import { Picker, Button, List, SearchBar, Toast, PullToRefresh } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgDh from '../../../../assets/daohang@3x.png';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dizhi@3x.png';
import ImgPhone from '../../../../assets/dianhua@3x.png';
import ImgCard from '../../../../assets/xuanzeka@3x.png';

// ==================
// 本页面所需action
// ==================

import { mallStationList, saveServiceInfo } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],   // 所有数据
            loading: false, // 搜索中
            pageNum: 0,
            pageSize: 10,
            search: '',
            refreshing: false, // 加载更多搜索中
        };
    }

    componentDidMount() {
        this.getData(this.state.pageNum, this.state.pageSize, this.state.search);
    }

    getData(pageNum, pageSize, search, flash = false) {
        const me = this;
        const params = {
            pageNum,
            pageSize,
            stationName: search,
        };
        // Toast.loading('搜索中…', 0);
        this.setState({
            refreshing: true,
        });
        this.props.actions.mallStationList(params).then((res) => {
            console.log('得到了什么：', res);
            if (res.status === 200) {
                me.setState({
                    data: flash ? res.data.result : [...this.state.data, ...res.data.result],
                    pageNum,
                    pageSize,
                    search,
                });
                //Toast.hide();
            } else {
                //Toast.fail('查询失败，请重试');
            }
            this.setState({
                refreshing: false,
            });
        }).catch(() => {
            this.setState({
                refreshing: false,
            });
            //Toast.fail('查询失败，请重试');
        });
    }

    // 开始搜索
    onSearch(e) {
        this.getData(0, this.state.pageSize, e, true);
    }

    // 选择
    onChose(item) {
        console.log('选择了：', item);
        this.props.actions.saveServiceInfo(item);
        setTimeout(() => this.props.history.push('/healthy/precheck'), 16);
    }

    render() {
        return (
            <div className="page-expr-shop">
                <SearchBar
                    placeholder="输入省/市/区/服务站名称"
                    maxLength={25}
                    onSubmit={(e) => this.onSearch(e)}
                    iscrollOptions={{
                        preventDefault: true,
                    }}
                />
                <div className="iscroll-box">
                    <PullToRefresh
                        style={{ height: 'calc(100vh - 44px)', overflow: 'auto' }}
                        indicator={{ deactivate: '上拉加载更多' }}
                        direction={'up'}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.getData(this.state.pageNum + 1, this.state.pageSize, this.state.search)}
                    >
                        {
                            this.state.data.length ? this.state.data.map((item, index) => {
                                return (
                                    <div key={index} className="card-box page-flex-row">
                                        <div className="l flex-auto">
                                            <div className="title">{item.name}</div>
                                            <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>{item.contactPerson}</span></div>
                                            <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span>{item.contactPhone}</span></div>
                                            <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>{item.address}</span></div>
                                        </div>
                                    </div>
                                );
                            }) : <div style={{ textAlign: 'center', padding: '.2rem' }}>搜索到0个结果</div>
                        }
                    </PullToRefresh>
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
        actions: bindActionCreators({ mallStationList, saveServiceInfo }, dispatch),
    })
)(HomePageContainer);
