// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 import Vue from 'vue'//导入vue
 import ElementUI from 'element-ui'//引入element组价
import 'element-ui/lib/theme-chalk/index.css'//映入element的css
import App from './App'//根组件
import router from './router'//vue-router的路由
import store from "./store"//vuex数据仓库
import i18n from '@/i18n'//语言包
import "babel-polyfill";//es6编译
import './permissions'//全局路由钩子
import '~/css/index.scss'//cms样式
import global from "@/untils/global"//全局方法
import cmsComponents from "@/components/index";//全局的组件引入
import '@/directive/index' //自定义权限指令
Vue.use(cmsComponents);//组件全局挂载
Vue.use(ElementUI)//element组件全局的挂载
import VueBus from 'vue-bus';
Vue.use(VueBus);

Vue.config.productionTip = false
Vue.use(global);
new Vue({
  router,
  store,
    i18n,
  template: '<App/>',
  components: { App }
}).$mount('#app')
