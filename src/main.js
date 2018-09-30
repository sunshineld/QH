import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
// import './styles/font.scss';
// import _global from './components/Global.vue'
import VueQriously from 'vue-qriously';

import { post, put, fetch, remove } from './http'


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueQriously); 

// Vue.prototype.global = _global;
Vue.prototype.$post=post;
Vue.prototype.$fetch=fetch;
Vue.prototype.$put=put;
Vue.prototype.$remove=remove;
//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})
import { getUserRouterPaths } from './routes.js'
import { Message } from 'element-ui'
router.beforeEach((to, from, next) => { 
  if (to.path == '/login') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  let token = localStorage.getItem('token');

  if(token) {
    let permissions = JSON.parse(localStorage.getItem('user')).permissions;
    let userRouters = getUserRouterPaths(permissions)
    if (userRouters.indexOf(to.path) != -1) {
      next();
    } else {
      Message.error('你没有权限访问该页面')
    }
  } else {
    
    if(to.path == '/forgetPassword') {
      next()
    } else if(to.path == '/login') {
      next()
    } else {
      next({ path: '/login'})
    }
  }

})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
	
}).$mount('#app')

