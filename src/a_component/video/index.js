/** 步进器组件 **/
import React from 'react';
import P from 'prop-types';
import './index.scss';
import ImgPlay from './assets/play.png';
class VideoLuo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
    }

    componentWillReceiveProps() {

    }

    render() {
        return (
            <div className="react-video-luo">
                <video
                    playsinline
                    width="100%"
                    height="100%"
                    preload
                    src={this.props.src}
                />
                <div>
                    {}
                </div>
            </div>
        );
    }
}

VideoLuo.propTypes = {
    src: P.string,
    pic: P.string,
};

export default VideoLuo;
