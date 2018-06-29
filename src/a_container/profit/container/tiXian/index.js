/* 收益管理 - 我要提现 */

// ==================
// 所需的各种插件
// ==================

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import P from "prop-types";
import "./index.scss";
import tools from "../../../../util/all";
// ==================
// 所需的所有组件
// ==================
import { List, Toast, Button, Modal } from "antd-mobile";
// ==================
// 本页面所需action
// ==================

import { newTiXian } from "../../../../a_action/shop-action";

// ==================
// Definition
// ==================
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      howMuch: "" // 提现金额
    };
  }

  componentDidMount() {
    document.title = "我要提现";
  }

  // 提现输入框修改
  onTixianInput(e) {
    let v = e;
    //先把非数字的都替换掉，除了数字和.
    v = v.replace(/[^\d\.]/g, "");
    //必须保证第一个为数字而不是.
    v = v.replace(/^\./g, "0.");
    //保证只有出现一个.而没有多个.
    v = v.replace(/\.{2,}/g, ".");
    //保证.只出现一次，而不能出现两次以上
    v = v
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".");
    //只能输入两个小数
    v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
    this.setState({
      howMuch: v
    });
  }

  // 全部提现被点击
  onAllIn() {
    this.setState({
      howMuch: this.props.iwantnow.toFixed(2)
    });
  }

  // 开始提现
  onSubmit() {
    if (!this.props.userinfo) {
      Toast.info("请先登录", 1);
      return;
    }

    if (!this.props.userinfo.mobile) {
      alert("确认提现？", "您还未绑定手机号，绑定后才能提现", [
        { text: "取消", onPress: () => console.log("cancel") },
        {
          text: "确认",
          onPress: () =>
            new Promise(resolve => {
              this.props.history.push(`/my/bindphone`);
              resolve();
            })
        }
      ]);
      return;
    }

    this.onGoGoGo();
  }

  /** 开始向后台申请提现！限制条件也太TM多了 **/
  onGoGoGo() {
    this.props.actions
      .newTiXian()
      .then(res => {
        if (res.status === 200) {
          if (res.data.amount < this.props.iwantnow) {
            // 后台返回的可提现金额 < 所有的可提现金额，说明所有的可提现金额超了
            alert(
              "确认提现？",
              `由于提现额度限制，本次实际可提现${
                res.data.amount
              }万元，确认提现后，预计1-10个工作日到账，剩余可提现金额可明日再来`,
              [
                { text: "取消", onPress: () => console.log("cancel") },
                {
                  text: "确认",
                  onPress: () =>
                    new Promise(resolve => {
                      this.props.history.push(
                        `/profit/tixiannow/${res.data.amount}_${
                          res.data.partnerTradeNo
                        }`
                      );
                      resolve();
                    })
                }
              ]
            );
          } else {
            alert(
              "确认提现？",
              `您当前可提现金额为${
                res.data.amount
              }元，确认提现后，预计1-10个工作日到账`,
              [
                { text: "取消", onPress: () => console.log("cancel") },
                {
                  text: "确认",
                  onPress: () =>
                    new Promise(resolve => {
                      this.props.history.push(
                        `/profit/tixiannow/${res.data.amount}_${
                          res.data.partnerTradeNo
                        }`
                      );
                      resolve();
                    })
                }
              ]
            );
          }
        } else {
          Toast.info(res.message || "当前金额不可提现", 1);
        }
      })
      .catch(() => {
        Toast.info("网络错误，请稍后重试", 1);
      });
  }

  render() {
    const u = this.props.userinfo || {};
    return (
      <div className="page-tixian">
        <div className="my-list">
          <div className="l flex-none">提现账户</div>
          <div className="r flex-auto">微信零钱</div>
        </div>
        <div className="my-list mt">
          <div className="l flex-none">可提现金额</div>
          <div className="r flex-auto money">
            ￥{this.props.iwantnow.toFixed(2)}
          </div>
        </div>
        {/*<div className="tixian-info">可提现金额：￥{this.props.iwantnow.toFixed(2)}，<span onClick={() => this.onAllIn()}>全部提现</span></div>*/}
        <div className="info">
          买家支付后，可获得分销收益，但不可提现。自发货起15天之后，收益可提现。若发货起15天内，买家退货，收益将自动扣除。
        </div>
        <div className="submit-box">
          <Button
            className="submit-btn"
            type="primary"
            onClick={() => this.onSubmit()}
          >
            全部提现
          </Button>
        </div>
        <div className="info">
          * 金额低于1元时不可提现<br />
          * 预计1-10个工作日内可到账(遇节假日顺延)<br />
          * 同一个用户，单笔单日提现限额2万元<br />
          * 单日内提现次数不能超过3次
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
  iwantnow: P.number
};

// ==================
// Export
// ==================

export default connect(
  state => ({
    userinfo: state.app.userinfo,
    iwantnow: state.shop.iwantnow
  }),
  dispatch => ({
    actions: bindActionCreators({ newTiXian }, dispatch)
  })
)(HomePageContainer);
