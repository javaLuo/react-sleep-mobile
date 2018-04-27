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
        Toast.fail('网络错误，请重试',1);
    }
};