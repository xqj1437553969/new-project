// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import GetCard from './getCard.vue'
Vue.config.productionTip = false
import {Area,Popup} from 'vant'
Vue.use(Area)
Vue.use(Popup)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<GetCard/>',
  components: {GetCard}
})