import _ from 'lodash';
import Fetchapi from '../util/fetch-api';
import { message } from 'antd';

// 检测手机号是否被注册
export const checkMobile = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('user/checkMobile', params);
        dispatch({
            type: 'APP::checkMobile',
            payload: res,
        });
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 登录
export const login = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('user/login', params, 'post', true);
        dispatch({
            type: 'APP::login',
            payload: res,
        });
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 注册时获取二维码
export const getVerifyCode = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('sms/getVerifyCode', params);
        dispatch({
            type: 'APP::getVerifyCode',
            payload: res,
        });
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 注册
export const register = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('user/register', params, 'post', true);
        dispatch({
            type: 'APP::register',
            payload: res,
        });
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};
