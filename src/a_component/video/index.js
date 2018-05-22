/** 仿淘宝顶部组件 **/
import React from 'react';
import P from 'prop-types';
import './index.scss';
import ImgPlay from './assets/play.png';
import IScroll from 'iscroll';
class VideoLuo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,    // 当前scroll到哪一页了
            btnCheck: ~~!this.props.videoSrc,    // 当前选择 0视频1图片
            playing: false, // 视频是否在播放中
        };
        this.video = null;
        this.dom = null;
        this.scrollDom = null;
    }

    componentDidMount() {
        this.scrollDom = new IScroll("#scroll-video", {
            scrollX: true,
            snap: true,
            momentum: false,
            disablePointer: true,
            click: true,
        });

        this.setState({
            btnCheck: ~~!this.props.videoSrc,
        });

        // 滚动结束时，判断当前是哪一页
        this.scrollDom.on('scrollEnd', () => {
            let playing = this.state.playing;
            if (this.scrollDom.currentPage.pageX > 0 - ~~!this.props.videoSrc && this.state.playing) {
                this.video && this.video.pause();
                playing = false;
            }
            this.setState({
                page: this.scrollDom.currentPage.pageX,
                btnCheck: ~~(this.scrollDom.currentPage.pageX > 0 - ~~!this.props.videoSrc),
                playing,
            });
        });
    }

    componentWillReceiveProps(nextP) {
        if(nextP.videoSrc !== this.props.videoSrc){
            this.setState({
                btnCheck: ~~!nextP.videoSrc,
            });
        }
        if(this.props.imgList !== nextP.imgList) {
            setTimeout(() => {
                this.scrollDom.refresh();
            });
        }
    }

    componentWillUnmount() {
        this.scrollDom.destroy();
        this.scrollDom = null;
    }

    onBtnClick(id) {
        console.log('点了：', id, this.state.page);
        let page = this.state.page;
        if(page !== 0 && id === 0) { // 跳到视频页
            page = 0;
            this.scrollDom && this.scrollDom.goToPage(page, 1, 300);
        } else if (page === 0 && id === 1){
            page = 1;
            this.scrollDom && this.scrollDom.goToPage(page, 1, 300);
        }
        this.setState({
            btnCheck: id,
            page,
        });
    }

    maskClick() {
        if(this.state.playing) {    // 播放中
            this.video && this.video.pause();
        } else {
            this.video && this.video.play();
        }
        this.setState({
            playing: !this.state.playing
        });
    }

    render() {
        console.log('是TM级：', this.props.videoSrc, this.state.btnCheck, ~~!this.props.videoSrc);
        return (
            <div className="react-video-luo" >
                <div className="video-luo-scroll" id="scroll-video" ref={(e) => this.dom = e}>
                    <ul className="video-luo-ul" style={{ width: `${(this.props.imgList.length + ~~!!this.props.videoSrc) * 100}%` }}>
                        {
                            this.props.videoSrc ? (
                                <li>
                                    <video
                                        ref={(dom) => this.video = dom}
                                        playsInline
                                        loop
                                        width="100%"
                                        height="100%"
                                        preload="true"
                                        src={this.props.videoSrc}
                                        poster = {this.props.videoPic || null}
                                    />
                                    <div className="mask" onClick={() => this.maskClick()}>
                                        <img className="play-icon all_trans" src={ImgPlay} style={{ opacity: ~~!this.state.playing }}/>
                                    </div>
                                </li>
                            ) : null
                        }
                        {
                            this.props.imgList.map((item, index) => {
                              return (
                                  <li key={index}>
                                      <div className="pic-box"><img src={item} /></div>
                                  </li>
                              );
                            })
                        }
                    </ul>
                </div>
                <div className="video-foot">
                    {
                        this.props.videoSrc ? (
                            [
                                <div key="1" className={this.state.btnCheck === 0 ? 'btn check' : 'btn'} onClick={() => this.onBtnClick(0)}><i />视频</div>,
                                <div key="2" className={this.state.btnCheck === 1 ? 'btn check' : 'btn'} onClick={() => this.onBtnClick(1)}>图片</div>
                            ]
                        ) : null
                    }

                    {
                        this.state.btnCheck ? (
                            <div className="pic-num">{`${this.state.page + ~~!this.props.videoSrc}/${this.props.imgList.length}`}</div>
                        ) : null
                    }

                </div>
            </div>
        );
    }
}

VideoLuo.propTypes = {
    videoPic: P.string, // 视频封面
    videoSrc: P.string, // 视频
    imgList: P.array,   // 图片列表
};

export default VideoLuo;
