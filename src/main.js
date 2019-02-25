import './assets/css/main.scss'

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './http'

Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
