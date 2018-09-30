import axios from 'axios';


let base = 'http://192.168.1.121:80/qiheGroupMeal';

//登录
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
//忘记密码
export const getVerificationCode = params => { return axios.post(`${base}/user/verification`, params).then(res => res.data); };//获取验证码
export const verificationCode = params => { return axios.post(`${base}/user/retrieve`, params).then(res => res.data); };//验证验证码获取密码

//#region  基础信息维护
export const getDepartmentList = params => { return axios.get(`${base}/departments/1`,{ params }); };//获取部门列表信息
export const addDepartment = params => { return axios.post(`${base}/department`, params);};//添加部门
export const editDepartment = params => { return axios.put(`${base}/department`, params);};//编辑部门

export const getPositionList = params => { return axios.get(`${base}/positions/1`,{ params: params }); };//获取职位列表
export const addPosition = params => { return axios.post(`${base}/position`,{ params: params }); };//添加职位
export const editPosition = params => { return axios.put(`${base}/position`,{ params: params }); };//编辑职位

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };
// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

// export const getCanteenList = params => { return axios.get(`${base}/canteen/list`, { params: params }); };
// export const getCanteenListPage = params => { return axios.get(`${base}/canteen/listpage`, { params: params }); };
// export const removeCanteen = params => { return axios.get(`${base}/canteen/remove`, { params: params }); };
// export const batchRemoveCanteen = params => { return axios.get(`${base}/canteen/batchremove`, { params: params }); };
// export const editCanteen = params => { return axios.get(`${base}/canteen/edit`, { params: params }); };
// export const addCanteen = params => { return axios.get(`${base}/canteen/add`, { params: params }); };

// export const getCanteenWindowsList = params => { return axios.get(`${base}/canteenWindows/list`, { params: params }); };
// export const getCanteenWindowsListPage = params => { return axios.get(`${base}/canteenWindows/listpage`, { params: params }); };
// export const removeCanteenWindows = params => { return axios.get(`${base}/canteenWindows/remove`, { params: params }); };
// export const batchRemoveCanteenWindows = params => { return axios.get(`${base}/canteenWindows/batchremove`, { params: params }); };
// export const editCanteenWindows = params => { return axios.get(`${base}/canteenWindows/edit`, { params: params }); };
// export const addCanteenWindows = params => { return axios.get(`${base}/canteenWindows/add`, { params: params }); };


// export const getContactTypeListPage = params => { return axios.get(`${base}/canteenType/listPage`, { params: params }); };
//#endregion

//#region  客商信息

//#endregion

//#region  财务管理

//#endregion

//#region  查询统计

//#endregion

//#region  系统管理

//#endregion
