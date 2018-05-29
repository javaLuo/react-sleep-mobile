/* Test */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.scss';
import P from 'prop-types';
import ImgTest from '../../assets/test/new.png';
import anime from 'animejs';
import tools from '../../util/all';
class TestContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        document.title = 'Test';
        this.init();
    }

    componentWillUnmount(){
        cancelAnimationFrame(this.timer);
    }

    orientationHandler = (event) => {
        document.getElementById("alpha").innerHTML = tools.point2(event.alpha);
        document.getElementById("beta").innerHTML = tools.point2(event.beta);
        document.getElementById("gamma").innerHTML = tools.point2(event.gamma);
        document.getElementById("heading").innerHTML = tools.point2(event.webkitCompassHeading);
        document.getElementById("accuracy").innerHTML = tools.point2(event.webkitCompassAccuracy);

    };

    motionHandler = (event) => {
        document.getElementById("interval").innerHTML = event.interval;
        var acc = event.acceleration;
        document.getElementById("x").innerHTML = tools.point2(acc.x);
        document.getElementById("y").innerHTML = tools.point2(acc.y);
        document.getElementById("z").innerHTML = tools.point2(acc.z);
        var accGravity = event.accelerationIncludingGravity;
        document.getElementById("xg").innerHTML = tools.point2(accGravity.x);
        document.getElementById("yg").innerHTML = tools.point2(accGravity.y);
        document.getElementById("zg").innerHTML = tools.point2(accGravity.z);
        var rotationRate = event.rotationRate;
        document.getElementById("Ralpha").innerHTML = tools.point2(rotationRate.alpha);
        document.getElementById("Rbeta").innerHTML = tools.point2(rotationRate.beta);
        document.getElementById("Rgamma").innerHTML = tools.point2(rotationRate.gamma);
    };

    init = () => {
        if (window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", this.motionHandler, false);
        } else {
            document.body.innerHTML = "What user agent u r using???";
        }

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", this.orientationHandler, false);
        } else {
            document.body.innerHTML = "What user agent u r using???";
        }
    };

    render() {
        return (
            <div className="page-test">
                <p>左右：<span id="alpha">0</span>
                </p>
                <p>前后：<span id="beta">0</span>
                </p>
                <p>扭转：<span id="gamma">0</span>
                </p>
                <p>指北针指向：<span id="heading">0</span>度</p>
                <p>指北针精度：<span id="accuracy">0</span>度</p>
                <hr />
                <p>x轴加速度：<span id="x">0</span>米每二次方秒</p>
                <p>y轴加速度：<span id="y">0</span>米每二次方秒</p>
                <p>z轴加速度：<span id="z">0</span>米每二次方秒</p>
                <hr />
                <p>x轴加速度(考虑重力加速度)：<span id="xg">0</span>米每二次方秒</p>
                <p>y轴加速度(考虑重力加速度)：<span id="yg">0</span>米每二次方秒</p>
                <p>z轴加速度(考虑重力加速度)：<span id="zg">0</span>米每二次方秒</p>
                <hr />
                <p>左右旋转速度：<span id="Ralpha">0</span>度每秒</p>
                <p>前后旋转速度：<span id="Rbeta">0</span>度每秒</p>
                <p>扭转速度：<span id="Rgamma">0</span>度每秒</p>
                <hr />
                <p>上次收到通知的间隔：<span id="interval">0</span>毫秒</p>
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
