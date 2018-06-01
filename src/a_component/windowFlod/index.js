/* 浮窗 */
import React from 'react';
import P from 'prop-types';
import ImgGwc from './assets/gwc1@3x.png';
import ImgKf from './assets/kf1@3x.png';
import './index.scss';
class WindowFlod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    shoudBeShow() {
        console.log(this.props.location.pathname.split('/').slice(1,2));
        if(['home', 'my', 'healthy', 'shop'].includes(this.props.location.pathname.split('/').slice(-1)[0])){
            return 'window-flod show';
        }
        return 'window-flod';
    }

    render() {
        return (
            <div className={this.shoudBeShow()}>
                <div className={"btn"} onClick={() => this.props.history.push('/shop/shoppingcar')}>
                    <img src={ImgGwc} style={{ marginLeft: '-3px' }}/>
                    <div className={this.props.shoppingCarNum > 0 ? 'shopping-num show' : 'shopping-num'}>{ this.props.shoppingCarNum }</div>
                </div>
                <div className={"line"}/>
                <div className={"btn"} onClick={() => this.props.history.push('/my/kf')}><img src={ImgKf} /></div>
            </div>
        );
    }
}

WindowFlod.propTypes = {
    location: P.any,
    history: P.any,
    shoppingCarNum: P.number, // 购物车中商品的数量
};

export default WindowFlod;
