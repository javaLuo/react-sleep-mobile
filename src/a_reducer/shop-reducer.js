// ============================================
// ============================================
// Import modules
import _ from 'lodash';

const initState = {
    allProducts: [],    // 所有的产品
    allProductTypes: [],// 所有的产品类型
    orderParams: {      // 下单流程所需
        nowProduct: null,   // 当前的商品对象，包括ID、名称、型号等
        params: {       // 当前下单所需参数，购买数量，支付方式等等
            count: 0,           // 购买数量
            feeType: null,      // 收费类型ID
            serviceTime: null,  // 服务时间
            openAccountFee: 0,  // 开户费
            fee: 0,             // 总价
            payType: null,      // 支付方式ID
            isPay: false,        // 是否支付
        },
    },
    allPayTypes: [],    // 所有的支付方式，支付宝微信什么的
    allChargeTypes:[],  // 所有的收费方式，包年包流量什么的
    homePics: [],   // 首页轮播图
    preInfo: {      // 预约体检，用户输入的信息，最终接口所需数据
        name: undefined, // 名字 必填
        mobile: undefined,   // 手机号 必填
        stationId: 1,    // 服务站ID 必填
        stationName: '测试-服务站名称',  // 服务站名称 必填
        reserveTime: '2017-12-11 12:12:12',  // 预约时间 必填
        arriveTime: undefined,   // 体检时间
        sex: 1, // 性别，1男0女 必填
        code: '123123214214', // 体检卡编号 必填
        height: undefined,   // 身高
        weight: undefined,  // 体重
        userSource: 2,  // 用户来源 1APP， 2公众号，3后台添加
        conditions: 0,  // 状态 0预约成功，1已完成体检，-1失败，-2过期
    },
    payResultInfo: {    // 支付成功，支付成功页面需要订单信息、生成的卡片信息
        cards: [],
        payInfo: {},
    }
};

// ============================================
// action handling function

const actDefault = (state) => state;

const getProDuctList = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        allProducts: payload,
    });
};

const listProductType = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        allProductTypes: payload,
    });
};

const shopStartPreOrder = (state, action) => {
    const { params, nowProduct } = action;
    const orderParams = _.cloneDeep(state.orderParams);
    orderParams.params = Object.assign({}, state.orderParams.params, params);
    orderParams.nowProduct = Object.assign({}, state.orderParams.nowProduct, nowProduct);

    return Object.assign({}, state, {
        orderParams,
    });
};

const shopStartPayOrder = (state, action) => {
    const { params } = action;
    const orderParams = _.cloneDeep(state.orderParams);
    orderParams.params = Object.assign({}, state.orderParams.params, params);

    return Object.assign({}, state, {
        orderParams,
    });
};

const getAllPayTypes = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        allPayTypes: payload,
    });
};

const getAllChargeTypes = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        allChargeTypes: payload,
    });
};

const mallApList = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        homePics: payload,
    });
};

const savePreInfo = (state, action) => {
    const { payload } = action;
    console.log('这尼玛是什么：', Object.assign({}, state.preInfo, payload));
    return Object.assign({}, state, {
        preInfo: Object.assign({}, state.preInfo, payload),
    });
};

const payResultNeed = (state, action) => {
    const { cardData, payData } = action;
    return Object.assign({}, state, {
        payResultInfo: { cardData, payData },
    });
};

// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
    switch (action.type) {
        case 'SHOP::getProDuctList':
            return getProDuctList(state, action);
        case 'SHOP::listProductType':
            return listProductType(state, action);
        case 'SHOP::shopStartPreOrder':
            return shopStartPreOrder(state, action);
        case 'SHOP::getAllPayTypes':
            return getAllPayTypes(state, action);
        case 'SHOP::getAllChargeTypes':
            return getAllChargeTypes(state, action);
        case 'SHOP::shopStartPayOrder':
            return shopStartPayOrder(state, action);
        case 'HOME::mallApList':
            return mallApList(state, action);
        case 'PRE::savePreInfo':
            return savePreInfo(state, action);
        case 'PAY::payResultNeed':
            return payResultNeed(state, action);
        default:
            return actDefault(state, action);
    }
};

export default reducerFn;
