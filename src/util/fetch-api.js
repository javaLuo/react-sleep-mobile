import reqwest from 'reqwest';
import $ from 'jquery';
import Config from '../config';
import { Toast } from 'antd-mobile';
import _ from 'lodash';
export default class ApiService {
  // static newPost(url, bodyObj = {}, type='post', isJson) {
  //       /** 获取openid,所有接口都要传参数openId **/
  //       const openId = localStorage.getItem('openId') || null;
  //       const params = _.cloneDeep(bodyObj);
  //       params.openId = openId;
  //
  //       if (isJson) {
  //           return reqwest({
  //               url:`${Config.baseURL}/${url}`,
  //               method: type,
  //               contentType: 'application/json;charset=UTF-8',
  //               crossOrigin: true,
  //               withCredentials: true,
  //               data: JSON.stringify(params),
  //               type: 'json',
  //           }).then((res) => {
  //               if(res.message.indexOf('过期')>=0 || res.status === 401){
  //                   sessionStorage.clear();
  //                   window.theHistory.replace('/login');
  //                   Toast.info(res.message);
  //               }
  //               return res;
  //           });
  //       } else {
  //           return reqwest({
  //               url:`${Config.baseURL}/${url}`,
  //               method: type,
  //               contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
  //               crossOrigin: true,
  //               withCredentials: true,
  //               data: params,
  //           }).then((res) => {
  //               if(res.message.indexOf('过期')>=0 || res.status === 401){
  //                   sessionStorage.clear();
  //                   window.theHistory.replace('/login');
  //                   Toast.info(res.message);
  //               }
  //               return res;
  //           });
  //       }
  //   }
  //
  //   static newPost2(url, bodyObj = {}, type='post', isJson) {
  //       /** 获取openid,所有接口都要传参数openId **/
  //       const openId = localStorage.getItem('openId') || null;
  //       const params = _.cloneDeep(bodyObj);
  //           params.openId = openId;
  //
  //       if (isJson) {
  //           return reqwest({
  //               url:`${Config.baseURL2}/${url}`,
  //               method: type,
  //               contentType: 'application/json;charset=UTF-8',
  //               crossOrigin: true,
  //               withCredentials: true,
  //               data: JSON.stringify(params),
  //               type: 'json',
  //           }).then((res) => {
  //               if(res.message.indexOf('过期')>=0 || res.status === 401){
  //                   sessionStorage.clear();
  //                   window.theHistory.replace('/login');
  //                   Toast.info(res.message);
  //               }
  //               return res;
  //           }).catch((err) => {
  //               alert(JSON.stringify(err));
  //           });
  //       } else {
  //           return reqwest({
  //               url:`${Config.baseURL}/${url}`,
  //               method: type,
  //               contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
  //               crossOrigin: true,
  //               withCredentials: true,
  //               data: params,
  //           }).then((res) => {
  //               if(res.message.indexOf('过期')>=0 || res.status === 401){
  //                   sessionStorage.clear();
  //                   window.theHistory.replace('/login');
  //                   Toast.info(res.message);
  //               }
  //               return res;
  //           });
  //       }
  //   }

    static newPost(url, bodyObj = {}, type='post', isJson) {
        const openId = localStorage.getItem('openId') || null;
        const params = _.cloneDeep(bodyObj);
        params.openId = openId;
        if (isJson) {
            return new Promise((res, rej) => {
                $.ajax({
                    url:`${Config.baseURL}/${url}`,
                    method: type,
                    contentType: 'application/json;charset=UTF-8',
                    crossOrigin: true,
                    withCredentials: true,
                    data: JSON.stringify(params),
                    dataType: 'json',
                    success: (msg) => {
                        res(msg);
                    },
                    error: (err) => {
                        rej(err);
                    }
                });
            }).then((res) => {
                if(res.status === 401){
                    sessionStorage.clear();
                    window.theHistory.push('/login');
                    Toast.info(res.message, 1);
                }
                return res;
            });
        } else {
            return new Promise((res, rej) => {
                $.ajax({
                    url:`${Config.baseURL}/${url}`,
                    method: type,
                    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    crossOrigin: true,
                    withCredentials: true,
                    data: params,
                    success: (msg) => {
                        res(msg);
                    },
                    error: (err) => {
                        rej(err);
                    }
                });
            }).then((res) => {
                if(res.status === 401){
                    sessionStorage.clear();
                    window.theHistory.replace('/login');
                    Toast.info(res.message);
                }
                return res;
            });
        }
    }
}
