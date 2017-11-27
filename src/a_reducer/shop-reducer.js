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
        default:
            return actDefault(state, action);
    }
};

export default reducerFn;
