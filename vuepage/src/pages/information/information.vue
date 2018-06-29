<template>
   <div id="header">
   		<div id="loadingToast" v-if="loading">
		        <div class="weui-mask_transparent"></div>
		        <div class="weui-toast">
		            <i class="weui-loading weui-icon_toast"></i>
		            <p class="weui-toast__content">数据加载中</p>
		        </div>
    	</div>
		<div class="container"v-if="!loading">
			<ul>
				<li id="improve-info" @click="go(userInfoHref)"><span class="left">个人信息</span><img class="right" src="../../assets/icon_03.png" alt="" /></li>
				<li id="card-record" class="record" @click="go(cardRecordHref)"><span class="left ">领卡记录</span><img class="right" src="../../assets/icon_03.png" alt="" /></li>
				<li id="business-record" class="record" @click="go(businessRecordHref)"><span class="left ">开通记录</span><img class="right" src="../../assets/icon_03.png" alt="" /></li>
				<li id="prepaid-record" class="record" @click="go(prepaidRecordHref)"><span class="left ">充值记录</span><img class="right" src="../../assets/icon_03.png" alt="" /></li>
			</ul>
			<button id="btn-logout" @click="logout">退出登录</button>
		</div>
   </div>
</template>

<script>
	import axios from 'axios';
    const querystring = require('querystring');
	export default {
	  name: 'selectcard',
	  data(){
	  	 return{
	  	 	code:null,
	  	 	openId:null,
	  	 	loading:false,
	  	 	student:null,
	  	 	canLogout:true,
	  	 	userInfoHref:'userInfo.html',
	  	 	cardRecordHref:'cardRecord.html',
	  	 	businessRecordHref:'businessRecord.html',
	  	 	prepaidRecordHref:'prepaidRecord.html?prepaidType=0'
	  	 }
	  },
	  methods:{
	  	 pushHistory() {
		    window.addEventListener("popstate", function(e) {
		        self.location.reload();
		    }, false);
		    var state = {
		        title : "",
		        url : "#"
		    };
		    window.history.replaceState(state, "", "#");
		},
		go(href){
	     	window.location.href = href;
	    },
	    logout(){
	    	var that = this;
	    	if(this.canLogout){
	    	    this.canLogout = false;
			   	axios({
					  method: 'post',
					  url: '../center/logout',
					  data: querystring.stringify({
					  	    studentId:that.student.studentId
				      })
				 })
			   	 .then(function(res){
			   	 	 if(res.data.success){
				      	 sessionStorage.removeItem("student");
				         that.$toast({
				    		message:'登出成功',
				    		duration:800
		    			});
				      	 setTimeout(function() {
				      	     that.canLogout = true;
							 location.href = 'login.html'
						 }, 500)
			         }
				 })
	    	}
	    	
	    },
		getQueryString(str) {
			var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
	   },
	   getData(){
	   	    var that = this;
	   	    that.loading = true;
		   	axios({
				  method: 'post',
				  url: '../center/information',
				  data: querystring.stringify({
				  	   code:that.code
			      })
			 })
		   	 .then(function(res){
		   	 	if(res.data.success){
					if(!res.data.data.student){
//						window.location.href = "login.html";
					}else{
						that.loading = false;
						that.student = res.data.data.student;
						sessionStorage.setItem("student",JSON.stringify(that.student));
					}
					that.openId = res.data.data.openId;
					sessionStorage.setItem("openId",that.openId);
				}else{
					window.location.href = res.data.desc;
				}
			 })
	    }
	  },
	  beforeMount(){
	  	 this.pushHistory();
	  	 this.code = this.getQueryString("code");
	  	 this.getData();
	  }
	}
</script>
<style>
@import '../../assets/weui.min.css' ;
@import '../../assets/reset.css' ;
#header{
	height:100%;
}
.container{
	height:100%;
	background: url(../../assets/back.jpg) no-repeat 0 0;
	background-size:100% 100%;
	font-size:.16rem;
}
ul{width:100%;}
li{ 
	width:100%;
	padding-left:.27rem;
	padding-right:.39rem;
	height:.48rem;
	line-height:.48rem;
	background:#dddcde;
	box-sizing:border-box;
}
li.record{margin-top:.06rem;}
li>.left{
	float:left;
}
li>.right{
	width:.13rem;
	height:.48rem;
	float:right;
}
#btn-logout{
	display:block;
	width:3.25rem;
	height:.45rem;
	border:none;
	outline:none;
	border-radius:.07rem;
	background:#ca1d7b;
	margin-top:3.02rem;
	margin-left:.25rem;
	text-align:center;
	line-height:.45rem;
	font-size:.16rem;
	color:#fff;
	font-family:"微软雅黑";
}

</style>
