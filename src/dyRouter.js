// import ForgetPassword from './views/ForgetPassword.vue'
// import NotFound from './views/404.vue'
// import Home from './views/Home.vue'
// import Main from './views/Main.vue'
// import echarts from './views/charts/echarts.vue'

// //基本信息维护
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

// //引入图标
// import BaseMsg from './assets/base_msg.png'
// import StoreImg from './assets/store.png'
// import Staff from './assets/staff.png'
// import Finance from './assets/finance.png'
// import Account from './assets/account.png'
// import Data from './assets/data.png'
// import Setting from './assets/seting.png'

// //动态路由
// export const dynamicRouter = [
//     {
//         path: '/',
//         component: Home,
//         name: '基础信息维护',
//         iconCls: BaseMsg,//图标样式class
//         meta: { id: '1' },
//         children: [
//             {path: '/companyBaseMsg', component: CompanyBaseMsg, name: '公司基础信息维护',  meta: { id: '11' }},
//             {path: '/staffMsg', component: StaffMsg, name: '员工信息', meta: { id: '12' }},
//             {path: '/store', component: Store, name: '门店', meta: { id: '13' }},
//             {path: '/cooperativeCustomers', component: CooperativeCustomers, name: '合作客户', meta: { id: '14' }},
//             {path: '/storeBaseMsg', component: StoreBaseMsg, name: '门店基础信息维护', meta: { id: '15' }},
//         ]
//     },
//     {
//         path: '/',
//         component: Home,
//         name: '门店管理',
//         iconCls: StoreImg,//图标样式class
//         meta: { id: '2' },
//         children: [
//             {path: '/storeAllocation', component: StoreAllocation, name: '门店配置', meta: { id: '21' }},
//             {path: '/windowsManagement', component: WindowsManagement, name: '窗口管理', meta: { id: '22' }},
//             {path: '/menuSettings', component: MenuSettings, name: '菜单设置', meta: { id: '23' }},
//         ]
//     },
//     {
//         path: '/',
//         component: Home,
//         name: '就餐人员管理',
//         iconCls: Staff,
//         meta: { id: '3' },
//         children: [
//             {path: '/staffManagment', component: StaffManagment, name: '就餐人员管理', meta: { id: '31' }}
//         ]
//     },
//     {
//         path: '/',
//         component: Home,
//         name: '财务管理',
//         iconCls: Finance,//图标样式class
//         meta: { id: '4' },
//         children: [
//             {path: '/financiaFlow', component: FinanciaFlow, name: '消费流水', meta: { id: '41' }},
//             {path: '/settlementSheet', component: SettlementSheet, name: '结算单', meta: { id: '42' }},
//             {path: '/welfareGrant', component: WelfareGrant, name: '福利金发放', meta: { id: '43' }},
//             {path: '/welfareFlow', component: WelfareFlow, name: '福利金流水', meta: { id: '44' }},
//             {path: '/cashFlow', component: CashFlow, name: '现金充值流水', meta: { id: '45' }},
//             {path: '/welfareClear', component: WelfareClear, name: '福利金清零', meta: { id: '46' }}
//         ]
//     },
//     {
//         path: '/',
//         component: Home,
//         name: '账号管理',
//         iconCls: Account,
//         meta: { id: '5' },
//         children: [
//             {path: '/accountManagement', component: AccountManagement, name: '账号管理', meta: { id: '51' }}
//         ]
//     },
//     {
//         path: '/',
//         component: Home,
//         name: '数据统计',
//         iconCls: Data,//图标样式class
//         meta: { id: '6' },
//         children: [
//             {path: '/dataStatistics', component: DataStatistics, name: '数据统计', meta: { id: '61' }}
//         ]
//     },
//     {
//         path: '/',
//         component: Home,
//         name: '设置',
//         iconCls: Setting,//图标样式class
//         meta: { id: '7' },
//         children: [
//             {path: '/jurisdictionSetting', component: JurisdictionSetting, name: '权限设置', meta: { id: '71' }},
//             {path:'/settlementRules',component: SettlementRules, name:'结算单生成规则', meta: { id: '72' }},
//             {path:'/revisePassword',component: RevisePassword, name:'密码修改', meta: { id: '73' }},
//             {path:'', logout: true, name:'登出/切换', meta: { id: '74' }}
//         ]
//     }
// ]
// export function getRouters(permissions) {
//     let dR = [];
//     for (let i=0;i<dynamicRouter.length;i++) {
//         let index = permissions.indexOf(dynamicRouter[i].meta.id);
//         if(index > -1) {
//             dR.push(dynamicRouter[i]);
//         }
//     }
//     for(let j = 0,len = dR.length; j < len; j ++) {
//         for(let m = dR[j].children.length - 1; m >=0; m --) {
//         let index = permissions.indexOf(dR[j].children[m].meta.id);
//         if(index < 0) {
//             dR[j].children.splice(m,1);
//         }
//         }
//     }
//     return dR
// }

