/* 商城 - 体验活动主页 */

// ==================
// 所需的各种插件
// ==================
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import P from 'prop-types';
import _ from 'lodash';
import './index.scss';

// ==================
// 所需的所有组件
// ==================

import { Checkbox, SwipeAction, Toast } from 'antd-mobile';
import StepLuo from '../../../../a_component/StepperLuo';
// ==================
// 本页面所需action
// ==================

import { getCarInterface, pushDingDan, getDefaultAttr, deleteShopCar } from '../../../../a_action/shop-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [], // 有效的产品
        checkedAll: false, // 全选按钮是否被选中
        downData: [],   // 已失效的
    };
  }

  componentWillMount(){

  }

  componentDidMount() {
      document.title = '购物车';
      this.getData();
  }

    getData() {
      this.props.actions.getCarInterface().then((res) => {
          if(res.status === 200) {
              const data = res.data.productTypes.map((item) => {
                  const newItem = Object.assign({}, item, { checked: false });
                  newItem.productList.forEach((listItem) => {
                      listItem.checked = false;
                  });
                  return newItem;
              });
              this.setState({
                  data,
                  downData: res.data.expiryList || [],
              });
          } else{
              Toast.info(res.message, 1);
          }
      });
    }

    deleteShopCar(ids) {

      let allId;
      console.log('allID:', ids);
      if(!ids){
          return;
      }
      if(Array.isArray(ids)) {  // 多个
          allId = ids.join(',');
      } else {
          allId = ids;
      }
      this.props.actions.deleteShopCar({shopCartIds: allId}).then((res) => {
          if(res.status === 200) {
              Toast.success('删除成功');
              this.getData();
          } else {
              Toast.info(res.message);
          }
      });
    }
    /**
     * 点选了复选框
     * @id: 被点选对象的ID
     * @lv: 被点选对象的层级，0 - 类别被点击， 1 - 具体的产品被点击, -1 全选按钮被点击
     * */
    onCheckbox(id, lv) {
      const d = _.cloneDeep(this.state.data);
      let checkedAll = this.state.checkedAll;
      if(lv === 0) {
          d.forEach((item) => {
              if(item.id === id) {
                  item.checked = !item.checked;
                  item.productList.forEach((listItem) => {
                      listItem.checked = item.checked;
                  });
              }
          });
      } else if (lv === 1) {
          outer:
          for(let i=0;i<d.length;i++) {
              for(let j=0;j<d[i].productList.length;j++) {
                  if(d[i].productList[j].id === id) {
                      d[i].productList[j].checked = !d[i].productList[j].checked;
                      const num = d[i].productList.filter((item) => item.checked);
                      if (num.length === d[i].productList.length) {
                          d[i].checked = true;
                      } else if (num.length === 0) {
                          d[i].checked = false;
                      }
                      break outer;
                  }
              }
          }
      } else if (lv === -1) {
          checkedAll = !this.state.checkedAll;

          d.forEach((item) => {
              item.checked = checkedAll;
              item.productList.forEach((listItem) => {
                  listItem.checked = checkedAll;
              });
          });
      }

      if(lv !== -1){ // 非全选按钮被点击时，需要最终判断是否需要勾选全选按钮
          const obj1 = d.filter((item) => item.checked);    // 所有父级被勾选的
          if(obj1.length < d.length) {
              checkedAll = false;
          } else {
              checkedAll = true;
          }
      }
        this.setState({
            checkedAll,
            data: d,
        });
    }

    // 价格脏检查
    checkPay(data) {
        let pay = 0;
        data.forEach((item) => {
            item.productList.filter((item) => item.checked).forEach((listItem) => {
                // 数量*单价+开户费
                pay += listItem.shopCart.number * listItem.productModel.price + listItem.productModel.openAccountFee;
            });
        });
        pay = Math.floor(pay*100) / 100;
        return pay;
    }

    // 修改商品的数量
    changeNum(num, id) {
        const d = _.cloneDeep(this.state.data);
        outer:
        for(let i=0; i<d.length; i++){
            for(let j=0;j<d[i].productList.length;j++){
                if(d[i].productList[j].id === id) {
                    d[i].productList[j].shopCart.number = num;
                    break outer;
                }
            }
        }
        this.setState({
            data: d,
        });
    }

    // 结算
    onSubmit() {
       // 筛选出勾选的商品
        const arr = [];
        for(let i=0;i<this.state.data.length;i++){
            const obj = this.state.data[i].productList.filter((item) => item.checked);
            arr.push(...obj);
        }
        if(!arr.length){
            Toast.info('您没有勾选商品', 1);
            return;
        }
        this.props.actions.getDefaultAttr(); // 查默认收货地址
        this.props.actions.pushDingDan(arr); // 所选商品放进待结算数组
        this.props.history.push('/shop/confirmpay');
    }
  render() {
    return (
      <div className="shopping-car">
          <div className={"bodys"}>
              {
                  this.state.data.map((item, index) => {
                      return (
                          <div key={index} className="type-box">
                              <div className="title">
                                  <Checkbox checked={item.checked} onChange={() => this.onCheckbox(item.id, 0)}>
                                      <img className="icon" src={item.typeIcon} />
                                      <span className="word">{item.name}</span>
                                  </Checkbox>
                              </div>
                              <div className="list">
                                  {
                                      item.productList && item.productList.map((listItem, listIndex) => {
                                          return (
                                              <SwipeAction
                                                  key={listIndex}
                                                  autoClose
                                                  right={[
                                                      {
                                                          text: '删除',
                                                          onPress: () => this.deleteShopCar(listItem.id),
                                                          style: { color: 'white', padding: '10px' }
                                                      }
                                                  ]}
                                              >
                                                  <div className="one">
                                                      <Checkbox checked={listItem.checked} onChange={() => this.onCheckbox(listItem.id, 1)} />
                                                      <div className="pic">
                                                          <img src={listItem.productImg.split(',')[0]} />
                                                      </div>
                                                      <div className="infos">
                                                          <div className="t all_warp">{listItem.name}</div>
                                                          <div className="num">
                                                              <span className="money">￥{listItem.productModel.price}</span>
                                                              <StepLuo
                                                                  min={1}
                                                                  max={99}
                                                                  value={Math.min(listItem.shopCart.number, 99)}
                                                                  onChange={(num) => this.changeNum(num, listItem.id)}
                                                              />
                                                          </div>
                                                      </div>
                                                  </div>
                                              </SwipeAction>
                                          );
                                      })
                                  }
                              </div>
                          </div>
                      );
                  })
              }
              {/** 下面是已失效的商品 **/}
              {
                  this.state.downData && this.state.downData.length ? (
                      <div className={"downs-t"}>
                          <span className="t">失效商品</span>
                          <span onClick={() => this.deleteShopCar(this.state.downData.map((item) => item.id))}>清空失效商品</span>
                      </div>
                  ) : null
              }
              {
                  this.state.downData.map((item, index) => {
                      return (
                          <div key={index} className="type-box">
                              <div className="title-down">
                                <img className="icon" src={item.typeIcon} />
                                <span className="word">{item.name}</span>
                              </div>
                              <div className="list">
                                  {
                                      item.productList && item.productList.map((listItem, listIndex) => {
                                          return (
                                              <SwipeAction
                                                  key={listIndex}
                                                  autoClose
                                                  right={[
                                                      {
                                                          text: '删除',
                                                          onPress: () => console.log('删除'),
                                                          style: { color: 'white', padding: '10px' }
                                                      }
                                                  ]}
                                              >
                                                  <div className="one">
                                                      <div className="downed">失效</div>
                                                      <div className="pic">
                                                          <img src={listItem.productImg.split(',')[0]} />
                                                      </div>
                                                      <div className="infos">
                                                          <div className="t all_warp">{listItem.name}</div>
                                                          <div className="num">
                                                              <span className="money">￥{listItem.productModel.price}</span>
                                                              <StepLuo
                                                                  min={1}
                                                                  max={99}
                                                                  value={Math.min(listItem.shopCart.number, 99)}
                                                                  onChange={() => {}}
                                                              />
                                                          </div>
                                                          <div className={"foot-info"}>商品已下架</div>
                                                      </div>
                                                  </div>
                                              </SwipeAction>
                                          );
                                      })
                                  }
                              </div>
                          </div>
                      );
                  })
              }
          </div>
          <div className={"footer-control"}>
              <Checkbox
                  checked={this.state.checkedAll}
                onChange={() => this.onCheckbox(null, -1)}
              >
                  <span style={{ paddingLeft: '10px' }}>全选</span>
              </Checkbox>
              <div style={{ flex : 'auto' }}/>
              <div className="all">合计：<span>￥ {this.checkPay(this.state.data)}</span></div>
              <div className="all2" onClick={() => this.onSubmit()}>结算({this.checkPay(this.state.data)})</div>
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
    actions: bindActionCreators({ getCarInterface, pushDingDan, getDefaultAttr, deleteShopCar }, dispatch),
  })
)(HomePageContainer);
