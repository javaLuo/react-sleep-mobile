const config = {
   //baseURL: 'http://10.1.10.1:10030',
   baseURL: 'http://192.168.60.158:10030',
    // baseURL: 'http://hra.yimaokeji.com',
    // baseURL: 'http://192.168.60.210',
    appId: 'wx57f6ee39cbea7654', // 公众号appID：'wx57f6ee39cbea7654',   测试号：wx33956348b0093a1d
    redirect_uri: encodeURIComponent(`${this.baseURL}/#/jump`),   // 微信网页授权回跳地址
};
export default config;