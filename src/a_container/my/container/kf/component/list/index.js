/** list **/
import React from 'react';
import P from 'prop-types';
import './index.scss';
import ImgRobot from '../../assets/robot@3x.png';
import tools from '../../../../../../util/all';
class StepperLuo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    // 工具 - 根据qId找出对应的data数据
    getDataByQid(id) {
        //return this.props.data.find((item) => item.id === id) || {};
        return {list:[]};
    }

    // 构造不同类型的
    makeBody(d) {
        if(d.type === 1) { // 返回当前时间
            return <div className="type1">{ tools.dateToTime(d.date) }</div>;
        } else if(d.type === 2){
            return <div className="type2">机器人助手为您服务</div>;
        } else if(d.type === 3){
            return <div className="type3"><div className="head-pic"><img className="head" src={ImgRobot} /></div><div className="word-box-l all_warp">您好，我是您的机器人助手，请问有什么可以帮助您的吗？先来看看热门问题吧，也可以试试下方的人工咨询</div></div>;
        } else if (d.type === 4) { // 问题，输出指定分类的问题
            const nowq = this.getDataByQid(d.qId);
            return (
                <div className="type4">
                    <div className="head-pic"><img className="head" src={ImgRobot} /></div>
                    <div className="word-box-l all_warp">
                        <div className="t">{ nowq.title || "问题分类" }</div>
                        <ul className="qs">
                            { nowq.list.map((item, index) => {
                                return <div key={index} className="q">{ item.q }</div>;
                            })}
                            <li key={1} className="q">问题1问题1问题1问题1问题1问题1问题1问题1问题1问题1问题1问题1问题1问题1</li>
                            <li key={2} className="q">问题2问题2问题2问题2问题2问题2问题2问题2问题2问题2</li>
                            <li key={3} className="q">问题3问题3问题3问题3问题3</li>
                        </ul>
                    </div>
                </div>
            );
        }
    }

    render() {
        const d = this.props.listOne;
        return (
            <div className="list-one" style={this.props.style}>
                { this.makeBody(d) }
            </div>
        );
    }
}

StepperLuo.propTypes = {
    listOne: P.any,
    style: P.any,
};

export default StepperLuo;
