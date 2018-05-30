/* Test */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.scss';
import P from 'prop-types';
import ImgTest from '../../assets/test/new.png';
import anime from 'animejs';
import tools from '../../util/all';
import ImgCode from './code.jpg';
class TestContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        document.title = 'Test';

    }

    componentWillUnmount(){

    }


    render() {
        return (
            <div className="page-test">
                <img src={ImgCode} />
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
