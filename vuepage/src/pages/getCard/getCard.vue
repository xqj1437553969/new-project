<template>
   <div id="header">
   	  <div id="loadingToast" v-if="loading">
	        <div class="weui-mask_transparent"></div>
	        <div class="weui-toast">
	            <i class="weui-loading weui-icon_toast"></i>
	            <p class="weui-toast__content">数据加载中</p>
	        </div>
      </div>
   	  <div class="container">
	    	<div id="title">已选择"英国Giffgaff卡"</div>
	    	<div id="write-title">请填写个人信息</div>
	    	<div class="form">
	    		<div class="cell"><label class="label">姓名</label></div>
	            <div class="cell-input">
	                 <input type="text" id="username" placeholder="请输入姓名" v-model="username">
	            </div>
	    	</div>
	    	<div class="form">
	    		<div class="cell"><label class="label">手机号码</label></div>
	            <div class="cell-input">
	                 <input type="number" id="phone" placeholder="请输入国内手机号码"  v-model="phone">
	            </div>
	    	</div>
	    	<div class="code-form">
		    	<div class="form">
		    		<div class="cell"><label class="label">验证码</label></div>
		            <div class="cell-input">
		                 <input type="number" id="code" placeholder="请输入验证码" v-model="captcha">
		            </div>
		    	</div>
		    	<button id="get-code" @click="getCaptcha" :disabled="btnClick" v-text="title"></button>
	    	</div>
	    	<div id="write-address">请填写配送地址</div>
	    	<div class="form">
	    		<div class="cell"><label class="label">所在地区</label></div>
	            <div class="cell-input">
	                 <input type="text" id="select-area" readonly onfocus="this.blur()" placeholder="请选择地区" @click="changeLoading" v-model="region">
	            </div>
	    	</div>
	    	<div class="form">
	            <div class="cell-input">
	                 <input type="text" id="address" placeholder="请填写详细地址" v-model="address">
	            </div>
	    	</div>
	    	<button id="btn-sub" @click="subData">立即提交，免费送货上门</button>
	    	<div id="tip">每个帐号每个国家只能领取一张卡</div>
	    	<!--弹出层-->
	    	<van-popup v-model="areaShow" position="bottom" :overlay="true">
	    	     <van-area :area-list="areaList" v-if="areaShow" @confirm="onConfirm" @cancel="onCancel"/>
	    	</van-popup>
	    	<div class="js_dialog" id="iosDialog2" v-if="dialogShow">
		        <div class="weui-mask"></div>
		        <div class="weui-dialog">
		            <div class="weui-dialog__bd" id="tip-info" v-text="tip"></div>
		            <div class="weui-dialog__ft">
		                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" id="know" @click="changeDialogShow">知道了</a>
		            </div>
		        </div>
    		</div>
	    </div>
   </div>
</template>

