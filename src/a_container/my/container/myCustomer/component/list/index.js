/**列表li的样式
 * 目前分为：
 * 分销用户： distribution 有分销权按钮提示等
 * 未绑定用户： unbind 只显示手机号等
 * 其他用户： normal 无分销权按钮
 * */
import React from 'react';
import P from 'prop-types';
import './index.scss';
import tools from '../../../../../../util/all';
import ImgDefault from '../../../../../../assets/default-head.jpg';
import ImgA1 from '../../../../../../assets/one_yikatong@3x.png';
import ImgA2 from '../../../../../../assets/two_yikatong@3x.png';
import ImgB1 from '../../../../../../assets/one_jingshui@3x.png';
import ImgB2 from '../../../../../../assets/two_jingshui@3x.png';
import ImgC1 from '../../../../../../assets/one_shipin@3x.png';
import ImgC2 from '../../../../../../assets/two_shipin@3x.png';
import ImgD1 from '../../../../../../assets/one_liliao@3x.png';
import ImgD2 from '../../../../../../assets/two_liliao@3x.png';
import ImgE1 from '../../../../../../assets/one_pingguka@3x.png';
import ImgE2 from '../../../../../../assets/two_pingguka@3x.png';

class List extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // 主账号子账号点击要查下一层
    onCallBack() {
        this.props.onCallBack && this.props.onCallBack(this.props.data);
    }

    // 问号被点击
    onQue(d) {
        this.props.onQueClick && this.props.onQueClick(d);
    }

    //  1-智能净水,2-健康食品,3-生物科技,4-健康睡眠,5-健康体检
    makePower(str) {
        const res = [];
        const s = str ? str.split(',') : [];
        res.push(s.includes('1') ? <img key={0} src={ImgB1} /> : <img key={0} src={ImgB2} />);
        res.push(s.includes('2') ? <img key={1} src={ImgC1} /> : <img key={1} src={ImgC2} />);
        res.push(s.includes('3') ? <img key={2} src={ImgD1} /> : <img key={2} src={ImgD2} />);
        res.push(s.includes('5') ? <img key={3} src={ImgE1} /> : <img key={3} src={ImgE2} />);
        return res;
    }

    makeDom(u, type) {
        if (!u || u.id === undefined) {
            return null;
        }
        switch(type) {
            // 分销客户
            case 'distribution': return (
                <li className="customer-li page-flex-row" onClick={() => this.onCallBack()}>
                    <div className="photo flex-none"><img src={u.headImg || ImgDefault} /></div>
                    <div className="name flex-auto">
                        <div className="title all_nowarp">{u.nickName}</div>
                        <div className="lit black">e家号：{u.id}</div>
                        <div className="lit mt">身份：{tools.getNameByUserType(u.userType)}<span>{u.ambassadorTime}</span></div>
                        <div className="lit fxq">分销权：<div>{this.makePower(u.incomePermission)}</div><span className="que" onClick={() => this.onQue(u)}>?</span></div>
                    </div>
                </li>
            );
            case 'unbind' : return (
                <li className="customer-li page-flex-row" onClick={() => this.onCallBack()}>
                    <div className="photo flex-none"><img src={u.headImg || ImgDefault} /></div>
                    <div className="name flex-auto">
                    <div className="title all_nowarp">{u.nickName}</div>
                    <div className="lit black">联系方式：{u.mobile}</div>
                    <div className="lit">身份：未绑定用户</div>
                    </div>
                </li>
            );
            default: return (
             <li className="customer-li page-flex-row" onClick={() => this.onCallBack()}>
                <div className="photo flex-none"><img src={u.headImg || ImgDefault} /></div>
                <div className="name flex-auto">
                <div className="all_nowarp">{u.nickName}</div>
                <div className="lit black">e家号：{u.id}</div>
                <div className="lit">身份：{tools.getNameByUserType(u.userType)}<span>{u.ambassadorTime}</span></div>
                </div>
            </li>
            );
        }
    }

    render() {
        return this.makeDom(this.props.data, this.props.type);
    }
}

List.propTypes = {
    type: P.string,
    data: P.any,
    onCallBack: P.func,
    onQueClick: P.func,
};

export default List;
