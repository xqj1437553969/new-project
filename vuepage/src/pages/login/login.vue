<template>
   <div id="header">
   	    <div id="loadingToast" v-if="loading">
	        <div class="weui-mask_transparent"></div>
	        <div class="weui-toast">
	            <i class="weui-loading weui-icon_toast"></i>
	            <p class="weui-toast__content">登录中</p>
	        </div>
        </div>
   		<div class="container">
       		<div class="form-wrapper">
	       		<div class="form phone-form">
		    		<div class="cell"><label class="label" id="lable" @click="show=true"><span>{{country}}（+{{areaNum}}）</span><i id="xia"></i></label></div>
		            <div class="cell-input">
		                 <input type="number" id="phone" placeholder="请输入手机号" v-model="phone">
		            </div>
		    	</div>
		    	<div class="code-form">
			    	<div class="form">
			    		<div class="cell"><label class="label">验证码</label></div>
			            <div class="cell-input">
			                 <input type="number" id="captcha" placeholder="请输入验证码"  v-model="captcha">
			            </div>
			    	</div>
			    	<button id="get-code"  @click="getCaptcha" :disabled="btnClick" v-text="title">获取验证码</button>
		    	</div>
		    </div>
       		<button id="btn-login" @click="login">登录</button>
       		<van-popup v-model="show" position="bottom" :overlay="true">
       		    <van-picker :columns="columns" @change="onChange"  show-toolbar  @cancel="onCancel"
  @confirm="onConfirm" />
            </van-popup>
       		<!--弹出层-->
	    	<div class="js_dialog" id="iosDialog2" v-if="dialogShow">
		        <div class="weui-mask"></div>
		        <div class="weui-dialog">
		            <div class="weui-dialog__bd" id="tip-info" v-text="tip"></div>
		            <div class="weui-dialog__ft">
		                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" id="know" @click="know">知道了</a>
		            </div>
		        </div>
    		</div>
		</div>
   </div>
</template>

<script>
	const citys = {
	  '中国': ['86'],
      '英国': ['44']
    };
	import axios from 'axios';
    const querystring = require('querystring');
	export default {
	  name: 'selectcard',
	  data(){
	  	 return{
	  	 	student:null,
	  	 	openId:null,
	  	 	captcha:'',
	  	 	phone:'',
	  	 	tip:'',
	  	 	dialogShow:false,
	  	 	loading:false,
		    show:false,
		    country:'中国',
		    areaNum:'86',
		    columns: [
		        {
		          values: Object.keys(citys),
		          className: 'column1'
		        },
		        {
		          values: citys['中国'],
		          className: 'column2',
		          defaultIndex: 2
		        }
      		],
		 	reg:{
			    'cn':/^[1][3,4,5,7,8,9][0-9]{9}$/,
			    'gb':/^0?7[0-9]{9}$/
	        },
	        regtest:null,
	  	 	title:'获取验证码',
	  	 	timer:null,
	  	 	count:60,
	  	 	btnClick:false
	  	 }
	  },
	  methods:{
		 onConfirm(value, index) {
		   this.country = value[0];
		   this.areaNum = value[1];
		    this.show = false;
		 },
		 onCancel() {
		   this.show = false;
		 },
		 onChange(picker, values) {
		     picker.setColumnValues(1, citys[values[0]]);
		 },
		  getCaptcha(){
	  	 	var that = this;
	  	 	if(this.areaNum==86){
	  	 		this.regtest = this.reg.cn;
	  	 	}else{
	  	 		this.regtest = this.reg.gb;
	  	 	}
	  	 	if(!this.regtest.test(this.phone)){
	  	 		this.tip = "手机号格式不正确";
	  	 		this.dialogShow = true;
	  	 		return;
	  	 	}
  	 	   if(this.phone.indexOf("0")==0){
     	  	  this.phone = this.phone.replace("0","");
           }
  	       axios({
			  method: 'post',
			  url: '../center/captcha',
			  data: querystring.stringify({
				   phone:that.areaNum+that.phone
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
  	    login(){
  	    	var that = this;
  	    	if(this.areaNum==86){
	  	 		this.regtest = this.reg.cn;
	  	 	}else{
	  	 		this.regtest = this.reg.gb;
	  	 	}
	  	 	if(!this.regtest.test(this.phone)){
	  	 		this.tip = "手机号格式不正确";
	  	 		this.dialogShow = true;
	  	 		return;
	  	 	}
	        if(!this.captcha){
	        	this.tip = "请输入验证码";
	  	 		this.dialogShow = true;
	  	 		return;
	        }
	 		if(this.phone.indexOf("0")==0){
	 	  	   this.phone = this.phone.replace("0","");
	        }
	    	this.loading = true;
	    	axios({
				  method: 'post',
				  url: '../center/login',
				  data: querystring.stringify({
					   	openId:that.openId,
						phone:that.areaNum+that.phone,
						captcha:that.captcha
			      })
			   })
			   .then(function(res){
			   	    that.loading = false;
			        if(res.data.success){
			        	that.student = res.data.data.student;
			        	sessionStorage.setItem("student",JSON.stringify(that.student));
			        	window.location.href = "information.html";
			        }else{
			        	that.tip = res.data.desc;
	  	 		        that.dialogShow = true;
			        }
			    })

  	    },
  	    know(){
  	      this.dialogShow = false;
  	      if(this.tip.indexOf("未领")!=-1){
  	      	 window.location.href = "select-card.html";
  	      }
  	    }
	  },
	  beforeMount(){
	  	 this.openId = sessionStorage.getItem("openId")
	  	 document.body.style.height = document.body.clientHeight+"px"
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
	background:url(../../assets/login_back.jpg) no-repeat 0 0;
	background-size:100% 100%;
	font-size:.16rem;
}
.form-wrapper{
	padding-top:3rem;
}
.form{
	box-sizing:border-box;
	padding:.1rem .28rem;
	padding-right:.15rem;
	margin:0 atuo;
	margin-top:.05rem;
	line-height:.25rem;
	background:#fff;
	font-size:.15rem;
	display:flex;
    display:-webkit-flex;
	flex-direction: row;
	-webkit-flex-direction:row;
	opacity:0.9;
}

.label{
	display:block;
    width:1.05rem;
}
.cell-input{
	flex:1;
	-webkit-flex:1;
}
.cell-input>input{
	width:100%;
	line-height:.27rem;
	font-size:.15rem;
}
.phone-form{
	width:90%;
	margin-left:5%;
}
.code-form{
	width:90%;
	margin-left:5%;
	display:flex;
	display:-webkit-flex;
}
#lable{
	position:relative;
}
#xia{
	display:block;
	width:.09rem;
	height:.07rem;
	position:absolute;
	top:41%;
	right:15%;
	background:url(../../assets/xia_03.png) no-repeat 0 0;
	background-size:100%;
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
    font-family:"微软雅黑";
}
#btn-login{
	display:block;
	width:3.25rem;
	height:.45rem;
	border:none;
	outline:none;
	border-radius:.07rem;
	background:#ca1d7b;
	margin-top:.73rem;
	margin-left:.25rem;
	text-align:center;
	line-height:.45rem;
	font-size:.16rem;
	color:#fff;
	font-family:"微软雅黑";
}
#know{
   color:#353535;
   font-size:0.15rem;
}

</style>