<script>
	import axios from 'axios';
	import areaList from './area';
    const querystring = require('querystring');
	export default {
	  name: 'index',
	  data(){
	  	 return{
	  	 	type:null,
	  	 	countryId:null,
	  	 	reg:/^[1][3,4,5,7,8,9][0-9]{9}$/,
	  	 	title:'获取验证码',
	  	 	timer:null,
	  	 	count:60,
	  	 	btnClick:false,
	  	 	username:'',
	  	 	phone:'',
	  	 	captcha:'',
	  	 	address:'',
	  	 	sendAddress:'',
	  	 	loading:false,
	  	 	region:'',
	  	 	areaShow:false,
	  	 	areaList:areaList,
	  	 	dialogShow:false,
	  	 	tip:''
	  	 }
	  },
	  beforeMount(){
	  	 document.body.style.height = document.body.clientHeight+"px"
	  },
	  methods:{
	  	 changeDialogShow(){
	  	 	this.dialogShow = false;
	  	 },
	  	 getCaptcha(){
	  	 	var that = this;
	  	 	if(!this.reg.test(this.phone)){
	  	 		this.tip = "手机号格式不正确";
	  	 		this.dialogShow = true;
	  	 	}else{
	  	       axios({
				  method: 'post',
				  url: '../center/captcha',
				  data: querystring.stringify({
					   phone:'86'+that.phone
			      })
			   })
			   .then(function(res){
			        if(res.data.success){
			        	that.down();
			        }else{
			        	that.tip = r.data.desc;
	  	 		        that.dialogShow = true;
			        }
			    })
	  	 	}
	  	 },
	  	 down(){
	    	var that = this;
	    	this.timer = setInterval(function(){
	    		that.btnClick = true;
	 	 	    that.count--;
	 	 	    that.title = '已发送'+that.count+'s';
	  		   	if(that.count==0){
	  		   		  that.btnClick = false;
	  		   		  clearInterval(that.timer);
	  		   		  that.count = 60;
	  		   		  that.title = '重新获取';
	  		   	}
			},1000);
  	     },
	  	 changeLoading(){
	  	 	this.areaShow = true
	  	 },
		 onCancel(){
		   	this.areaShow = false;
		 },
		 onConfirm(val){
	   	   this.areaShow = false;
	   	   this.region = val[0].name + val[1].name + val[2].name
		 },
		 subData(){
		 	this.type = sessionStorage.getItem("type");
			if(this.type){
			   this.type = Number(this.type);
			}else{
			   this.type = null;
			}
		 	if(!(this.username&&this.phone&&this.captcha&&this.region&&this.address)){
		 		this.tip = "请全部填写后再提交";
	  	 		this.dialogShow = true;
		 	}else{
		 		  this.countryId = sessionStorage.getItem("countryId");
		 		  var that = this;
		 		  this.loading = true;
			 	  axios({
					  method: 'post',
					  url: '../center/cardOrder',
					  data: querystring.stringify({
						  	agentId:that.type,
							countryId:that.countryId,
							orderSource:2,
							orderName:that.username,
							orderPhone:"86"+that.phone,
							captcha:that.captcha,
							orderAddress:that.region+that.address
				      })
				   })
				   .then(
//				   	   function(res){
//					   	    that.loading = false;
//					        if(res.data.success){
//					           
//					        }else{
//					        	that.tip = r.data.desc;
//			  	 		        that.dialogShow = true;
//					        }
//				        }
                        res=>{
                        	console.log(this);
                            that.loading = false;
					        if(res.data.success){
					           
					        }else{
					        	that.tip = res.data.desc;
			  	 		        that.dialogShow = true;
					        }
                        }
				   )
		 	}
		 	
		 }
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
#title{
	height:.25rem;
	padding-top:.1rem;
	padding-left:.28rem;
	font-size:.14rem;
	color:#fff;
}
#write-title{
	line-height:.41rem;
    padding-left:.28rem;
	font-size:.15rem;
	color:#fff;
}
.form{
	padding:.1rem .28rem;
	padding-right:.15rem;
	margin-top:.05rem;
	line-height:.25rem;
	background:#fff;
	font-size:.15rem;
	display:flex;
	flex-direction: row;
	opacity:0.9;
}
.label{
	display:block;
    width:1.05rem;
}
.cell-input{
	flex:1;
}
.cell-input>input{
	width:100%;
	line-height:.27rem;
	font-size:.15rem;
}
.code-form{
	display:flex;
}
#get-code{
	display:block;
	width:1.2rem;
	margin-top:.05rem;
	opacity:0.9;
	border:none;
	border-left:1px solid #333;
	background-color:#fff;
    text-align:center;
    font-size:.14rem;
}
#write-address{
	line-height:.33rem;
    color:#fff;
    padding-left:.28rem;
    font-size:.15rem;
}
#btn-sub{
	display:block;
	width:3.24rem;
	text-align:center;
	line-height:.45rem;
	margin:0 auto;
	margin-top:.82rem;
	border:none;
	border-radius:.08rem;
	font-size:.16rem;
	color:#fff;
	background:#ca1d7b;
	font-family:"微软雅黑";
}
#tip{
	text-align:center;
	line-height:.4rem;
	font-size:.13rem;
	color:#fff;
}
#know{
   color:#353535;
   font-size:0.15rem;
}

.area_roll>div{
	height:12em!important;
}

</style>
