/* 健康管理 - 查看体检服务中心 - 用于我在翼猫，查看所有体验店（包括未上线的）*/

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
import { List, Toast, Carousel } from 'antd-mobile';
import ImgStar1 from '../../../../assets/home/star_1@3x.png';
import ImgAddr from '../../../../assets/dizhi@3x.png';
import IconHeart from './assets/icon_heart@3x.png';
import IconServer from './assets/icon_server@3x.png';
import IconHealthy from './assets/icon_healthy@3x.png';
import ImgTest from '../../../../assets/test/new.png';
import IconPhone from './assets/icon-phone@3x.png';
import IconRoad from '../../../../assets/daohang@3x.png';
// ==================
// 本页面所需action
// ==================

import { saveMapAddr, getStationDelForId } from '../../../../a_action/shop-action';
// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},   // 数据
            sourceData: [], // 所有省市数据（层级）
            pageNum: 1,
            pageSize: 10,
            search: undefined,  // 搜索条件
            refreshing: false, // 加载更多搜索中
            userLng: null, // 用户坐标X
            userLat: null, // 用户坐标Y
            resType: 1, // 0查询的是最近的，1普通的查询
        };
        this.map = null;            // 地图实例
        this.geolocation = null;    // 定位插件实例
        this.loading = false;   // 是否在搜索中
    }

    componentDidMount() {
        document.title = '体验服务中心详情';
        this.getData();
    }

    componentWillUnmount() {
        Toast.hide();
    }

    componentWillReceiveProps(nextP) {

    }

    getData(){
        const id = this.props.location.pathname.split('/').slice(-1);
        this.props.actions.getStationDelForId({ id: Number(id) }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    data: res.data,
                });
            } else {
                Toast.info(res.message, 1);
            }
        });
    }

    // 去导航，把所有信息都TMD的传过去
    onGoMap(item) {
        this.props.actions.saveMapAddr(item);
        setTimeout(() => this.props.history.push('/downline/map'));
    }

    render() {
        const d = this.state.data || {};
        return (
            <div className="page-expr-detail">
                <div className="box1">
                    {
                        d.imgs ? (
                            <Carousel
                                className="my-carousel"
                                autoplay={true}
                                infinite={true}
                                swipeSpeed={35}
                            >
                                {d.imgs.split(',').map((item, index) => (
                                    <a
                                        key={index}
                                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                                        target="_blank"
                                    >
                                        <img
                                            src={item}
                                            style={{ width: '100%', verticalAlign: 'top' }}
                                            onLoad={() => {
                                                window.dispatchEvent(new Event('resize'));
                                                this.setState({ imgHeight: 'auto' });
                                            }}
                                        />
                                    </a>
                                ))}
                            </Carousel>
                        ) : null
                    }

                    <div className="info-box">
                        <div className="t">{d.name}</div>
                        <div className="star-row">
                            <div>
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                            </div>
                            <div className="word">满意度：{d.satisfaction ? `${d.satisfaction}%`: '0.00%'}</div>
                        </div>
                        <div className="addr-info">
                            <img src={ImgAddr} />
                            <span>{d.address && `${d.province}${d.city}${d.region}${d.address}`}</span>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">关于门店</div>
                        <div className="about-row">
                            <div><span>成立时间：</span><span>{d.establishedTime && d.establishedTime.split(' ')[0]}</span></div>
                            <div><span>门店规模：</span><span>{d.storeArea || 0}</span></div>
                            <div><span>员工数量：</span><span>{d.employeeNum || 0}人</span></div>
                            <div><span>营业时间：</span><span>{d.businessHoursStart} - {d.businessHoursEnd}</span></div>
                        </div>
                    </div>
                    {
                        d.stationColumnList ? d.stationColumnList.map((item, index) => {
                            return (
                                <div key={index} className="info-box no-padding">
                                    <div className={"t"}>{ item.title }</div>
                                    <div className={"i"}>{ item.textContent }</div>
                                    <div className={"pic"}>
                                        { item.imgs ? item.imgs.split(',').map((v,i) => {
                                            return <img key={i} src={v} />;
                                        }) : null }
                                    </div>
                                </div>
                            );
                        }) : null
                    }
                </div>
                <div className="box2">
                    <div className="box2-btn a">
                        <a href={`tel:${d.phone}`}>
                            <img src={IconPhone} />
                            <span>联系门店</span>
                        </a>
                    </div>
                    <div className="box2-btn a fn" onClick={() => this.onGoMap(d)}>
                            <img src={IconRoad} />
                            <span>导航</span>
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
    stationDetail: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({
        stationDetail: state.n.stationDetail,
    }),
    (dispatch) => ({
        actions: bindActionCreators({ saveMapAddr, getStationDelForId }, dispatch),
    })
)(HomePageContainer);