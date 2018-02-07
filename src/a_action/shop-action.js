import Fetchapi from '../util/fetch-api';
import { Toast } from 'antd-mobile';
import Config from '../config';
// 查询所有产品
export const getProDuctList = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/product/listByType', { pageNum: 0, pageSize: 9999, typeId: 1 });
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::getProDuctList',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询所有产品类型
export const listProductType = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/listProductType', { pageNum: 0, pageSize: 9999 });
        if (res.returnCode === '0') {
            dispatch({
                type: 'SHOP::listProductType',
                payload: res.messsageBody.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 根据ID查产品详情
export const productById = (params) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/product/productById', params, 'post');
        if (res.returnCode === '0') {
            dispatch({
                type: 'SHOP::productById',
                payload: res.messsageBody.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 获取所有支付方式
export const getAllPayTypes = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/dictionary/listByDicId', {dicType: 'payType', pageNum:0, pageSize: 9999});
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::getAllPayTypes',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 获取所有收费方式
export const getAllChargeTypes = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/listByDicId', {dicType: 'feeType', pageNum:0, pageSize: 9999}, 'post', true);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::getAllChargeTypes',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 下单
export const placeAndOrder = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/create', params, 'post', true, 1);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::placeAndOrder',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询收货地址列表
export const getAddrList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/address/list', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 添加收货地址
export const saveAddrss = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/address/save', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};
// 删除收货地址
export const delAddr = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/address/delete', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};
// 修改收货地址
export const upAddr = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/address/update', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 设置默认收货地址
export const setDefaultAddr = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/address/hasDefault', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 进入编辑收货地址页时，把当前所选地址存入store
export function onSaveUpAddrNow(params) {
    return {
        type: 'ADDR::onSaveUpAddrNow',
        payload: params,
    };
}
// 微信支付
export const wxPay = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/wxpay/unifiedorder', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 微信初始化 - 获取appID,签名，随机串，时间戳
export const wxInit = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/wxpay/init', { url: `${Config.baseURL}/gzh/?` });
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 商品详情页 - 立即下单，保存计费方式和购买数量
export function shopStartPreOrder(params, nowProduct) {
    return {
        type: 'SHOP::shopStartPreOrder',
        params,
        nowProduct,
    };
}

// 订单支付页 - 立即支付，保存购买数量、服务时间、开户费、总费用
export function shopStartPayOrder(params) {
    return {
        type: 'SHOP::shopStartPayOrder',
        params,
    };
}

// 选择收货地址
export function saveShopAddr(params) {
    return {
        type: 'SHOP::saveShopAddr',
        params,
    };
}

// 首页轮播图
export const mallApList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/ap/list', params);
        if (res.status === 200) {
            dispatch({
                type: 'HOME::mallApList',
                payload: res.data,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询我的预约
export const mecReserveList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/ticket/list', params,);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询我的订单列表
export const mallOrderList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/list', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询一个订单详情 (柳号的接口， orderId,pageNum,pageSize， 返回订单对应的卡的信息)
export const mallOrderHraCard = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/hraCard', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询一个订单详情 (张波的接口， orderId, 返回订单的信息)
export const mallOrderQuery = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/query', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 取消一个订单
export const mallOrderDel = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/delete', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 生成体检卡 支付成功后调用
export const mallCardCreate = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/hracard/create', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询我的体检卡
export const mallCardList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/hracard/listCard', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 根据体检卡查体检券
export const mallCardListQuan = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/hracard/listByCardId', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 删除体检卡
export const mallCardDel = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/hracard/delete', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 删除体检券
export const mallQuanDel = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/ticket/delete', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 搜索所有已上线服务站
export const mallStationList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/station/list', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 搜索所有服务站
export const mallStationListAll = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/station/listStation', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询我的优惠卡
export const queryListFree = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/ticket/listFree', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 检查当前账号是否有权限购买该商品
export const appUserCheckBuy = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/user/checkBuy', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 优惠卡下单购买
export const createMcard = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/create/mcard', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 获取我的推广用户列表
export const getMyCustomers = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/user/my/customers', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 绑定经销商
export const bindDistributor = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/user/bind/distributor', params, 'post', true );
        if(res.status === 200) {
            dispatch({
                type: 'APP::getUserInfo',
                payload: res.data,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 体检预约 - 保存用户输入的基本信息
export function savePreInfo(payload = {}) {
    return {
        type: 'PRE::savePreInfo',
        payload,
    };
}

// 体检预约 - 添加体检报告 - 保存所选择的信息
export function saveReportInfo(payload = {}) {
    return {
        type: 'PRE::saveReportInfo',
        payload,
    };
}

// 体检预约 - 向后台发起请求，添加一条体检预约
export const mallReserveSave = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/ticket/create', params, 'post', true );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 体检报告 - 获取体检报告
export const queryReportList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/report/list', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 体检报告 - 添加体检报告
export const addReportList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/report/show', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询当前用户已使用过的体检券 （用于添加体检报告）
export const queryUsedListTicket = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/report/listTicket', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 查询当前用户未使用过的体检券 （用于体检预约选卡）
export const queryNotUsedListTicket = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/ticket/reserveTicket', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 收益管理 -
export const userIncomeMain = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/user/income/main', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 收益管理 - 收益明细
export const userIncomeDetails = (params = {}, type = 1) => async(dispatch) => {
    try {
        let res;
        if (type === 1) {   // 查全部
            res = await Fetchapi.newPost('app/user/income/details/first', params);
        } else {    // 查某个子账户
            res = await Fetchapi.newPost('app/user/income/details/second', params);
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 保存支付结果页所需数据
export function payResultNeed(cardData, payData) {
    return {
        type: 'PAY::payResultNeed',
        cardData,
        payData
    };
}

// 保存当前选中的服务站信息（用于体检预约里面）
export function saveServiceInfo(payload = {}) {
    return {
        type: 'PRE::saveServiceInfo',
        payload,
    };
}

// 保存当前查询的体检卡信息（上拉加载下拉刷新用的）
export function saveMyCardInfo(data = {}, pageNum, pageSize, total) {
    return {
        type: 'PRE::saveMyCardInfo',
        data,
        pageNum,
        pageSize,
        total,
    };
}

// 由订单点击进入订单详情，保存订单信息，因为查订单详情的接口没有返回商品的信息
export function saveOrderInfo(payload = {}) {
    return {
        type: 'PRE::saveOrderInfo',
        payload,
    };
}

// 由我的体检卡点击一张卡片，进入体检券也，保存当前体检卡信息
export function saveCardInfo(payload = {}) {
    return {
        type: 'PRE::saveCardInfo',
        payload,
    };
}

// 由收益管理 - 收益明细 选择一条数据时，保存该条数据信息，下一个页面要用
export function saveProDetail(payload = {}) {
    return {
        type: 'PRE::saveProDetail',
        payload,
    };
}

// 我的优惠卡 - 保存当前选择优惠卡信息
export function saveFreeCardInfo(payload = {}) {
    return {
        type: 'PRE::saveFreeCardInfo',
        payload,
    };
}

// 我的客户 - 主账号进入子账号，保存子账号信息，因为下一个页面要用
export function saveSonInInfo(payload = {}) {
    return {
        type: 'MY::saveSonInInfo',
        payload,
    };
}

// 修改卡的分享状态
export const ticketHandsel = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/user/ticket/handsel', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 我的客户 - 主账号进入时调此接口,返回主账号和其所有子账号
export const getCustomersCompany = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/user/my/customers/company', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 分页查询提现记录
export const getCashRecordList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/cashRecord/list', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 检查提现是否符合需求
export const checkTiXianCan = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/wxpay/cashRecord/check', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 进行提现
export const startTiXian = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/wxpay/cashRecord/withdraw', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 获取默认地址，没有默认地址就是第1个，1个都没有的话就没有 (下单时专用，会自动设置购买信息中的地址)
export const getDefaultAttr = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/address/defaultList', params, 'post', true);
        if(res.status === 200 && res.data) {
            dispatch({
                type: 'APP::setDefaultAttr',
                payload: res.data,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 保存可提现金额，准备提现
export function saveIWantNow(payload = {}) {
    return {
        type: 'PRE::saveIWantNow',
        payload,
    };
}

// 从提现记录列表进入提现详情时，保存当前的信息
export function saveTiXianDetailInfo(payload = {}) {
    return {
        type: 'PRE::saveTiXianDetailInfo',
        payload,
    };
}


// 获取分享所需信息
export const getShareInfo = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/speakCard/list', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};