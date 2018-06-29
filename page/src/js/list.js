import '../lib/css/reset.css';
import '../css/list.css';
import Vue from 'vue/dist/vue.min.js'
var vm = new Vue({
   el:"#app",
   data:{
   	  msg:"列表页"
   },
   methods:{
   	 handClick(){
   	 	 alert(this.msg)
   	 }
   }
})

