// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
fastclick.attach(document.body)
import './common/stylus/reset.css'
import { Button,Swipe, SwipeItem} from 'mint-ui'
Vue.component(Button.name, Button)
import './mock/mockServer'  // 加载这个模块即可
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'
Vue.use(VueLazyload, { // 内部会定义一个全局的指令: lazy
  loading
})
import './filters'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
