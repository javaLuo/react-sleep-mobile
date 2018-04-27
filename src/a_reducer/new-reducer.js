// ============================================
// ============================================
// Import modules

const initState = {
    homeRecommend: [], // 首页 - 热销产品
};

// ============================================
// action handling function

const actDefault = (state) => state;


const getRecommend = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        homeRecommend: payload || [],
    });
};


// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
    switch (action.type) {
        // 进入主页时，初始化左边box数据
        case 'NEW::recommend':
            return getRecommend(state, action);
        default:
            return actDefault(state, action);
    }
};

export default reducerFn;
