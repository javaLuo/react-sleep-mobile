import React from 'react';
import { Link } from 'react-router-dom';
import P from 'prop-types';
import { TabBar } from 'antd-mobile';
import './index.scss';

const TabItem = TabBar.Item;
class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNow: '',
        };
    }

    // 组件初始化完毕时触发
    componentDidMount() {
        this.setChecked();
    }

    // 设置哪一个该被选中
    setChecked() {
        console.log('MENU:', this.props.location);
        const path = this.props.location.pathname.split('/')[1];
        this.setState({
            pathNow: path,
        });
    }

    render() {
        return ([
            <div className="menu" key="0">
                <div className={this.state.pathNow === 'home' ? "menu-item check" : 'menu-item'}>
                    <Link to="/home">
                        <div className="menu-icon icon1" />
                        <div className="title">首页</div>
                    </Link>
                </div>
                <div className={this.state.pathNow === 'intel' ? "menu-item check" : 'menu-item'}>
                    <Link to="/intel">
                        <div className="menu-icon icon2" />
                        <div className="title">智能物联</div>
                    </Link>
                </div>
                <div className={this.state.pathNow === 'healthy' ? "menu-item check" : 'menu-item'}>
                    <Link to="/healthy">
                        <div className="menu-icon icon3" />
                        <div className="title">健康管理</div>
                    </Link>
                </div>
                <div className={this.state.pathNow === 'my' ? "menu-item check" : 'menu-item'}>
                    <Link to="/my">
                        <div className="menu-icon icon4" />
                        <div className="title">我的e家</div>
                    </Link>
                </div>
            </div>,
            <div className="menu-zw" key="1"/>
        ]);
    }
}

Menu.propTypes = {
    history: P.any,
    location: P.any,
};

export default Menu;
