import Fetchapi from '../util/fetch-api';
import { Toast } from 'antd-mobile';
import Config from '../config';

// 查询所有产品(非活动产品)
export const getRecommend = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/product/recommend', { });
        if (res.status === 200) {
            dispatch({
                type: 'NEW::recommend',
                payload: res.data,
            });
        }
        return res;
    } catch(err) {
        Toast.info('网络错误，请重试',1);
    }
};

// 查询所有热门活动
export const getActivityList = () => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/activity/list', { });
        if (res.status === 200) {
            dispatch({
                type: 'NEW::activityList',
                payload: res.data.result,
            });
        }
        return res;
    } catch(err) {
        Toast.info('网络错误，请重试',1);
    }
};

// 查询所有热门活动
export const listByActivityId = (params) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/activity/listByActivityId', params);
        return res;
    } catch(err) {
        Toast.info('网络错误，请重试',1);
    }
};

// H5宣传卡列表
export const speakCardPropList = (params) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/speakCard/propagandaList', params);
        if (res.status === 200) {
            dispatch({
                type: 'SHOP::daiyanh5List',
                payload: res.data,
                payloadType: params.cardCategory
            });
        }
        return res;
    } catch(err) {
        Toast.info('网络错误，请重试',1);
    }
};

// 客服页所需数据
export const getKfList = (params) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/assistant/list', params);
        return res;
    } catch(err) {
        Toast.info('网络错误，请重试',1);
    }
};
// 首页 - 查询推荐的服务站
export const getGoodServiceStations = (params) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('mall/station/recommend/list', params, 'post', true);
        return res;
    } catch(err) {
        Toast.info('网络错误，请重试',1);
    }
};

// 进入体验店
// 保存用户当前位置
export function inputStation(data) {
    return {
        type: 'SHOP::inputStation',
        payload: data,
    };
}