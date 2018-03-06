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
class List extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onCallBack() {
        this.props.onCallBack && this.props.onCallBack(this.props.data);
    }

    makeDom(u, type) {
        if (!u || u.id === undefined) {
            return null;
        }
        switch(type) {
            // 分销客户
            case 'distribution': return (
                <li className="customer-li page-flex-row flex-ai-center" onClick={() => this.onCallBack()}>
                    <div className="photo flex-none"><img src={u.headImg || ImgDefault} /></div>
                    <div className="name flex-auto">
                        <div className="all_nowarp">{u.nickName}</div>
                        <div className="lit">e家号：{u.id}</div>
                        <div className="lit">身份：{tools.getNameByUserType(u.userType)}</div>
                        <div className="lit mt">分销权：{tools.getNameByUserType(u.userType)}<span>{u.ambassadorTime}</span></div>
                    </div>
                </li>
            );
            case 'unbind' : return (
                <li className="customer-li page-flex-row flex-ai-center" onClick={() => this.onCallBack()}>
                    <div className="photo flex-none"><img src={u.headImg || ImgDefault} /></div>
                    <div className="name flex-auto">
                        <div className="all_nowarp">{u.nickName}</div>
                        <div className="lit">电话：{u.mobile}</div>
                        <div className="lit">身份：未绑定用户</div>
                    </div>
                </li>
            );
            default: return (
                <li className="customer-li page-flex-row flex-ai-center" onClick={() => this.onCallBack()}>
                    <div className="photo flex-none"><img src={u.headImg || ImgDefault} /></div>
                    <div className="name flex-auto">
                        <div className="all_nowarp">{u.nickName}</div>
                        <div className="lit">e家号：{u.id}</div>
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
};

export default List;
