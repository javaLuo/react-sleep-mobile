/* 健康管理 - 选择体检服务中心 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';
import tools from '../../../../util/all';
// ==================
// 所需的所有组件
// ==================
import { Picker, Button, List } from 'antd-mobile';
import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgDh from '../../../../assets/daohang@3x.png';
import ImgRen from '../../../../assets/ren@3x.png';
import ImgAddr from '../../../../assets/dianhua@3x.png';
import ImgPhone from '../../../../assets/dizhi@3x.png';
import ImgCard from '../../../../assets/xuanzeka@3x.png';
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
        areaData: [],   // 区域所有数据
    };
  }

  render() {
    return (
      <div className="page-pre-check">
          <Picker
            data={this.state.areaData}
            extra="请选择区域"
          >
              <List.Item>选择区域</List.Item>
          </Picker>
          <div className="thefooter">
              <Button type="primary" onClick={() => this.props.history.push('/healthy/addreport')}>立即预约</Button>
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
