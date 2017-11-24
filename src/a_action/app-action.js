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

// 获取用户信息
export const getUserInfo = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('userInfo/get', params, 'post', true);
        if(res.status === 200) {
            dispatch({
                type: 'APP::getUserInfo',
                payload: res.data,
            });
        }

        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 修改用户信息
export const updateUserInfo = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('userInfo/update', params, 'post', true);
        if(res.status === 200) {
            dispatch({
                type: 'APP::getUserInfo',
                payload: res.data,
            });
        }

        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};

// 上传图片接口
export const upLoadImg = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost('common/upload/image', params, 'post', true);
        return res;
    } catch(err) {
        message.error('网络错误，请重试');
    }
};
