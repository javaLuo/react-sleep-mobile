// ============================================
// ============================================
// Import modules
import _ from 'lodash';

const initState = {
    allProducts: [],    // 所有的产品
    allProductsActive: [],    // 所有的产品
    allProductTypes: [],// 所有的产品类型
    orderParams: {      // 下单流程所需
        nowProduct: null,   // 当前的商品对象，包括ID、名称、型号等
        params: {       // 当前下单所需参数，购买数量，支付方式等等
            count: 0,           // 购买数量
            feeType: null,      // 收费类型ID
            serviceTime: null,  // 服务时间(水机安装时间)
            openAccountFee: 0,  // 开户费
            fee: 0,             // 总价
            payType: null,      // 支付方式ID
            isPay: false,        // 是否支付
            orderFrom: 2,       // 来源： 1:App, 2:微信，3：经销商
            addrId: null,       // 收货地址ID（除了评估卡，都有）
        },
        addr: null,             // 所选择的收货地址信息，用于展示
    },
    allPayTypes: [],    // 所有的支付方式，支付宝微信什么的
    allChargeTypes:[],  // 所有的收费方式，包年包流量什么的
    homePics: [],   // 首页轮播图
    preInfo: {      // 预约检查，用户输入的信息，最终接口所需数据
        userName: undefined,    // 名字 必填
        phone: undefined,       // 手机号 必填
        stationId: undefined,    // 服务站ID 必填
        stationName: '',    // 服务站名称 必填
        reserveTime: '',    // 预约时间 必填
        sex: 1,             // 性别，1男0女 必填
        ticketNo: '',       // 评估卡编号 必填
        height: undefined,   // 身高
        weight: undefined,  // 体重
        reserveFrom: 2,     // 用户来源 1APP， 2公众号，3后台添加
        reserveTime_Date: undefined,    // 临时 - 日期
        reserveTime_Time: undefined,    // 临时 - 时间
    },
    reportInfo: {       // 健康管理 - 检查报告 -添加检查报告所选取的各数据
        ticketNo: '',   // 评估卡号
        phone: '',      // 手机号
    },
    payResultInfo: {    // 支付成功，支付成功页面需要订单信息、生成的卡片信息
        cards: [],
        payInfo: {},
    },
    stationInfo: {},    // 当前所选服务站信息（用于体检预约）
    orderInfo: {},     // 当前所选订单信息（从我的订单点击进入订单详情时所需）
    cardInfo: {},       // 当前选中的卡信息（从我的评估卡点击，进入体检券页所需，卡片信息中包含了所有体检券信息）
    myCard: {           // 我的评估卡数据 保存分页的数据，各个地方都可以用
        data: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
    },
    proDetail: {},      // 从收益详情点击一条数据时，保存此条数据的信息，以便下一个页面使用
    freeCardInfo: {},   // 从我的优惠卡点击一条数据时，保存
    upAddrData: null,   // 当前编辑的收货地址信息
    sonInfo: null,      // 我的客户，主账号进入子账号要用
    iwantnow: 0,        // 可提现金额（从收益页进入提现页时带过去）
    tiXianDetail: null, // 从提现记录列表进入详情页时所需信息
    daiyanList: null,     // 代言卡选择页数据
    mapAddr: null,  // 进入地图时当前选择的地址
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

const getProDuctListActive = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        allProductsActive: payload,
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

const saveServiceInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        stationInfo: payload,
        preInfo: Object.assign({}, state.preInfo, {
            stationId: payload.station ? payload.station.id : "",
            stationName: payload.station ? payload.station.name : '',
            reserveTime: '',
            reserveTime_Time: undefined,
            reserveTime_Date: undefined,
        })
    });
};

const saveOrderInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        orderInfo: payload,
    });
};

const saveCardInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        cardInfo: payload,
    });
};

const saveReportInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        reportInfo: Object.assign({}, state.reportInfo, payload),
    });
};

const saveMyCardInfo = (state, action) => {
    const { data, pageNum, pageSize,total } = action;
    return Object.assign({}, state, {
        myCard: {
            data,
            pageNum,
            pageSize,
            total,
        },
    });
};

const saveProDetail = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        proDetail: payload,
    });
};

const saveFreeCardInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        freeCardInfo: payload,
    });
};

const onSaveUpAddrNow = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        upAddrData: payload,
    });
};

const saveSonInInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        sonInfo: payload,
    });
};

const saveShopAddr = (state, action) => {
    const { params } = action;
    const orderParams = _.cloneDeep(state.orderParams);
    orderParams.params = Object.assign({}, state.orderParams.params, {addrId: params.id});
    orderParams.addr = params;
    return Object.assign({}, state, {
        orderParams,
    });
};

const setDefaultAttr = (state, action) => {
    const { payload } = action;
    const orderParams = _.cloneDeep(state.orderParams);
    orderParams.params = Object.assign({}, state.orderParams.params, {addrId: payload ? payload.id : null});
    orderParams.addr = payload;
    return Object.assign({}, state, {
        orderParams,
    });
};

const saveIWantNow = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        iwantnow: payload,
    });
};

const saveTiXianDetailInfo = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        tiXianDetail: payload,
    });
};

const getDaiYanList = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        daiyanList: payload,
    });
};

const saveMapAddr = (state, action) => {
    const { payload } = action;
    return Object.assign({}, state, {
        mapAddr: payload,
    });
};
// ============================================
// reducer function

const reducerFn = (state = initState, action) => {
    switch (action.type) {
        case 'SHOP::getProDuctList':
            return getProDuctList(state, action);
        case 'SHOP::getProDuctListActive':
            return getProDuctListActive(state, action);
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
        case 'PRE::saveServiceInfo':
            return saveServiceInfo(state, action);
        case 'PRE::saveOrderInfo':
            return saveOrderInfo(state, action);
        case 'PRE::saveCardInfo':
            return saveCardInfo(state, action);
        case 'PRE::saveReportInfo':
            return saveReportInfo(state, action);
        case 'PRE::saveMyCardInfo':
            return saveMyCardInfo(state, action);
        case 'PRE::saveProDetail':
            return saveProDetail(state, action);
        case 'PRE::saveFreeCardInfo':
            return saveFreeCardInfo(state, action);
        case 'ADDR::onSaveUpAddrNow':
            return onSaveUpAddrNow(state, action);
        case 'MY::saveSonInInfo':
            return saveSonInInfo(state, action);
        case 'SHOP::saveShopAddr':
            return saveShopAddr(state, action);
        case 'APP::setDefaultAttr':
            return setDefaultAttr(state, action);
        case 'PRE::saveIWantNow':
            return saveIWantNow(state, action);
        case 'PRE::saveTiXianDetailInfo':
            return saveTiXianDetailInfo(state, action);
        case 'MY::getDaiYanList':
            return getDaiYanList(state, action);
        case 'MY::saveMapAddr':
            return saveMapAddr(state, action);
        default:
            return actDefault(state, action);
    }
};

export default reducerFn;
