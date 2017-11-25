// ============================================
// ============================================
// Import modules

const initState = {
    allProducts: [],    // 所有的产品
    allProductTypes: [],// 所有的产品类型
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
// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
    switch (action.type) {
        case 'SHOP::getProDuctList':
            return getProDuctList(state, action);
        case 'SHOP::listProductType':
            return listProductType(state, action);
        default:
            return actDefault(state, action);
    }
};

export default reducerFn;
