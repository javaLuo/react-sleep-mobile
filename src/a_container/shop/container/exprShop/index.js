/* 健康管理 - 查看体检服务中心 - 用于商品详情页查看适用的体验店（已上线的） */

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
import { Picker, List, Toast, Icon } from 'antd-mobile';
import Luo from 'iscroll-luo';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dizhi@3x.png';
import ImgPhone from '../../../../assets/dianhua@3x.png';
import Img404 from '../../../../assets/not-found.png';
import ImgDaoHang from '../../../../assets/daohang@3x.png';

// ==================
// 本页面所需action
// ==================

import { mallStationList, saveServiceInfo, saveMapAddr } from '../../../../a_action/shop-action';
import { getAreaList } from '../../../../a_action/app-action';
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],   // 所有数据
            sourceData: [], // 所有省市数据（层级）
            loading: false, // 搜索中
            pageNum: 1,
            pageSize: 10,
            search: undefined,
            refreshing: false, // 加载更多搜索中
        };
    }

    componentDidMount() {
        document.title = '体验服务中心';
        this.getData(this.state.pageNum, this.state.pageSize, this.state.search, 'flash');
        if (!this.props.areaData.length) {
            this.getArea();
        } else {
            this.makeAreaData(this.props.areaData);
        }
    }

    componentWillReceiveProps(nextP) {
        if (nextP.areaData !== this.props.areaData) {
            this.makeAreaData(nextP.areaData);
        }
    }

    getData(pageNum, pageSize, search, flash = 'flash') {
        const me = this;
        const params = {
            pageNum,
            pageSize,
            province: search && search[0],
            city: search && search[1],
            region: search && search[2],
        };
        Toast.loading('搜索中...', 0);
        this.props.actions.mallStationList(tools.clearNull(params)).then((res) => {
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

    // 获取所有省市区
    getArea() {
        this.props.actions.getAreaList();
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

    // 去导航，把所有信息都TMD的传过去
    onGoMap(item) {
        this.props.actions.saveMapAddr(item);
        setTimeout(() => this.props.history.push('/downline/map'));
    }

    // 通过区域原始数据组装Picker所需数据
    makeAreaData(d) {
        const data = d.map((item, index) => {
            return {label: item.areaName, value: item.areaName, parentId: item.parentId, id: item.id, level: item.level };
        });
        const areaData = this.recursionAreaData(null, data);
        console.log('变成什么了', areaData);
        this.setState({
            sourceData: areaData || [],
        });
    }
    // 工具 - 递归生成区域层级数据
    recursionAreaData(one, data) {
        let kids;
        if (!one) { // 第1次递归
            kids = data.filter((item) => item.level === 0);
        } else {
            kids = data.filter((item) => item.parentId === one.id);
        }
        kids.forEach((item) => item.children = this.recursionAreaData(item, data));
        return kids;
    }

    // 城市选择
    onCityChose(data) {
        console.log('Area:', data);
        this.getData(1, this.state.pageSize, data, 'flash');
    }

    render() {
        console.log('此时sourceData:', this.state.sourceData);
        return (
            <div className="page-expr-shop">
                <List>
                    <Picker
                        data={[{label: '不限', value: ''},...this.state.sourceData]}
                        extra={'区域搜索'}
                        value={this.state.search}
                        format={(v) => v.join('>')}
                        cols={3}
                        onOk={(v) => this.onCityChose(v)}
                    >
                        <Item thumb={<Icon type="search" style={{ color: '#888888' }} size={'sm'}/>}>&#12288;</Item>
                    </Picker>
                </List>
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
                                    const station = item.station || {};
                                    return (
                                        <li key={index} className="card-box page-flex-row">
                                            <div className="l flex-auto">
                                                <div className="title">{station.name}</div>
                                                <div className="info page-flex-row flex-ai-center"><img src={ImgRen} /><span>{station.person}</span></div>
                                                <div className="info page-flex-row flex-ai-center"><img src={ImgPhone} /><span><a href={`tel:${station.phone || ''}`}>{station.phone}</a></span></div>
                                                <div className="info page-flex-row flex-ai-center"><img src={ImgAddr} /><span>{station.address}</span></div>
                                            </div>
                                            <div className="r flex-none" onClick={() => this.onGoMap(station)}>
                                                <div className="addr">
                                                    <img src={ImgDaoHang} />
                                                    <div>导航</div>
                                                </div>
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
    areaData: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        areaData: state.app.areaData,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ mallStationList, saveServiceInfo, getAreaList, saveMapAddr }, dispatch),
    })
)(HomePageContainer);