// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Card from './select-card.vue'
Vue.filter('pricefilter', function (value) {
     return value.split(" ")[0];
})
Vue.filter('namefilter', function (value) {
     return value.split(" ")[1]; 
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<Card/>',
  components: {Card}
})