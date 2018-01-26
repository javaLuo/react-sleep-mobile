/* Test */

import React from 'react';
import { connect } from 'react-redux';
import { Button, Toast } from 'antd-mobile';
import { bindActionCreators } from 'redux';
import { wxPay } from '../../a_action/shop-action';
import Config from '../../config';
import P from 'prop-types';
class TestContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        document.title = 'Test';
    }

    /**
     * 微信H5支付专用
     * 1.直接发起统一下单请求
     * 2.后台会收到微信返回的信息，其中带有MWEB_URL （H5支付中间页），需要跳转到这个页面（前端跳）
     * 3.用户在中间页进行操作支付，微信会返回给后台最终结果
     * **/
    wxH5Pay() {
        sessionStorage.setItem('pay-start', 1);   // 页面跳转，标识是支付的过程中返回到此页面
        this.props.actions.wxPay({               // 3. 向后台发起统一下单请求
            body: '翼猫体检卡',                                 // 商品描述
            total_fee: 1 , // 总价格（分）
            spbill_create_ip: typeof returnCitySN !== 'undefined' ? returnCitySN["cip"] : '',                  // 用户终端IP，通过腾讯服务拿的
            out_trade_no: `${new Date().getTime()}`,      // 商户订单号，通过后台生成订单接口获取
            code: null,                                             // 授权code, 后台为了拿openid
            trade_type: 'MWEB',
        }).then((res) => {
            /**                                                                                                                                                                                                                                                                                          /
             * 返回的数据中，应该有一个mweb_url，跳转至此地址，需要设置回跳地址，保存个参数表示是H5回跳的
             * **/
            console.log('H5支付统一下单返回值：', res);
            if (res.status === 200) {
                location.assign(`${res.data}&redirect_url=${encodeURIComponent(Config.baseURL + '/gzh/#/shop/paychose')}`);
                // ${encodeURIComponent(Config.baseURL + '/gzh/#/shop/paychose')}
            }
        }).catch(() => {
            Toast.fail('支付失败，请重试',1);
        });
    }

    render() {
        return (
            <div className="page-notfound">
                <Button type='primary' onClick={() => this.wxH5Pay()}>支付</Button>
            </div>
        );
    }
}

// ==================
// PropTypes
// ==================

TestContainer.propTypes = {
    actions: P.any,
};

// ==================
// Export
// ==================

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        actions: bindActionCreators({ wxPay }, dispatch),
    })
)(TestContainer);
