<template>
	<div class="header-container">		
		<div class="header">
		    <div class="login-box">
		    	<div class="userInfo">
		    		<span class="user"   v-if="loginshow">{{loginname}}</span>
		    		<span class="status" v-if="loginshow"  @click="logout">退出</span>
		    		<span class="status" v-else @click="goLogin">登录</span>
		    	</div>
		    </div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
	  name: 'Header',
	  data () {
	    return {
	      student:null,
	      loginshow:false,
	      loginname:'',
	      user:null
	    }
	  },
	  beforeMount(){
	  	  this.user = sessionStorage.getItem('user');
	  	  if(this.user){
	  	  	 this.user = JSON.parse(this.user)
	  	     this.loginname = this.user.loginname;
	  	  	 this.loginshow = this.user.loginshow;
	  	  }
	  	  var that = this;
	  	  eventBus.$on('login',function(r){
	  	  	 console.log(r);
	  	  	 that.loginshow = r.loginshow;
	  	  	 that.loginname = r.loginname;
	  	  	 sessionStorage.setItem('user',JSON.stringify(r));
	  	  })
	  },
	  methods:{
	  	 logout(){
	  	 	    this.student = JSON.parse(sessionStorage.getItem('student'));
		  	 	var that = this;
		  	 	axios({
				  method: 'post',
				  url:'../center/logout',
				  data:querystring.stringify({
				  	  studentId:that.student.studentId
				  })
			    })
		  	     .then(function(r) {
	                 if(r.data.success){
	                 	sessionStorage.removeItem('student');
	                 	sessionStorage.removeItem('user');
	                    that.loginshow = false;
	                    that.loginname = '';
	                 	that.$message({
				          message:'退出成功',
				          type: 'success',
				          duration:1500,
				          center:true
			            });
	                 }else{
	                 	that.$message({
				          message:r.data.desc,
				          type: 'warning',
				          duration:1500,
				          center:true
			            });
	                 }
			    })
			  	.catch(function (error) {
		              that.$message({
				          message:"请求失败",
				          type: 'error',
				          duration:1500,
				          center:true
			          });
				});
	  	},
	  	goLogin(){
	  		this.$router.push({ name: 'Login'});
	  	}
	}
}
</script>

<style scoped>
	.header-container{
		width:100%;
		background:#313131;
    }
	.header{
		margin:0 auto;
		width:1190px;
		color:#fff;
	}
	.login-box{
		height:40px;
	}
	.userInfo{
		float:right;
		line-height:40px;
	}
	.user{
		margin-right:10px;
	}
	.status{
		cursor:pointer;
	}
</style>