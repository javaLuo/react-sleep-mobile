import React from "react";
import PropTypes from "prop-types";
import IScroll from "iscroll/build/iscroll-probe";

import iconSldown from "./assets/icon_sldown.png";
import iconSlup from "./assets/icon_slup.png";
import iconLoading from "./assets/loading.gif";

import "./index.css";

class IscrollLuo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yesDown: false, // 是否已到了下拉刷新的高度
      yesUp: false, // 是否已到了上拉加载的高度
      data: null, // 数据缓存,
      loadingDownShow: false, // 是否处于刷新中状态
      loadingUpShow: false, // 是否属于加载中状态
      iscrollOptions: {
        // iscroll 所需参数
        probeType: 3,
        preventDefault: true
      },
      options: {
        backgroundColor: "#f5f5f5", // 背景颜色
        fontColor: "#888888", // 文字颜色
        beyondHeight: 30, // 超过此长度后触发下拉或上拉,单位px
        pulldownInfo: "下拉刷新",
        pulldownReadyInfo: "松开刷新",
        pulldowningInfo: "刷新中…",
        pullupInfo: "加载更多",
        pullupReadyInfo: "松开加载",
        pullupingInfo: "加载中…"
      },
      boxHeight: 0
    };
    this.timerRefresh = null; // 刷新iscroll的延时timer
    this.iscrollTimer = null; // 检测高度变化的timer
    this.myScroll = null; // 保存当前iscroll实例
    this.onMouseUpListener = {
      me: this,
      handleEvent: function(e) {
        const t = this.me;
        window.top.removeEventListener("mouseup", this, false);
        window.top.removeEventListener("touchend", this, false);
        if (t.myScroll.y >= t.state.options.beyondHeight) {
          if (t.props.onPullDownRefresh) {
            t.setState({
              loadingDownShow: true,
              loadingUpShow: false
            });
            t.props.onPullDownRefresh();
          }
        } else if (
          t.myScroll.y <
          t.myScroll.maxScrollY - t.state.options.beyondHeight
        ) {
          if (t.props.onPullUpLoadMore) {
            t.setState({
              loadingDownShow: false,
              loadingUpShow: true
            });
            t.props.onPullUpLoadMore();
          }
        }
      }
    };
  }

  // 组件挂载完毕之前触发 初始化一些参数
  UNSAFE_componentWillMount() {
    if (this.props.options) {
      this.setState({
        options: Object.assign({}, this.state.options, this.props.options)
      });
    }
    if (this.props.iscrollOptions) {
      this.setState({
        iscrollOptions: Object.assign(
          {},
          this.state.iscrollOptions,
          this.props.iscrollOptions
        )
      });
    }
  }

  // 组件初始化完毕时触发
  componentDidMount() {
    this.myScroll = new IScroll(
      `#${this.props.id}_warpper`,
      this.state.iscrollOptions
    );

    this.myScroll.on("scroll", () => {
      const myScroll = this.myScroll;

      if (
        myScroll.y >= this.state.options.beyondHeight &&
        !this.state.yesDown
      ) {
        this.setState({
          yesDown: true
        });
      } else if (
        myScroll.y > 0 &&
        myScroll.y < this.state.options.beyondHeight &&
        this.state.yesDown
      ) {
        this.setState({
          yesDown: false
        });
      } else if (
        myScroll.y < myScroll.maxScrollY &&
        myScroll.y > myScroll.maxScrollY - this.state.options.beyondHeight &&
        this.state.yesUp
      ) {
        this.setState({
          yesUp: false
        });
      } else if (
        myScroll.y < myScroll.maxScrollY - this.state.options.beyondHeight &&
        !this.state.yesUp
      ) {
        this.setState({
          yesUp: true
        });
      }
    });

    this.myScroll.on("scrollStart", () => {
      window.top.addEventListener("mouseup", this.onMouseUpListener, false);
      window.top.addEventListener("touchend", this.onMouseUpListener, false);
    });

    this.setState({
      data: this.props.children
    });

    if (this.props.detectionHeight) {
      this.onDetectionHeight();
    }
  }

  /* children内容改变时触发,表示已完成了刷新或加载 */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.setState(
        {
          data: nextProps.children,
          loadingDownShow: false,
          loadingUpShow: false
        },
        () => this.onRefresh()
      );
    }
  }

  /* 组件即将销毁时触发，销毁当前iscroll实例 */
  componentWillUnmount() {
    window.clearTimeout(this.iscrollTimer);
    this.myScroll.destroy();
  }

  /** 循环检测容器高度 **/
  onDetectionHeight() {
    const that = this;
    clearTimeout(that.iscrollTimer);
    that.iscrollTimer = setTimeout(function() {
      that.iscrollTimeout(that);
    }, 500);
  }

  iscrollTimeout(me) {
    const dom = me.docStatus;
    if (dom && dom.offsetHeight !== me.state.boxHeight) {
      me.setState({
        boxHeight: dom.offsetHeight
      });
      me.myScroll.refresh();
    }
    me.iscrollHeightChange();
  }

  iscrollHeightChange() {
    const me = this;
    clearTimeout(me.iscrollTimer);
    me.iscrollTimer = setTimeout(function() {
      me.iscrollTimeout(me);
    }, 700);
  }

  /** 刷新ISCROLL **/
  onRefresh() {
    const myScroll = this.myScroll;
    window.clearTimeout(this.timerRefresh);
    this.timerRefresh = window.setTimeout(() => {
      myScroll.refresh();
    }, 200);
  }

  render() {
    return (
      <div
        id={this.props.id}
        ref={dom => (this.docStatus = dom)}
        className={
          this.props.className
            ? `iscroll-luo-box ${this.props.className}`
            : "iscroll-luo-box"
        }
        style={{ backgroundColor: this.state.options.backgroundColor }}
      >
        <div
          className={this.state.loadingDownShow ? "sl_down sl_show" : "sl_down"}
          style={{
            backgroundColor: this.state.options.backgroundColor,
            color: this.state.options.fontColor
          }}
        >
          <img src={iconLoading} />
          {this.state.options.pulldowningInfo}
        </div>
        <div id={`${this.props.id}_warpper`} className="sl_scroller">
          <div>
            <div className="scroller-pullDown">
              <span
                className={this.state.yesDown ? "icon reverse_icon" : "icon"}
              >
                <img src={iconSldown} />
              </span>
              <span
                className="msg"
                style={{ color: this.state.options.fontColor }}
              >
                {this.state.yesDown
                  ? this.state.options.pulldownReadyInfo
                  : this.state.options.pulldownInfo}
              </span>
            </div>
            <div className="scroller-content">{this.props.children}</div>
            <div className="scroller-pullUp">
              <span className={this.state.yesUp ? "icon reverse_icon" : "icon"}>
                <img src={iconSlup} />
              </span>
              <span
                className="msg"
                style={{ color: this.state.options.fontColor }}
              >
                {this.state.yesUp
                  ? this.state.options.pullupReadyInfo
                  : this.state.options.pullupInfo}
              </span>
            </div>
          </div>
        </div>
        <div
          className={this.state.loadingUpShow ? "sl_up sl_show" : "sl_up"}
          style={{
            backgroundColor: this.state.options.backgroundColor,
            color: this.state.options.fontColor
          }}
        >
          <img src={iconLoading} />
          {this.state.options.pullupingInfo}
        </div>
      </div>
    );
  }
}

IscrollLuo.propTypes = {
  id: PropTypes.string, // id
  children: PropTypes.object, // 数据
  options: PropTypes.object, // 自定义参数
  iscrollOptions: PropTypes.object, // iscroll原生参数
  detectionHeight: PropTypes.bool, // 是否不停的检测高度变化
  className: PropTypes.string, // 额外的class
  onPullDownRefresh: PropTypes.func, // 下拉刷新
  onPullUpLoadMore: PropTypes.func // 上拉加载更多
};

export default IscrollLuo;
