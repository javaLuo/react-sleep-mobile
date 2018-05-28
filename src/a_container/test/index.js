/* Test */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.scss';
import P from 'prop-types';
import ImgTest from '../../assets/test/new.png';
import anime from 'animejs';
class TestContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.canvas = null;
        this.ctx = null;
        this.video = null;
        this.wh = {w: 320, h: 100};
        this.timer = null;
    }

    componentDidMount() {
        document.title = 'Test';
        console.log({a:this.video, b: this.canvas});
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx = this.canvas.getContext('2d');
    }

    componentWillUnmount(){
        cancelAnimationFrame(this.timer);
    }

    // 开始播放
    onPlay = () => {
     this.videoOutputCanvasSize(this.video, this.canvas);
     this.video.play();
     this.videoOutputCanvas();
    };

    // 暂停
    onPause = () => {
        cancelAnimationFrame(this.timer);
        this.video.pause();
    };

    // 计算视频输出到canvas的最终大小（根据canvas尺寸动态缩放）
    videoOutputCanvasSize(video, canvas) {
        const canvas_size = canvas.clientWidth/canvas.clientHeight;
        const video_size = video.videoWidth/video.videoHeight;
        const res = {
            w: canvas.clientWidth,
            h: canvas.clientHeight,
        };
        if(canvas_size >= video_size){ // canvas比video更扁
            res.w = canvas.clientHeight * video_size;
        } else {
            res.h = canvas.clientWidth / video_size;
        }
        console.log('运行？', res);
        this.wh = res;
        return res;
    }

    videoOutputCanvas() {
        this.timer = requestAnimationFrame(() => this.videoOutputCanvas());
        const wh = this.wh;
        console.log('绘图：', (this.canvas.clientWidth - wh.w)/2, (this.canvas.clientHeight - wh.h)/2, wh.w, wh.h);
        this.ctx.drawImage(this.video, (this.canvas.clientWidth - wh.w)/2, (this.canvas.clientHeight - wh.h)/2, wh.w, wh.h);
        this.ctx.drawImage(document.getElementById('testimg'), 0,0, 100, 100);
    }

    render() {
        return (
            <div className="page-test">
                <div className="video-box">
                    <canvas className="the-canvas" ref={(dom)=>this.canvas=dom}/>
                </div>
                <button onClick={this.onPlay}>PLAY</button>
                <button onClick={this.onPause}>PAUSE</button>
                <video
                    className="the-video"
                    loop
                    src={'http://hra.emall.online/static/pImages/2018/05/25/CBXSgPLlBNFrGcxo.mp4'}
                    // x5-video-player-type="h5"
                   // x5-video-player-fullscreen="true"
                    x5-video-orientation="portrait"
                    x5-playsinline="true"
                    x-webkit-airplay="allow"
                    playsInline
                    webkit-playsinline="true"
                    preload="true"
                    ref={(dom)=>this.video = dom}
                />
                <img id="testimg" src={ImgTest} />
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
        actions: bindActionCreators({ }, dispatch),
    })
)(TestContainer);
