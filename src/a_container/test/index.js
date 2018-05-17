/* Test */

import React from 'react';
import { connect } from 'react-redux';
import { Button, Toast } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import { wxPay } from '../../a_action/shop-action';
import Config from '../../config';
import './index.scss';
import P from 'prop-types';
import _ from 'lodash';
class TestContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            source: [
                "银翔路819弄中暨大厦",
            ],
            startTime: new Date(),
            endTime: 0,
            data: [],
            res: [],
        };
        this.i=0;
        this.k=0;
        this.citySearch = null;
        this.geocoder = null;
        this.geolocation = null;
        this.timer = null;
    }

    componentWillMount() {
        this.timer = setInterval(() => {
            this.timed();
        }, 16);
    }
    componentDidMount() {
        document.title = 'Test';

        //this.init();
    }

    /** 第1阶段 地图初始化，各种插件 **/
    init() {
        const d = _.cloneDeep(this.state.data);
        d.push('地图基本初始化');
        this.setState({
            data: d,
        });
        this.map = new AMap.Map("container", {
            zoom: 14,
        });
        // 加载定位插件
        this.map.plugin('AMap.Geolocation', () => {
            this.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });

            //this.map.addControl(this.geolocation);    // 左下角的定位按钮
            this.down('地图定位插件加载完成');
        });

        // 加载城市查询插件
        this.map.plugin('AMap.CitySearch', () => {
            this.citySearch = new AMap.CitySearch();
            this.down('城市查询插件加载完成');
        });

        // 加载地址转坐标插件 用于从详细地址找到经纬度
        AMap.service('AMap.Geocoder', () => {
            this.geocoder = new AMap.Geocoder();
            this.down('地址转坐标插件加载完成');
        });
    }

    down(msg) {
        const d = _.cloneDeep(this.state.data);
        d.push(msg);
        this.setState({
            data: d,
        });

        let now = this.i + 1;
        if (now >= 3) {
            this.step2();
        } else {
            this.i = now;
        }
    }

    /** 第2步 **/
    step2() {
        const d = _.cloneDeep(this.state.data);
        d.push('开始定位');
        this.setState({
            data: d,
        });

        // 定位用户当前坐标
        this.geolocation.getCurrentPosition((status, result) => {
            console.log('定位用户当前坐标：', status, result);
            if (status === 'complete') {
                const d = _.cloneDeep(this.state.data);
                d.push(`定位成功：${result.position.lng},${result.position.lat}`);
                d.push(`城市：${result.addressComponent.province},${result.addressComponent.district},${result.addressComponent.township}`);
                d.push('此时需向后端异步请求该区域下的服务站信息');
                this.setState({
                    data: d,
                });
                this.step3(result.position.lng, result.position.lat);
            } else {
                Toast.info('定位失败', 1);
            }
        });
    }

    // 第3步，开始查各城市经纬度
    step3(userlng, userlat) {
        const d = _.cloneDeep(this.state.data);
        d.push('开始通过地址查询经纬度');
        for (let i=0; i< this.state.source.length ;i++) {
            this.checkAddr(this.state.source[i], userlng, userlat);
        }

    }

    // 通过地址查经纬度
    checkAddr(str, userlng, userlat) {
        const d = _.cloneDeep(this.state.data);
        this.geocoder.getLocation(str, (status, result) => {
            if (status === 'complete' && result.info === 'OK' && result.geocodes.length) {
                //TODO:获得了有效经纬度，可以做一些展示工作
                //比如在获得的经纬度上打上一个Marker
                const XYInfo = result.geocodes[0].location;
                d.push(`获取成功：${str},${XYInfo.lng}, ${XYInfo.lat}`);
                this.setState({
                    data: d,
                });
                this.makeLeng(userlng, userlat, XYInfo.lng, XYInfo.lat, str);
            }else{
                //获取经纬度失败
                d.push(`未知地址:${str}`);
                this.setState({
                    data: d,
                });
            }
            this.down3();
        });
    }

    down3() {
        this.k++;
        if (this.k >= this.state.source.length) {
            clearInterval(this.timer);
            const d = _.cloneDeep(this.state.data);
            d.push('全部执行完成，总耗时(s)：', this.state.endTime);
            this.setState({
                data: d,
            });
        }
    }
    // 计算两坐标点间距离
    makeLeng(x1,y1,x2,y2, str) {
        const d = _.cloneDeep(this.state.res);
        const lnglat1 = new AMap.LngLat(x1, y1);
        const lnglat2 =  new AMap.LngLat(x2, y2);
        const r = Math.round(lnglat1.distance(lnglat2));
        d.push([str, r]);
        this.setState({
            res: d,
        });
    }

    // 总共用了多少时间
    timed() {
        const time = new Date();
        this.setState({
            endTime: (time.getTime() - this.state.startTime.getTime()) / 1000,
        });
    }
    render() {
        return (
            <div className="page-test">
                <iframe className="the-iframe" wmode="transparent" src="http://a2.rabbitpre.com/m/UnIVJvS"/>
                <div className="test-footer" />
            </div>
        );
    }
}

// ==================
// PropTypes
// ==================

TestContainer.propTypes = {
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ wxPay }, dispatch),
    })
)(TestContainer);
