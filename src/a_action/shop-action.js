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

// 添加收货地址
export const saveAddrss = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/address/saveAddrss', params, 'post', true, 1);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::saveAddrss',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试',1);
    }
};

// 微信支付
export const wxPay = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/wxpay/unifiedorder', params, 'post', true, 1);
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
// 保存菜单层级数据，别的地方可随时使用
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
export const userIncomeDetails = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('app/user/income/details', params);
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