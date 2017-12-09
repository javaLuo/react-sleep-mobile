import reqwest from 'reqwest';
import Config from '../config';
import { Toast } from 'antd-mobile';
export default class ApiService {
  static newPost(url, bodyObj = {}, type='post', isJson) {
        console.log('baseURL:', Config.baseURL);
        if (isJson) {
            return reqwest({
                url:`${Config.baseURL}/${url}`,
                method: type,
                contentType: 'application/json;charset=UTF-8',
                crossOrigin: true,
                withCredentials: true,
                data: JSON.stringify(bodyObj),
                type: 'json',
            }).then((res) => {
                if(res.message.indexOf('过期')>=0){
                    sessionStorage.clear();
                    Toast.info(res.message);
                }
                return res;
            });
        } else {
            return reqwest({
                url:`${Config.baseURL}/${url}`,
                method: type,
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                crossOrigin: true,
                withCredentials: true,
                data: bodyObj,
            }).then((res) => {
                if(res.message.indexOf('过期')>=0){
                    sessionStorage.clear();
                    Toast.info(res.message);
                }
                return res;
            });
        }
    }

    static newPost2(url, bodyObj = {}, type='post', isJson) {
        console.log('baseURL:', Config.baseURL2);
        if (isJson) {
            return reqwest({
                url:`${Config.baseURL2}/${url}`,
                method: type,
                contentType: 'application/json;charset=UTF-8',
                crossOrigin: true,
                withCredentials: true,
                data: JSON.stringify(bodyObj),
                type: 'json',
            }).then((res) => {
                if(res.message.indexOf('过期')>=0){
                    sessionStorage.clear();
                    Toast.info(res.message);
                }
                return res;
            });
        } else {
            return reqwest({
                url:`${Config.baseURL}/${url}`,
                method: type,
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                crossOrigin: true,
                withCredentials: true,
                data: bodyObj,
            }).then((res) => {
                if(res.message.indexOf('过期')>=0){
                    sessionStorage.clear();
                    Toast.info(res.message);
                }
                return res;
            });
        }
    }
}
