import reqwest from 'reqwest';
import Config from '../config';

export default class ApiService {
  static newPost(url, bodyObj = {}, type='post', isJson, port) {
    console.log('baseURL:', Config.baseURL);
    if (isJson) {
        return reqwest({
            url:`${Config.baseURL}${port ? Config.ports[port] : Config.ports[0]}/${url}`,
            method: type,
            contentType: 'application/json;charset=UTF-8',
            crossOrigin: true,
            withCredentials: true,
            data: JSON.stringify(bodyObj),
            type: 'json',
        });
    } else {
        return reqwest({
            url:`${Config.baseURL}${port ? Config.ports[port] : Config.ports[0]}/${url}`,
            method: type,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            crossOrigin: true,
            withCredentials: true,
            data: bodyObj,
        });
    }
  }
}
