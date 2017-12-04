// ============================================
// ============================================
// Import modules

const initState = {
  num: 0,           // 初始值0
  fetchvalue: [],
    userinfo: null, // 通过getUserInfo接口获取的用户信息
    wxCode: '', // 微信网页授权 - code
};

// ============================================
// action handling function

const actDefault = (state) => state;

const testAdd = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    num: payload,
  });
};

const testFetch = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, {
    fetchvalue: payload,
  });
};

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
  case 'TEST::add':
    return testAdd(state, action);
  case 'TEST::testFetch':
    return testFetch(state, action);
  case 'APP::getUserInfo':
    return getUserInfo(state, action);
  case 'APP::saveWxCode':
    return saveWxCode(state, action);
  default:
    return actDefault(state, action);
  }
};

export default reducerFn;
