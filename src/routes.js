// import Login from './views/Login.vue'
// import ForgetPassword from './views/ForgetPassword.vue'
// import NotFound from './views/404.vue'
// import Home from './views/Home.vue'
// import Main from './views/Main.vue'
// import echarts from './views/charts/echarts.vue'

// // 基本信息维护
// const CompanyBaseMsg = resolve => require(["@/views/BaseMsg/CompanyBaseMsg.vue"], resolve);//公司基础信息维护
// const StaffMsg = resolve => require(["@/views/BaseMsg/StaffMsg.vue"], resolve);//员工信息
// const Store = resolve => require(["@/views/BaseMsg/Store.vue"], resolve);//门店
// const CooperativeCustomers = resolve => require(["@/views/BaseMsg/CooperativeCustomers.vue"], resolve);//合作客户
// const StoreBaseMsg = resolve => require(["@/views/BaseMsg/StoreBaseMsg.vue"], resolve);//门店基础信息维护

// //门店管理
// const StoreAllocation = resolve => require(["@/views/StoreManagement/StoreAllocation.vue"],resolve);//门店配置
// const WindowsManagement = resolve => require(["@/views/StoreManagement/WindowsManagement.vue"],resolve);//窗口管理
// const MenuSettings = resolve => require(["@/views/StoreManagement/MenuSettings.vue"],resolve);//菜单设置

// //就餐人员管理 
// const StaffManagment = resolve => require(["@/views/StaffManagment/StaffManagment.vue"],resolve);

// //财务管理

// const FinanciaFlow = resolve => require(["@/views/FinancialManagement/FinanciaFlow.vue"],resolve);//消费流水
// const SettlementSheet = resolve => require(["@/views/FinancialManagement/SettlementSheet.vue"],resolve);//结算单
// const WelfareGrant = resolve => require(["@/views/FinancialManagement/WelfareGrant.vue"],resolve);//福利卡发放
// const WelfareFlow = resolve => require(["@/views/FinancialManagement/WelfareFlow.vue"],resolve);//福利金流水
// const CashFlow = resolve => require(["@/views/FinancialManagement/CashFlow.vue"],resolve);//现金流水
// const WelfareClear = resolve => require(["@/views/FinancialManagement/WelfareClear.vue"],resolve);//福利卡清零

// //账号管理
// const AccountManagement = resolve => require(["@/views/AccountManagement/AccountManagement.vue"],resolve);

// //数据统计
// const DataStatistics = resolve => require(["@/views/DataStatistics/DataStatistics.vue"],resolve);

// //设置
// const JurisdictionSetting = resolve => require(["@/views/Setting/JurisdictionSetting.vue"],resolve);//权限配置
// const DataRecovery = resolve => require(["@/views/Setting/DataRecovery.vue"],resolve);//数据恢复 Settlement rules
// const SettlementRules = resolve => require(["@/views/Setting/SettlementRules.vue"],resolve);//结算单生成规则
// const OperationLog = resolve => require(["@/views/Setting/OperationLog.vue"],resolve);//操作日志
// const RevisePassword = resolve => require(["@/views/Setting/RevisePassword.vue"],resolve);//密码修改

// // //引入图标
// // import BaseMsg from './assets/base_msg.png'
// // import StoreImg from './assets/store.png'
// // import Staff from './assets/staff.png'
// // import Finance from './assets/finance.png'
// // import Account from './assets/account.png'
// // import Data from './assets/data.png'
// // import Setting from './assets/seting.png'

// let routes = [
//     {
//         path: '/login',
//         component: Login,
//         name: '',
//         hidden: true
//     },
//     {
//         path: '/404',
//         component: NotFound,
//         name: '',
//         hidden: true
//     },
//     {
//         path: '/forgetPassword',
//         component: ForgetPassword,
//         name: '',
//         hidden: true
//     },
//     // {
//     //     path: '/',
//     //     component: Home,
//     //     name: '基础信息维护',
//     //     iconCls: BaseMsg,//图标样式class
//     //     children: [
//     //         {path: '/companyBaseMsg', component: CompanyBaseMsg, name: '公司基础信息维护'},
//     //         {path: '/staffMsg', component: StaffMsg, name: '员工信息'},
//     //         {path: '/store', component: Store, name: '门店'},
//     //         {path: '/cooperativeCustomers', component: CooperativeCustomers, name: '合作客户'},
//     //         {path: '/storeBaseMsg', component: StoreBaseMsg, name: '门店基础信息维护'}
//     //     ]
//     // },
//     // {
//     //     path: '/',
//     //     component: Home,
//     //     name: '门店管理',
//     //     iconCls: StoreImg,//图标样式class
//     //     children: [
//     //         {path: '/storeAllocation', component: StoreAllocation, name: '门店配置'},
//     //         {path: '/windowsManagement', component: WindowsManagement, name: '窗口管理'},
//     //         {path: '/menuSettings', component: MenuSettings, name: '菜单设置'},
            
