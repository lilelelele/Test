import "babel-polyfill"
import Vue from 'vue'
import Jpush from './other/jpush'
import App from './App'
import router from './router'
import store from './store/'
import { server } from './config'
import Vuerify from 'vuerify'
import {ToastPlugin,XHeader,DatetimePlugin,AlertPlugin,ConfirmPlugin} from 'vux'
import VueScroller from 'vue-scroller'
import VueCordova from 'vue-cordova'

import Croppa from 'vue-croppa';
Vue.use(Croppa);

Vue.use(ToastPlugin)
Vue.use(DatetimePlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.component('x-header', XHeader)
Vue.use(VueScroller)

Vue.use(VueCordova, {
  optionTestKey: 'optionTestValue'
})
Vue.use(Vuerify /*, add rules */)

//引入权限控制器
import './other/auth.js'

Vue.config.productionTip = false;
Vue.prototype.server = server;
Vue.prototype.$jpush = Jpush;

window.vm = new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
});