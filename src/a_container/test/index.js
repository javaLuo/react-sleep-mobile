/* 404 NotFound */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
// import Img404 from '../../assets/not-found.png';
import Luo from 'iscroll-luo';
// import Luo from '../../a_component/iscrollLuo';
class TesteContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [1,2,3],
    };
  }

    onDown() {
      this.setState({
          data: [3,2,1]
      });
    }
    onUp() {
      this.setState({
          data: [...this.state.data, ...this.state.data],
      });
    }
  render() {
    return (
      <div className="page-test">
        <div style={{ width: '100vw', height: '100vh' }}>
          <Luo
              onPullDownRefresh={() => this.onDown()}
              onPullUpLoadMore={() => this.onUp()}
          >
            <ul>
                {
                  this.state.data.map((item, index) => {
                      return <li key={index}>{item}</li>;
                  })
                }
            </ul>
          </Luo>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

TesteContainer.propTypes = {
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
)(TesteContainer);