//     //     ]
//     // },
//     // {
//     //     path: '/',
//     //     component: Home,
//     //     name: '就餐人员管理',
//     //     iconCls: Staff,
//     //     children: [
//     //         {path: '/staffManagment', component: StaffManagment, name: '就餐人员管理'}
//     //     ]
//     // },
//     // {
//     //     path: '/',
//     //     component: Home,
//     //     name: '财务管理',
//     //     iconCls: Finance,//图标样式class
//     //     children: [
//     //         {path: '/financiaFlow', component: FinanciaFlow, name: '消费流水'},
//     //         {path: '/settlementSheet', component: SettlementSheet, name: '结算单'},
//     //         {path: '/welfareGrant', component: WelfareGrant, name: '福利金发放'},
//     //         {path: '/welfareFlow', component: WelfareFlow, name: '福利金流水'},
//     //         {path: '/cashFlow', component: CashFlow, name: '现金充值流水'},
//     //         {path: '/welfareClear', component: WelfareClear, name: '福利金清零'}
//     //     ]
//     // },
//     // {
//     //     path: '/',
//     //     component: Home,
//     //     name: '账号管理',
//     //     iconCls: Account,
//     //     children: [
//     //         {path: '/accountManagement', component: AccountManagement, name: '账号管理'}
//     //     ]
//     // },
//     // {
//     //     path: '/',
//     //     component: Home,
//     //     name: '数据统计',
//     //     iconCls: Data,//图标样式class
//     //     children: [
//     //         {path: '/dataStatistics', component: DataStatistics, name: '数据统计'}
//     //     ]
//     // },
//     // {
//     //     path: '/',
//     //     component: Home,
//     //     name: '设置',
//     //     iconCls: Setting,//图标样式class
//     //     children: [
//     //         {path: '/jurisdictionSetting', component: JurisdictionSetting, name: '权限设置'},
//     //         // {path: '/dataRecovery', component: DataRecovery, name: '数据恢复'},
//     //         {path:'/settlementRules',component: SettlementRules, name:'结算单生成规则'},
//     //         // {path:'/operationLog',component: OperationLog, name:'操作日志'},
//     //         {path:'/revisePassword',component: RevisePassword, name:'密码修改'},
//     //         {path:'', logout: true, name:'登出/切换'}
//     //     ]
//     // },
//     {
//         path: '*',
//         hidden: true,
//         redirect: {path: '/404'}
//     }
// ];
// export default routes;

import Login from './views/Login.vue'
import ForgetPassword from './views/ForgetPassword.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import echarts from './views/charts/echarts.vue'

//基本信息维护
const CompanyBaseMsg = resolve => require(["@/views/BaseMsg/CompanyBaseMsg.vue"], resolve);//公司基础信息维护
const StaffMsg = resolve => require(["@/views/BaseMsg/StaffMsg.vue"], resolve);//员工信息
const Store = resolve => require(["@/views/BaseMsg/Store.vue"], resolve);//门店
const CooperativeCustomers = resolve => require(["@/views/BaseMsg/CooperativeCustomers.vue"], resolve);//合作客户
const StoreBaseMsg = resolve => require(["@/views/BaseMsg/StoreBaseMsg.vue"], resolve);//门店基础信息维护

//门店管理
const StoreAllocation = resolve => require(["@/views/StoreManagement/StoreAllocation.vue"],resolve);//门店配置
const WindowsManagement = resolve => require(["@/views/StoreManagement/WindowsManagement.vue"],resolve);//窗口管理
const MenuSettings = resolve => require(["@/views/StoreManagement/MenuSettings.vue"],resolve);//菜单设置

