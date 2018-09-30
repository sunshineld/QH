import axios from 'axios';
import VueRouter from 'vue-router';
import routes from './routes';
const router = new VueRouter({ routes });
import { Message } from 'element-ui';

// axios.defaults.timeout = 5000;
axios.defaults.baseURL ='http://192.168.1.121:80/qiheGroupMeal';
// axios.defaults.baseURL ='http://114.116.28.184:8081/qiheGroupMeal';
// axios.defaults.baseURL ='http://qihe.wezoz.com/qiheGroupMeal';


// axios.defaults.headers= {
//     'Authorization':AUTH_TOKEN
// }
//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token');
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/json',
      'Authorization':localStorage.getItem('token')
    }
    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log('--------------',response)
    if(response.data.msg == '未登陆'){
      Message.error('未登录,请重新登录');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '/login';
    } else {
      return response;
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={}){
  params._t = new Date().getTime();
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     axios.post(url,data)
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function remove(url,data = {}){
    return new Promise((resolve,reject) => {
      axios.delete(url,data)
           .then(response => {
             resolve(response.data);
           },err => {
             reject(err)
           })
    })
}