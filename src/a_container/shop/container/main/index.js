/* 我的e家 - 商城主页 */

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

import { SearchBar, Tabs } from 'antd-mobile';
import Img1 from '../../../../assets/test/new.png';
import ImgCar from '../../../../assets/shop/jrgwc@3x.png';
// ==================
// 本页面所需action
// ==================

import { getProDuctList, listProductType } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // 如果state中没有所有的产品信息，就重新获取
    if (!this.props.allProducts.length) {
        this.props.actions.getProDuctList();
    }
    // 如果state中没有所有的产品类别，就重新获取
    // if (!this.props.allProductTypes.length) {
    //   this.props.actions.listProductType();
    // }
  }

  // 工具 - 通过型号ID查型号名称
  getTypeNameById(id) {
    const result = this.props.allProductTypes.find((item) => Number(item.id) === Number(id));
    return result ? result.name : '';
  }

  // 点击一个商品，进入商品详情页
    onProClick(id) {
      this.props.history.push(`/shop/gooddetail/${id}`);
    }

  render() {
      const d = [...this.props.allProducts].sort((a, b) => a-b);
    return (
      <div className="flex-auto page-box shop-main">
          <div className="title-pic">
              <img src={Img1} />
              <SearchBar className="search" placeholder="试试搜：翼猫智能净水" maxLength={16} />
          </div>
          <div className="body-box">
              <Tabs
                tabs={d.map((item, index) => {
                    return { title: item.name, id: item.id };
                })}
                useOnPan={false}
                renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
                onChange={(tab, index) => {}}
              >
                  {
                      d.map((v, i) => {
                          return (
                              <div key={i} className="tab-box">
                                  <div>
                                      {
                                          v.productList.filter((vv, ii) => !(ii % 2)).map((vvv, iii) => {
                                              return (
                                                  <div className="a-product" key={iii} onClick={() => this.onProClick(vvv.id)}>
                                                      <img src={vvv.productImg && vvv.productImg.split(',')[0]} />
                                                      <div className="p-t">{vvv.typeModel && vvv.typeModel.name}</div>
                                                      <div className="p-m">￥{vvv.typeModel && vvv.typeModel.price}</div>
                                                      <div className="p-i">
                                                          <span>已售：{vvv.buyCount || 0}</span>
                                                          <img src={ImgCar} />
                                                      </div>
                                                  </div>
                                              );
                                          })
                                      }
                                  </div>
                                  <div>
                                      {
                                          v.productList.filter((vv, ii) => ii % 2).map((vvv, iii) => {
                                              return (
                                                  <div className="a-product" key={iii} onClick={() => this.onProClick(vvv.id)}>
                                                      <img src={vvv.productImg && vvv.productImg.split(',')[0]} />
                                                      <div className="p-t">{vvv.typeModel && vvv.typeModel.name}</div>
                                                      <div className="p-m">￥{vvv.typeModel && vvv.typeModel.price}</div>
                                                      <div className="p-i">
                                                          <span>已售：{vvv.buyCount || 0}</span>
                                                          <img src={ImgCar} />
                                                      </div>
                                                  </div>
                                              );
                                          })
                                      }
                                  </div>
                              </div>
                          );
                      })
                  }
              </Tabs>
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
  allProducts: P.array,
  allProductTypes: P.array,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      allProducts: state.shop.allProducts,
      allProductTypes: state.shop.allProductTypes,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ getProDuctList, listProductType }, dispatch),
  })
)(HomePageContainer);
