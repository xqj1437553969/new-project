import '../css/index.css';
import Vue from 'vue/dist/vue.min.js'
var vm = new Vue({
   el:"#app",
   data:{
   	  msg:"首页"
   },
   methods:{
   	 handClick(){
   	 	 alert(this.msg);
   	 	 window.location.href="list.html"
   	 }
   }
})

