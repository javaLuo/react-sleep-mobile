/* 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

import { Carousel, Icon } from 'antd-mobile';
import Img1 from '../../assets/test/test1.jpg';
import Img2 from '../../assets/test/test2.jpg';
import Img3 from '../../assets/test/test3.jpg';
import ImgIcon1 from '../../assets/yanzheng@3x.png';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="flex-auto page-box home-page">
                {/* 顶部轮播 */}
                <Carousel
                    className="my-carousel"
                    autoplay
                    infinite
                    swipeSpeed={35}
                >
                    <img src={Img1} />
                    <img src={Img2} />
                    <img src={Img3} />
                </Carousel>
                {/* bar */}
                <div className="home-bar page-flex-row">
                    <div className="flex-auto">
                        <Link to="/shop"><div>翼猫商城</div></Link>
                    </div>
                    <div className="flex-auto">
                        <Link to="/"><div>翼猫直播</div></Link>
                    </div>
                    <div className="flex-auto">
                        <Link to="/news"><div>健康资讯</div></Link>
                    </div>
                    <div className="flex-auto">
                        <Link to="/downline"><div>翼猫线下服务体验店</div></Link>
                    </div>
                </div>
                {/* 最新直播 */}
                <div className="the-list">
                    <div className="title page-flex-row">
                        <div className="flex-auto">最新直播</div>
                        <div className="flex-none"><Link to="/">更多 &gt;</Link></div>
                    </div>
                    <ul className="list">
                        <li>
                            <Link to="/">
                                <div className="pic flex-none"><img src={Img1} /></div>
                                <div className="detail flex-auto page-flex-col">
                                    <div className="t flex-none">经营智慧</div>
                                    <div className="i flex-auto">
                                        <div>主讲人：刘军老师</div>
                                        <div>2017-09-09 14:20:00</div>
                                    </div>
                                    <div className="k page-flex-row flex-none">
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <div className="pic flex-none"><img src={Img1} /></div>
                                <div className="detail flex-auto page-flex-col">
                                    <div className="t flex-none">经营智慧</div>
                                    <div className="i flex-auto">
                                        <div>主讲人：刘军老师</div>
                                        <div>2017-09-09 14:20:00</div>
                                    </div>
                                    <div className="k page-flex-row flex-none">
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <div className="pic flex-none"><img src={Img1} /></div>
                                <div className="detail flex-auto page-flex-col">
                                    <div className="t flex-none">经营智慧</div>
                                    <div className="i flex-auto">
                                        <div>主讲人：刘军老师</div>
                                        <div>2017-09-09 14:20:00</div>
                                    </div>
                                    <div className="k page-flex-row flex-none">
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* 最新资讯 */}
                <div className="the-list">
                    <div className="title page-flex-row">
                        <div className="flex-auto">最新直播</div>
                        <div className="flex-none"><Link to="/">更多 &gt;</Link></div>
                    </div>
                    <ul className="list">
                        <li>
                            <Link to="/">
                                <div className="pic flex-none"><img src={Img1} /></div>
                                <div className="detail flex-auto page-flex-col">
                                    <div className="t flex-none all_nowarp">经营智慧经营智慧经营智慧经营智慧</div>
                                    <div className="i flex-auto">
                                        <div className="all_nowarp2">简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介</div>
                                    </div>
                                    <div className="k page-flex-row flex-none">
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <div className="pic flex-none"><img src={Img1} /></div>
                                <div className="detail flex-auto page-flex-col">
                                    <div className="t flex-none">经营智慧</div>
                                    <div className="i flex-auto">
                                        <div>主讲人：刘军老师</div>
                                        <div>2017-09-09 14:20:00</div>
                                    </div>
                                    <div className="k page-flex-row flex-none">
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <div className="pic flex-none"><img src={Img1} /></div>
                                <div className="detail flex-auto page-flex-col">
                                    <div className="t flex-none">经营智慧</div>
                                    <div className="i flex-auto">
                                        <div>主讲人：刘军老师</div>
                                        <div>2017-09-09 14:20:00</div>
                                    </div>
                                    <div className="k page-flex-row flex-none">
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                        <span><img src={ImgIcon1}/>222</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    </ul>
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
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({}, dispatch),
    })
)(HomePageContainer);
