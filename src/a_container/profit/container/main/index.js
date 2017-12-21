/* 收益管理 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import Echarts from 'echarts';
import './index.scss';
// ==================
// 所需的所有组件
// ==================
import { List } from 'antd-mobile';
// ==================
// 本页面所需action
// ==================


// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
      const me = this;
      // setTimeout是因为初次加载时，CSS可能还没加载完毕，导致图表样式有问题
      setTimeout(() => {
          const dom = Echarts.init(document.getElementById('echarts-1'));
          dom.setOption(me.makeOption(), true);
          window.onresize = dom.resize;
      }, 16);
  }

    // 处理图表数据
    makeOption(data = null) {
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: (p) => {
                   return `<span class="dit" style="color:${p.color}">·</span>${p.data.name}：<br/>￥${p.data.value}`;
                }
            },
            series: [
                {
                    name:'累计收益',
                    type:'pie',
                    radius: ['55%', '70%'],
                    avoidLabelOverlap: false,
                    color: ['#ffb937', '#5c99ff', '#9942f9', '#ff4e83'],
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            color: '#333',
                            fontSize: 22,
                            formatter: (p) => {
                                return '￥999999.00\n\r累计收益';
                            }
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:335, name:'净水设备'},
                        {value:310, name:'健康食品'},
                        {value:234, name:'生物理疗'},
                        {value:135, name:'健康体检'},
                    ]
                }
            ]
        };
        return option;
    }

  render() {
    return (
      <div className="profit-main">
        <div className="charts-box">
          <div id="echarts-1" className="echarts" />
          <div className="center-label">
              <div className="t">￥999999.00</div>
              <div className="label">累计收益</div>
          </div>
        </div>
          <ul className="data-ul all_clear">
              <li><i style={{ backgroundColor: '#ffb937' }}/>净水设备：￥9999.00</li>
              <li><i style={{ backgroundColor: '#5c99ff' }}/>健康食品：￥9999.00</li>
              <li><i style={{ backgroundColor: '#9942f9' }}/>生物理疗：￥9999.00</li>
              <li><i style={{ backgroundColor: '#ff4e83' }}/>健康体检：￥9999.00</li>
          </ul>
          <List>
              <Item arrow="horizontal" onClick={() => this.props.history.push('/profit/prodetail')}>收益明细</Item>
          </List>
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
