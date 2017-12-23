/* 测试页 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import $ from 'jquery';
// import Img404 from '../../assets/not-found.png';
// import Luo from 'iscroll-luo';
// import Luo from '../../a_component/iscrollLuo';
import Config from '../../config';
import { getProDuctList } from '../../a_action/shop-action';

import { Button } from 'antd-mobile';
class TesteContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [1,2,3],
        test: '',
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

    onClick1() {
        this.props.actions.getProDuctList().then((res) => {
          this.setState({
              test: JSON.stringify(res),
          });
        }).catch((err) => {
            this.setState({
                test: JSON.stringify(err),
            });
        });
    }

    onClick2() {
      $.ajax({
          url: `${Config.baseURL}/mall/product/listByType`,
          data: { pageNum: 0, pageSize: 9999, typeId: 1 },
          method: 'post',
          contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
          crossOrigin: true,
          withCredentials: true,
          success: (msg) => {
              this.setState({
                  test: JSON.stringify(msg),
              });
          },
          error: (e) => {
              this.setState({
                  test: JSON.stringify(e),
              });
          }
      });
    }

  render() {
    return (
      <div className="page-test">
        <div style={{ width: '100vw', height: '100vh' }}>
          {/*<Luo*/}
              {/*onPullDownRefresh={() => this.onDown()}*/}
              {/*onPullUpLoadMore={() => this.onUp()}*/}
          {/*>*/}
            {/*<ul>*/}
                {/*{*/}
                  {/*this.state.data.map((item, index) => {*/}
                      {/*return <li key={index}>{item}</li>;*/}
                  {/*})*/}
                {/*}*/}
            {/*</ul>*/}
          {/*</Luo>*/}
          <Button onClick={() => this.onClick1()}>A.reqwest请求</Button><br/>
          <Button onClick={() => this.onClick2()}>B.jquery请求</Button><br/>
          <hr />
          <div>{this.state.test}</div>
        </div>
      </div>
    );
  }
}

// ==================
// PropTypes
// ==================

TesteContainer.propTypes = {
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getProDuctList }, dispatch),
  })
)(TesteContainer);
