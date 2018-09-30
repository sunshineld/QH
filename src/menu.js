//引入图标
import BaseMsg from './assets/base_msg.png'
import StoreImg from './assets/store.png'
import Staff from './assets/staff.png'
import Finance from './assets/finance.png'
import Account from './assets/account.png'
import Data from './assets/data.png'
import Setting from './assets/seting.png'

var menuMap = {
	'1': {
		name: '基础信息维护',
		path: '/',
		iconCls: BaseMsg,
		children: {
			'11': { name: '公司基础信息维护', path: '/companyBaseMsg' },
			'12': { name: '员工信息', path: '/staffMsg' },
			'13': { name: '门店', path: '/store' },
			'14': { name: '合作客户', path: '/cooperativeCustomers' },
			'15': { name: '门店基础信息维护', path: '/storeBaseMsg' }
		}
	},
	'2': {
		name: '门店管理',
		path: '/',
		iconCls: StoreImg,
		children: {
			'21': { name: '门店配置', path: '/storeAllocation' },
			'22': { name: '窗口管理', path: '/windowsManagement' },
			'23': { name: '菜单设置', path: '/menuSettings' }
		}
	},
	'3': {
		name: '就餐人员管理',
		path: '/',
		iconCls: Staff,
		children: {
			'31': { name: '就餐人员管理', path: '/staffManagment' }
		}
	},
	'4': {
		name: '财务管理',
		path: '/',
		iconCls: Finance,
		children: {
			'41': { name: '消费流水', path: '/financiaFlow' },
			'42': { name: '结算单', path: '/settlementSheet' },
			'43': { name: '福利金发放', path: '/welfareGrant' },
			'44': { name: '福利金流水', path: '/welfareFlow' },
			'45': { name: '现金充值流水', path: '/cashFlow' },
			'46': { name: '福利金清零', path: '/welfareClear' }
		}
	},
	'5': {
		name: '账号管理',
		path: '/',
		iconCls: Account,
		children: {
			'51': { name: '账号管理', path: '/accountManagement' }
		}
	},
	'6': {
		name: '数据统计',
		path: '/',
		iconCls: Data,
		children: {
			'61': { name: '数据统计', path: '/dataStatistics' }
		}
	},
	'7': {
		name: '设置',
		path: '/',
		iconCls: Setting,
		children: {
			'71': { name: '权限设置', path: '/jurisdictionSetting' },
			'72': { name: '结算单生成规则', path: '/settlementRules' },
			'73': { name: '密码修改', path: '/revisePassword' },
			'74': { name: '登出/切换', path: '', logout: true }
		}
	}
}

export function getMenuList(permissions) {
    let menuList = [];
    for (let i = 0; i < permissions.length; i++) {
        let p = permissions[i];
        let firstMenu = menuMap[p];
        if (firstMenu) {
            let menu = {};
            menu.name = firstMenu.name;
			menu.path = firstMenu.path;
            menu.iconCls = firstMenu.iconCls;
            
            let children = [];
            let childrenMap = firstMenu.children;
            for (let c in childrenMap) {
                if (permissions.indexOf(c) != -1) {
                    children.push(childrenMap[c]);
                }
            }
			menu.children = children;
			menuList.push(menu);
        }
    }
    
    return menuList
}