import React from 'react';
import { Link } from 'react-router-dom';
import P from 'prop-types';
import './index.scss';
import WaterWave from 'water-wave';
import { urls } from '../../util/data';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNow: '',
            show: true,
        };
    }

    // 组件初始化完毕时触发
    componentDidMount() {
        this.setChecked(this.props.location);
    }

    UNSAFE_componentWillReceiveProps(nextP) {
        if (nextP.location !== this.props.location) {
            this.setChecked(nextP.location);
        }
    }

    // 设置哪一个该被选中
    setChecked(location) {
        const p = location.pathname.split('/');
        const path = p[1];

        this.setState({
            pathNow: path,
            show: ['home', 'intel', 'healthy', 'my'].indexOf(path) >= 0 && p.length<=2,  // 只有主页几个页面需要显示底部菜单
        });
    }

    render() {
        return ( this.state.show ? [
            <div className="menu" key="0">
                <div className={this.state.pathNow === 'home' ? "menu-item check" : 'menu-item'}>
                    <Link to="/home">
                        <div className="menu-icon icon1" />
                        <div className="title">首页</div>
                    </Link>
                    <WaterWave color="#cccccc" press="down"/>
                </div>
                <div className={this.state.pathNow === 'healthy' ? "menu-item check" : 'menu-item'}>
                    <Link to="/healthy">
                        <div className="menu-icon icon3" />
                        <div className="title">健康服务</div>
                    </Link>
                    <WaterWave color="#cccccc" press="down"/>
                </div>
                <div className={this.state.pathNow === 'my' ? "menu-item check" : 'menu-item'}>
                    <Link to="/my">
                        <div className="menu-icon icon4" />
                        <div className="title">我的e家</div>
                    </Link>
                    <WaterWave color="#cccccc" press="down"/>
                </div>
            </div>,
            <div className="menu-zw" key="1"/>
        ] : null);
    }
}

Menu.propTypes = {
    history: P.any,
    location: P.any,
};

export default Menu;
