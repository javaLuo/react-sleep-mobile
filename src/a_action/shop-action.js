import Fetchapi from '../util/fetch-api';
import { Toast } from 'antd-mobile';

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
        Toast.fail('网络错误，请重试');
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
        Toast.fail('网络错误，请重试');
    }
};

// 根据ID查产品详情
export const productById = (params) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/product/productById', params, 'post', false, 1);
        if (res.returnCode === '0') {
            dispatch({
                type: 'SHOP::productById',
                payload: res.messsageBody.result,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
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
        Toast.fail('网络错误，请重试');
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
        Toast.fail('网络错误，请重试');
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
        Toast.fail('网络错误，请重试');
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
        Toast.fail('网络错误，请重试');
    }
};

// 微信支付
export const wxPay = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/wxpay/unifiedorder', params, 'post', true, 1);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 微信初始化 - 获取appID,签名，随机串，时间戳
export const wxInit = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/wxpay/init', params, 'post', true, 1);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
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
        Toast.fail('网络错误，请重试');
    }
};

// 查询我的预约
export const mecReserveList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/ticket/list', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 查询我的订单
export const mallOrderList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/order/list', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 生成体检卡 支付成功后调用
export const mallCardCreate = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/hracard/create', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 查询我的体检卡
export const mallCardList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/hracard/list', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 搜索服务站
export const mallStationList = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/station/list', params );
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};


// 体检预约 - 保存用户输入的基本信息
export function savePreInfo(payload = {}) {
    return {
        type: 'PRE::savePreInfo',
        payload,
    };
}

// 体检预约 - 向后台发起请求，添加一条体检预约
export const mallReserveSave = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/reserve/save', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
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