//就餐人员管理 
const StaffManagment = resolve => require(["@/views/StaffManagment/StaffManagment.vue"],resolve);

//财务管理

const FinanciaFlow = resolve => require(["@/views/FinancialManagement/FinanciaFlow.vue"],resolve);//消费流水
const SettlementSheet = resolve => require(["@/views/FinancialManagement/SettlementSheet.vue"],resolve);//结算单
const WelfareGrant = resolve => require(["@/views/FinancialManagement/WelfareGrant.vue"],resolve);//福利卡发放
const WelfareFlow = resolve => require(["@/views/FinancialManagement/WelfareFlow.vue"],resolve);//福利金流水
const CashFlow = resolve => require(["@/views/FinancialManagement/CashFlow.vue"],resolve);//现金流水
const WelfareClear = resolve => require(["@/views/FinancialManagement/WelfareClear.vue"],resolve);//福利卡清零

//账号管理
const AccountManagement = resolve => require(["@/views/AccountManagement/AccountManagement.vue"],resolve);

//数据统计
const DataStatistics = resolve => require(["@/views/DataStatistics/DataStatistics.vue"],resolve);

//设置
const JurisdictionSetting = resolve => require(["@/views/Setting/JurisdictionSetting.vue"],resolve);//权限配置
const DataRecovery = resolve => require(["@/views/Setting/DataRecovery.vue"],resolve);//数据恢复 Settlement rules
const SettlementRules = resolve => require(["@/views/Setting/SettlementRules.vue"],resolve);//结算单生成规则
const OperationLog = resolve => require(["@/views/Setting/OperationLog.vue"],resolve);//操作日志
const RevisePassword = resolve => require(["@/views/Setting/RevisePassword.vue"],resolve);//密码修改


var routerMap = {
	'11': { component: CompanyBaseMsg, path: '/companyBaseMsg' },
	'12': { component: StaffMsg, path: '/staffMsg' },
	'13': { component: Store, path: '/store' },
	'14': { component: CooperativeCustomers, path: '/cooperativeCustomers'},
	'15': { component: StoreBaseMsg, path: '/storeBaseMsg'  },
	'21': { component: StoreAllocation, path: '/storeAllocation' },
	'22': { component: WindowsManagement, path: '/windowsManagement' },
	'23': { component: MenuSettings, path: '/menuSettings' },
	'31': { component: StaffManagment, path: '/staffManagment' },
	'41': { component: FinanciaFlow, path: '/financiaFlow'},
	'42': { component: SettlementSheet, path: '/settlementSheet' },
	'43': { component: WelfareGrant, path: '/welfareGrant' },
	'44': { component: WelfareFlow, path: '/welfareFlow' },
	'45': { component: CashFlow, path: '/cashFlow' },
	'46': { component: WelfareClear, path: '/welfareClear' },
	'51': { component: AccountManagement, path: '/accountManagement' },
	'61': { component: DataStatistics, path: '/dataStatistics' },
	'71': { component: JurisdictionSetting, path: '/jurisdictionSetting' },
	'72': { component: SettlementRules, path: '/settlementRules'},
	'73': { component: RevisePassword, path: '/revisePassword' },
	'74': { path: '' }
}

var defaultRouter = [
    { path: '/login', component: Login },
    { path: '/404', component: NotFound },
    { path: '/forgetPassword', component: ForgetPassword },
    { path: '*', redirect: {path: '/404'}  }
]

export function getAllRouters() {
    let router = []
    let homeRouter = {
        path: '/', 
        component: Home,
        children: []
    
    }
    for (let key in routerMap) {
        homeRouter.children.push(routerMap[key])
    }
    router.push(homeRouter)
    return router.concat(defaultRouter);
}

export function getUserRouterPaths(permissions) {
    let routerPaths = []
    if (permissions) {
        for (let i = 0; i < permissions.length; i++) {
            let p = permissions[i];
            let r = routerMap[p];
            if (r) {
                routerPaths.push(r.path);
            }
        }
    }
    
    for (let i = 0; i < defaultRouter.length; i++) {
        let r = defaultRouter[i];
        routerPaths.push(r.path);
    }
    
    return routerPaths;
}

export default getAllRouters();