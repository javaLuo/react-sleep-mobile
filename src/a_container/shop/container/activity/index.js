/* 活动详情页 */

// ==================
// 所需的各种插件
// ==================
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import './index.scss';

// ==================
// 所需的所有组件
// ==================

import { Toast } from 'antd-mobile';
import ImgLogo from '../../../../assets/logo-img.png';

// ==================
// 本页面所需action
// ==================
import { listByActivityId } from '../../../../a_action/new-action';
// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: {},
    };
  }

  componentWillMount(){

  }

  componentDidMount() {
      document.title = '活动详情';
      const id = Number(this.props.location.pathname.split('/').pop());
      if(id){
          this.getData(id);
      }
  }

    componentWillReceiveProps(nextP) {
      if(nextP.location !== this.props.location) {
          const id = Number(nextP.location.pathname.split('/').pop());
          this.getData(id);
      }
    }

    componentWillUnmount() {
      Toast.hide();
    }
  getData(id) {
      const params = {
          activityId: id,
      };
      Toast.loading('请稍后...', 0);
      this.props.actions.listByActivityId(params).then((res) => {
          if(res.status === 200) {
            this.setState({
                data: res.data || {},
            });
            Toast.hide();
          } else {
            Toast.info(res.message);
          }
      }).catch(() => {
          Toast.hide();
      });
  }

  render() {
      const d = this.state.data;
    return (
      <div className="page-activiey">
          {/* 上方iframe */}
          <div className="activity-iframe">
              <iframe  wmode="transparent" src={d.acUrl} />
          </div>
          {/* 其他推荐 */}
          <div className="others">
              <div className="title">为你推荐</div>
              <ul className="others-ul">
                  {
                      d.recommendProductList && d.recommendProductList.map((item, index) => {
                          return (
                              <li key={index}>
                                  <Link to={`/shop/activity/${item.id}`}>
                                      <img src={item.product.detailImg || ImgLogo} />
                                  </Link>
                              </li>
                          );
                      })
                  }
              </ul>
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
  actions: P.any,
    userinfo: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ listByActivityId }, dispatch),
  })
)(HomePageContainer);
