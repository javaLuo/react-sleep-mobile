/* 我的e家 - 主页 */

// ==================
// 所需的各种插件
// ==================

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import P from 'prop-types';
import _ from 'lodash';
import './index.scss';
// ==================
// 所需的所有组件
// ==================

import { Grid } from 'antd-mobile';
import Img1 from '../../../../assets/fenxiang_three@3x.png';

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
    if (!this.props.allProductTypes.length) {
      this.props.actions.listProductType();
    }
  }

  // 工具 - 通过型号ID查型号名称
  getTypeNameById(id) {
    const result = this.props.allProductTypes.find((item) => Number(item.id) === Number(id));
    return result ? result.name : '';
  }

  // 点击宫格触发
  onGridClick(el, index) {
    const me = this;
      $(document.body).animate({'scrollTop': $(me[`a${index}`]).offset().top - 30 + 'px'}, 500);
  }

  // 动态设置下方分类列表
  makeList(types, data) {
    const t = _.cloneDeep(types);
    const d = _.cloneDeep(data);

    const result = t.sort((a, b) => a.sorts - b.sorts).map((item) => {
        const products = d.filter((v, i) => v.typeId === item.id);
        return {text: item.name, id: item.id, products};
    });
    return result;
  }

  render() {
    const r = this.makeList(this.props.allProductTypes, this.props.allProducts);
    return (
      <div className="flex-auto page-box shop-main">
          <div className="title-pic">
              <img src={Img1} />
          </div>
          {/* bar */}
        <Grid
            className="my-grid"
            data={r.map((item) => {
              return {icon: Img1, text: item.text, id: item.id};
            })}
            columnNum={5}
            onClick={(el, index) => this.onGridClick(el, index)}
        />
        {/* 动态配置的列表 */}
        { r.map((item, index) => {
          return (
              <div key={index} className="the-list" ref={(dom) => this[`a${index}`] = dom}>
                <div className="title page-flex-row">
                  <div className="flex-auto">{item.text}</div>
                </div>
                <ul className="list">
                    {item.products && item.products.length ? item.products.map((v, i) => {
                      return (<li key={i}>
                        <Link to={`/shop/gooddetail/${v.id}?time=${Date.now()}`}>
                          <div className="pic flex-none">{v.productImg ? <img src={v.productImg.split(',')[0]} /> : null}</div>
                          <div className="detail flex-auto page-flex-col">
                            <div className="t flex-none">{v.name}</div>
                            <div className="i flex-auto">
                              <div>型号：{v.typeCode}</div>
                              <div>类型：{this.getTypeNameById(v.typeId)}</div>
                            </div>
                            <div className="k flex-none">
                              <span>￥{v.price}</span>
                            </div>
                          </div>
                        </Link>
                      </li>);
                    }) : <li className="nothing"><span>该分类下暂无商品</span></li>}
                </ul>
              </div>
          );
        }) }
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
