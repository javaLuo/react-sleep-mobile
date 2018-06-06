/* 健康管理 - 主页 */

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

import ImgRight from '../../../../assets/xiangyou@3x.png';
import ImgBar1 from '../../../../assets/tijianka@3x.png';
import ImgBar2 from '../../../../assets/yuyue@3x.png';
import ImgBar3 from '../../../../assets/wodeyuyue@3x.png';
import ImgBar4 from '../../../../assets/baogao@3x.png';
import ImgBar7 from '../../../../assets/HRA@3x.png';
import ImgWei from '../../../../assets/wei@3x.png';
import WaterWave from 'water-wave';
// ==================
// 本页面所需action
// ==================

import { shareBuild } from '../../../../a_action/app-action';

// ==================
// Definition
// ==================
class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        show: false,
    };
  }

  componentDidMount() {
      document.title = '健康服务';
      this.setState({
          show: true
      });
  }

  // 健康知识库点击
    onHraClick() {
      const u = this.props.userinfo;
        /**
         * 还要带头像和昵称
         * 正式： http://e.yimaokeji.com/index.php?m=page&f=view&t=mhtml&pageID=1${str}
         * 测试：http://www.huiyuzixun.cn/index.php?m=page&f=view&t=mhtml&pageID=21${str}
         * **/
        let str = '';
        if (u && u.id) {  // 有用户信息
            str = `&e=${u.id}`;
        }
        window.open(`http://e.yimaokeji.com/index.php?m=page&f=view&t=mhtml&pageID=1${str}`);
    }

    // 健康资讯点击
    onZiXunClick() {
      const u = this.props.userinfo;
        let str = '';
        if (u && u.id) {  // 有用户信息
            str = `&e=${u.id}`;
        }
      window.open(`http://e.yimaokeji.com/index.php?m=article&f=browse&t=mhtml&categoryID=3&pageID=1${str}`);
    }

    // 健康新闻
    onNewsClick() {
        const u = this.props.userinfo;
        let str = '';
        if (u && u.id) {  // 有用户信息
            str = `&e=${u.id}`;
        }
        window.open(`http://e.yimaokeji.com/index.php?m=article&f=browse&t=mhtml&categoryID=11&pageID=1&${str}`);
    }

  render() {
      const u = this.props.userinfo || {};
    return (
      <div className={this.state.show ? 'healthy-main show' : 'healthy-main'}>
          <div className="bar-list">
              <div className="bar-title">翼猫健康风险评估服务<WaterWave color="#cccccc" press="down"/></div>
              <div className="item hide tran1 page-flex-row" onClick={() => this.props.history.push('/healthy/mycard')}>
                  <img className="icon" src={ImgBar1} />
                  <div className="title">我的评估卡</div>
                  <img className="arrow" src={ImgRight} />
                  <div className="line"/>
                  <WaterWave color="#cccccc" press="down"/>
              </div>
              <div className="item hide tran2 page-flex-row" onClick={() => this.props.history.push('/healthy/precheck')}>
                  <img className="icon" src={ImgBar2} />
                  <div className="title">预约检查</div>
                  <img className="arrow" src={ImgRight} />
                  <div className="line"/>
                  <WaterWave color="#cccccc" press="down"/>
              </div>
              <div className="item hide tran3 page-flex-row" onClick={() => this.props.history.push('/healthy/mypre')}>
                  <img className="icon" src={ImgBar3} />
                  <div className="title">我的预约</div>
                  <img className="arrow" src={ImgRight} />
                  <div className="line"/>
                  <WaterWave color="#cccccc" press="down"/>
              </div>
              <div className="item hide tran4 page-flex-row" onClick={() => this.props.history.push('/healthy/myreport')}>
                  <img className="icon" src={ImgBar4} />
                  <div className="title">评估报告</div>
                  <img className="arrow" src={ImgRight} />
                  <div className="line"/>
                  <WaterWave color="#cccccc" press="down"/>
              </div>
              <div className="item hide tran5 page-flex-row" onClick={() =>this.props.history.push(`/healthy/wei/${u.id}`)}>
                  <img className="icon" src={ImgWei} />
                  <div className="title">评估报告(小程序)</div>
                  <img className="arrow" src={ImgRight} />
                  <div className="line"/>
                  <WaterWave color="#cccccc" press="down"/>
              </div>
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
    userinfo: P.any,
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
  (state) => ({
      userinfo: state.app.userinfo,
  }), 
  (dispatch) => ({
    actions: bindActionCreators({ shareBuild }, dispatch),
  })
)(HomePageContainer);
