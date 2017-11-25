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
