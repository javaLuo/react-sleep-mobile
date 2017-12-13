import _ from 'lodash';
import Fetchapi from '../util/fetch-api';
import { Toast } from 'antd-mobile';

// 检测手机号是否被注册
export const checkMobile = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/checkMobile', params);
        dispatch({
            type: 'APP::checkMobile',
            payload: res,
        });
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 登录
export const login = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/login', params, 'post', true);
        dispatch({
            type: 'APP::login',
            payload: res,
        });
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 退出登录
export const logout = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/logout', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 注册时获取二维码
export const getVerifyCode = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/sms/getVerifyCode', params);
        dispatch({
            type: 'APP::getVerifyCode',
            payload: res,
        });
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 注册
export const register = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/register', params, 'post', true);
        dispatch({
            type: 'APP::register',
            payload: res,
        });
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 获取用户信息
export const getUserInfo = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/userInfo/get', params, 'post', true);
        if(res.status === 200) {
            dispatch({
                type: 'APP::getUserInfo',
                payload: res.data,
            });
        }

        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 修改用户信息
export const updateUserInfo = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/userInfo/update', params, 'post', true);
        if(res.status === 200) {
            dispatch({
                type: 'APP::getUserInfo',
                payload: res.data,
            });
        }

        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 重置密码
export const resetPwd = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/resetPwd', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 微信网页授权 - 保存code
export function saveWxCode(code) {
    return {
        type: 'APP::saveWxCode',
        payload: code,
    };
}