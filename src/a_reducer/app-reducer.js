// ============================================
// ============================================
// Import modules

const initState = {
  num: 0,           // 测试 - 初始值0
  fetchvalue: [],   // 测试 -
    userinfo: null, // 全局用户信息
    wxCode: '',     // 微信网页授权 - code
};

// ============================================
// action handling function

const actDefault = (state) => state;


const getUserInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        userinfo: payload,
    });
};

const saveWxCode = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        wxCode: payload,
    });
};
// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
  switch (action.type) {
  // 进入主页时，初始化左边box数据
  case 'APP::getUserInfo':
    return getUserInfo(state, action);
  case 'APP::saveWxCode':
    return saveWxCode(state, action);
  default:
    return actDefault(state, action);
  }
};

export default reducerFn;
