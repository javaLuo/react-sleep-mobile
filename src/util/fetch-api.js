import reqwest from 'reqwest';
import Config from '../config';

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
        });
    } else {
        return reqwest({
            url:`${Config.baseURL}/${url}`,
            method: type,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            crossOrigin: true,
            withCredentials: true,
            data: bodyObj,
        });
    }
  }
}
