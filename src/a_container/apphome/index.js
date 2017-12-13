/* APP的主页 */

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
import { Carousel, Icon, List, Toast } from 'antd-mobile';
import imgDefalut from '../../assets/logo-img.png';
// ==================
// 本页面所需action
// ==================

import { getProDuctList } from '../../a_action/shop-action';

// ==================
// Definition
// ==================
const Item = List.Item;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        imgHeight: '200px',
    };
  }

  componentWillMount(){

  }

  componentDidMount() {
    if(!this.props.allProducts || this.props.allProducts.length === 0) {
      this.props.actions.getProDuctList();
    }
    this.getUserInfo();
  }

  // 安卓
  getUserInfo() {
    if(typeof AndroidDataJs !== 'undefined') {
        const id = AndroidDataJs.getAppString('id');
        Toast.info('获取到的ID：'+ id);
    } else {
      Toast.info('没有找到AndroidDataJs对象');
    }
  }

  render() {
      const user = sessionStorage.getItem('userinfo');
    return (
      <div className="flex-auto page-box apphome-page">
          {/* 产品列表 */}
          {
            this.props.allProducts.map((theType, i) => {
              return (
                  <div key={i} className="the-list">
                    <ul className="list">
                        { theType.productList.filter((item) => item.onShelf).map((item, index) => {
                            return (
                                <li key={index}>
                                  <Link to={`/shop/gooddetail/${item.id}`}>
                                    <div className="pic flex-none page-flex-row flex-jc-center flex-ai-center">{ item.detailImg ? <img src={item.detailImg} /> : <img className='default' src={imgDefalut}/>}</div>
                                    <div className="detail flex-auto page-flex-col">
                                      <div className="t flex-none all_nowarp">{item.name}</div>
                                      <div className="i flex-auto">
                                        <div className="all_nowarp2" />
                                      </div>
                                      <div className="k page-flex-row flex-jc-sb flex-none">
                                        <span>￥ <i>{item.price}</i></span>
                                        <span className="btn">立即购买</span>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                            );
                        })}
                    </ul>
                  </div>
              );
            })
          }
        <List>
          <Item arrow="horizontal" multipleLine onClick={() => this.props.history.push(user ? '/my/order' : '/login')}>我的订单</Item>
          <Item arrow="horizontal" multipleLine onClick={() => this.props.history.push(user ? '/healthy/mycard' : '/login')}>我的体检卡</Item>
          <Item arrow="horizontal" multipleLine extra={'翼猫健康e家'}>微信公众号</Item>
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
  actions: P.any,
  allProducts: P.array, // 所有的产品
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allProducts: state.shop.allProducts,  // 所有的产品  数组
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getProDuctList }, dispatch),
  })
)(HomePageContainer);