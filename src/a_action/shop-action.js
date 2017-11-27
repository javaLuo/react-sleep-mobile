import Fetchapi from '../util/fetch-api';
import { message } from 'antd';

// 查询所有产品
export const getProDuctList = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/list', { pageNum: 0, pageSize: 9999 }, 'post', false, 1);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::getProDuctList',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 查询所有产品类型
export const listProductType = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/listProductType', { pageNum: 0, pageSize: 9999 }, 'post', false, 1);
        if (res.returnCode === '0') {
            dispatch({
                type: 'SHOP::listProductType',
                payload: res.messsageBody.result,
            });
        }
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 根据ID查产品详情
export const productById = (params) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/productById', params, 'post', false, 1);
        if (res.returnCode === '0') {
            dispatch({
                type: 'SHOP::productById',
                payload: res.messsageBody.result,
            });
        }
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 获取所有支付方式
export const getAllPayTypes = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/listDictionaryByDicId', {dicId: 13, pageNum:0, pageSize: 9999}, 'post', false, 1);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::getAllPayTypes',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 获取所有收费方式
export const getAllChargeTypes = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/listDictionaryByDicId', {dicId: 16, pageNum:0, pageSize: 9999}, 'post', false, 1);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::getAllChargeTypes',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 下单
export const placeAndOrder = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/placeAndOrder', params, 'post', false, 1);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::placeAndOrder',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
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