import Fetchapi from '../util/fetch-api';
import { Toast } from 'antd-mobile';

// 检测手机号是否被注册
export const checkMobile = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/checkMobile', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 登录
export const login = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/login', params, 'post', true);
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

// 退出登录
export const logout = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/logout', params, 'post', true);
        if(res.status === 200) {
            dispatch({
                type: 'APP::getUserInfo',
                payload: null,
            });
        }
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 注册时获取验证码
export const getVerifyCode = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/sms/getVerifyCode', params);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 注册
export const register = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/register', params, 'post', true);
        return res;
    } catch(err) {
        Toast.fail('网络错误，请重试');
    }
};

// 获取用户信息
export const getUserInfo = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/get', params, 'post', true);
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
        const res = await Fetchapi.newPost2('app/user/update', params, 'post', true);
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

// 设置密码（未设置过密码的用户可以设置密码）
export const setPwd = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/setPwd', params, 'post', true);
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

// 验证经销商密码
export const bindPhonePwd = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/bind/phone/pwd', params, 'post', true);
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

// 绑定手机号
export const bindPhone = (params = {}) => async(dispatch) => {
    try {
        const res = await Fetchapi.newPost2('app/user/bind/phone', params, 'post', true);
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

// 微信网页授权 - 保存code
export function saveWxCode(code) {
    return {
        type: 'APP::saveWxCode',
        payload: code,
    };
}