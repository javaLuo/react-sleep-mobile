/* Test */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.scss';
import P from 'prop-types';
import anime from 'animejs';
class TestContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.p = null;
    }

    componentWillMount() {

    }
    componentDidMount() {
        document.title = 'Test';
        this.play();
    }

    play() {
        const cssSelector = anime({
            targets: '#cssSelector',
            translateX: [
                { value: 100, duration: 1500 },
                { value: 0, duration: 800 }
            ],
            backgroundColor: '#000',
            rotate: '120deg',
            duration: 3000,
            loop: true
        });
        console.log(cssSelector);
        this.p = cssSelector;
    }

    onPlay = () => {
      this.p.play();
    };

    render() {
        return (
            <div className="page-test">
                <div id={"cssSelector"} style={{ backgroundColor: '#fff' }}>
                    <div className="line">
                        <div className="square el">1</div>
                    </div>
                </div>
                <button onClick={this.onPlay}>PLAY</button>
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
