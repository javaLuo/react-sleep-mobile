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
import IconRoad from './assets/icon_road@3x.png';
// ==================
// 本页面所需action
// ==================

import { saveMapAddr } from '../../../../a_action/shop-action';
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
            pageNum: 1,
            pageSize: 10,
            search: undefined,  // 搜索条件
            refreshing: false, // 加载更多搜索中
            userLng: null, // 用户坐标X
            userLat: null, // 用户坐标Y
            resType: 1, // 0查询的是最近的，1普通的查询
            downNow: false, // 当前查询是否已全部加载完毕
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


    getData() {
        return; // 占时还没有接口
        const me = this;
        const params = {

        };
        Toast.loading('请稍后...', 0);
        this.props.actions.stationNearBy(tools.clearNull(params)).then((res) => {
            if (res.status === 200) {
                me.setState({
                    data: res.data,
                });
                Toast.hide();
            } else {
                Toast.fail('查询失败，请重试',1);
            }
        }).catch(() => {
            Toast.fail('查询失败，请重试', 1);
        }).finally(() => {

        });
    }

    // 去导航，把所有信息都TMD的传过去
    onGoMap(item) {
        this.props.actions.saveMapAddr(item);
        setTimeout(() => this.props.history.push('/downline/map'));
    }

    render() {
        return (
            <div className="page-expr-detail">
                <div className="box1">
                    <Carousel
                        className="my-carousel"
                        autoplay={true}
                        infinite={true}
                        swipeSpeed={35}
                    >
                        {[1,2,3].map((item, index) => (
                            <a
                                key={index}
                                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                                target="_blank"
                            >
                                <img
                                    src={'https://isluo.com/kernel/index/img/welcome/theback.jpg'}
                                    style={{ width: '100%', verticalAlign: 'top' }}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({ imgHeight: 'auto' });
                                    }}
                                />
                            </a>
                        ))}
                    </Carousel>
                    <div className="info-box">
                        <div className="t">上海市嘉定区翼猫体验服务中心</div>
                        <div className="star-row">
                            <div>
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                                <img src={ImgStar1} />
                            </div>
                            <div className="word">满意度：98%</div>
                        </div>
                        <div className="addr-info">
                            <img src={ImgAddr} />
                            <span>上海市嘉定区南翔镇众仁路399号B座1楼</span>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">关于门店</div>
                        <div className="about-row">
                            <div><span>成立时间：</span><span>2017年03月09日</span></div>
                            <div><span>门店规模：</span><span>100m2</span></div>
                            <div><span>员工数量：</span><span>15</span></div>
                            <div><span>营业时间：</span><span>每天8:00 - 22:00</span></div>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">服务项目</div>
                        <div className="server-row">
                            <div>
                                <img src={IconHeart} />
                                <div>产品体验</div>
                            </div>
                            <div>
                                <img src={IconServer} />
                                <div>售后服务</div>
                            </div>
                            <div>
                                <img src={IconHealthy} />
                                <div>健康评估</div>
                            </div>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">门店介绍</div>
                        <div>
                           总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">服务理念</div>
                        <div>
                            总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala总部区balabala
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">媒体报道</div>
                        <div className="img-row">
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">门店荣誉</div>
                        <div className="img-row">
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="t">资质/授权</div>
                        <div className="img-row">
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                            <img src={ImgTest} />
                        </div>
                    </div>
                </div>
                <div className="box2">
                    <div className="box2-btn a">
                        <a href="tel:13600000000">
                            <img src={IconPhone} />
                            <span>联系门店</span>
                        </a>
                    </div>
                    <div className="box2-btn a fn">
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
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ saveMapAddr }, dispatch),
    })
)(HomePageContainer);