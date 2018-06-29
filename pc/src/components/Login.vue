<template>
	<div class="login-container">
		<div class="login">
		   <el-form :model="ruleForm" status-icon :rules="rules" :inline="true" ref="ruleForm" label-width="50px" class="demo-ruleForm">
		   	    <div class="img-wrapper"><img src="../assets/logo.jpg" alt="" /></div>
			    <el-form-item label="">
	      		   <el-select v-model="value" placeholder="请选择" v-bind:style="{width:'120px'}">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
				    </el-select>
	  			</el-form-item>
			  	<el-form-item  label="" prop="phone">
			    	<el-input v-model="ruleForm.phone" placeholder="请输入国内手机号" v-bind:style="{width:'280px'}"></el-input>
			  	</el-form-item>
		        <el-form-item  label="" prop="securitycode">
			    	<el-input v-model.number="ruleForm.securitycode" placeholder="请输入验证码" ></el-input>
			    	<el-button type="primary" @click="getCaptcha" :disabled="btnFlag">{{title}}</el-button>
		  		</el-form-item>
		  		<el-form-item>
				<el-button type="primary"  v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命登录中"
	    element-loading-spinner="el-icon-loading"
	    element-loading-background="rgba(0, 0, 0, 0.8)" v-bind:style="{width:'415px',marginTop:'68px'}" @click="submitForm('ruleForm')">登录</el-button>
	            </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Login',
  data () {
  	 
  	 var checkPhone = (rule, value, callback) =>{
	    if(value === '') {
	      this.phoneFlag = false;
	      return callback(new Error('请输入手机号'));
	    }
	    if(this.value=='86'){
	    	var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	    }else{
	    	var reg = /^0?7[0-9]{9}$/;
	    }
	    if(!reg.test(value)){
	    	this.phoneFlag = false;
	    	callback(new Error('手机号格式不正确'));
	    }else{
	    	this.phoneFlag = true;
	    	if(this.ruleForm.phone.indexOf("0")==0){
  	     	  this.ruleForm.phone = this.ruleForm.phone.replace("0","");
  	        }
	        callback()
	    }
	};
	var checkSecuritycode = (rule, value, callback) => {
	        if (!value) {
	          return callback(new Error('请输入验证码'));
	        }
	        if (!Number.isInteger(value)) {
	            callback(new Error('请输入数字值'));
	        } else {
	            callback();
	        }
	};
    return {
    	 title:'获取验证码',
    	 phoneFlag:false,
    	 btnFlag:false,
    	 timer:null,
	     count:60,
    	 loadingFlag:false,
    	 options:[
    	     {
		      	value:'86',
		      	label: '中国(+86)'
		     }, 
		     {
		        value:'44',
		        label: '英国(+44)'
		     }
    	 ],
		  value: '86',
		  ruleForm: {phone:'',securitycode:''},
		  rules: {
		      phone:[
			     { validator: checkPhone, trigger: 'blur' }
			  ],
			  securitycode: [
	             { validator: checkSecuritycode, trigger: 'blur'}
	          ] 
		  }
    }
  },
  beforeMount(){
  	 
  },
  methods:{
  	  getCaptcha(){
  		     this.$refs.ruleForm.validateField('phone');
  		     if(this.phoneFlag){
  		     	 var that = this;
	  		     axios({
					  method: 'post',
					  url:'../center/captcha',
					  data:querystring.stringify({
					      phone:that.value+that.ruleForm.phone
					  })
			      })
			  	  .then(function(r){
//			  	  	   console.log(r)
			  		   if(r.data.success){
						 	 that.down();
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
		         
  		    }
		 
  		},
  	down(){
    	var that = this;
    	this.timer = setInterval(function(){
	 	 	    that.btnFlag = true;
	 	 	    that.count--;
	 	 	    that.title = "已发送"+that.count+"s";
	  		   	if(that.count==0){
	  		   		  clearInterval(that.timer);
	  		   		  that.count = 60;
	  		   		  that.btnFlag = false;
	  		   		  that.title = "重新获取";
	  		   	}
		},1000);
  	 },
  	 submitForm(formName) {
  	 	    var that = this;
	        this.$refs[formName].validate((valid) => {
		          if (valid) {
                     this.subData();
		          } else {
		          	 console.log('error submit!!');
		             return false;
		          }
	        });
	 },
	 subData(){
	 	  this.loadingFlag = true;
	 	  var that = this;
          axios({
			  method: 'post',
			  url:'../center/login',
			  data:querystring.stringify({
			      phone:that.value+that.ruleForm.phone,
			      captcha:that.ruleForm.securitycode
			  })
	      })
	  	  .then(function(r){
	  	  	   that.loadingFlag = false;
	  		   if(r.data.success){
				  sessionStorage.setItem('student',JSON.stringify(r.data.data.student));
				  eventBus.$emit('login',{loginshow:true,loginname:that.ruleForm.phone});
				  that.$router.push({ name: 'User'});
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
	 }
  }
}
</script>

<style scoped>
	.login-container{
		width:100%;
		background: url(../assets/login.jpg);
	}
	.login{
		display: flex;
		width:1190px;
		height:605px;
		margin:0 auto;
	}
	.img-wrapper{
		width:410px;
		margin-bottom:60px;
		text-align:center;
	}
	.el-form{
		width:470px;
		height:470px;
		margin-top:35px;
		margin-left:700px;
		padding-top:70px;
		padding-left:38px;
		background:#fff;
		border-radius:20px;
	}
	.el-input{
		width:300px;
	}
</style>