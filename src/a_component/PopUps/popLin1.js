/* 恭喜您 弹窗 */
import React from "react";
import "./popLin1.scss";
import ImgTitle from "./assets/img2@3x.png";
import ImgClose from "./assets/close@3x.png";
import P from "prop-types";

class Pop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 关闭
  onClose() {
    this.props.onClose && this.props.onClose();
  }

  // 提交
  onSubmit() {
    this.props.onSubmit && this.props.onSubmit();
  }
  render() {
    return (
      <div
        className="pop-lin1-page"
        style={{ display: this.props.show ? "flex" : "none" }}
      >
        <div className="pop-body">
          <img className="img-title" src={ImgTitle} />
          <div className="title">恭喜您</div>
          <div className="box" style={{ paddingTop: "10px" }}>
            <div className="t">您有XX张HRA优惠卡可领取！</div>
            <div className="i">
              价值1000元/张HRA翼<br />猫健康风险评估优惠卡
            </div>
          </div>
          <div className="btn-box">
            <button className="submit-btn" onClick={() => this.onSubmit()}>
              立即领取
            </button>
          </div>

          <div className="pop-close">
            <div className="line" />
            <img src={ImgClose} onClick={() => this.onClose()} />
          </div>
        </div>
      </div>
    );
  }
}

Pop.propTypes = {
  show: P.bool, // 是否出现
  onClose: P.any, // 关闭
  onSubmit: P.any // 提交按钮被点击
};

export default Pop;
