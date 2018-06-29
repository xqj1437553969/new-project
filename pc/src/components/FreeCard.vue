<template>
   <div class="free-container">
      <div class="free">
      	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      		<el-form-item label="已选择">
		    	<el-tag>英国giffgaff卡</el-tag>
		  	</el-form-item>
		  	<el-form-item label="姓名" prop="username">
		    	<el-input v-model="ruleForm.username" placeholder="请输入姓名"></el-input>
		  	</el-form-item>
		  	<el-form-item label="手机号" prop="phone">
		    	<el-input v-model="ruleForm.phone" placeholder="请输入国内手机号"></el-input>
		  	</el-form-item>
		  	<el-form-item label="验证码" prop="securitycode">
		    	<el-input v-model.number="ruleForm.securitycode" placeholder="请输入验证码"></el-input>
		    	<el-button type="primary" @click="getCaptcha" :disabled="btnFlag">{{title}}</el-button>
		  	</el-form-item>
		  	<el-form-item  label="所在地区" prop="region" >
				<el-cascader @change="handleChange"
					placeholder="请选择所在地区（可以搜索）"
					v-model="ruleForm.region"
					:options="options"
					change-on-select
					clearable
					filterable
				>
				</el-cascader>
		    </el-form-item>
		  	<el-form-item label="详细地址" prop="address">
    			<el-input v-model="ruleForm.address" placeholder="请输入详细地址"></el-input>
  			</el-form-item>
  			<el-form-item>
			    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">{{subTitle}}</el-button>
			    <el-button type="primary" @click="go">返回</el-button>
  			</el-form-item>
		</el-form>
		<p>每个国家每个账号只能领取一张卡</p>
      </div>
   </div>
</template>

<script>
import { regionData,CodeToText} from 'element-china-area-data';
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Free',
  data () {
  	     var checkUsername = (rule, value, callback) => {
	        if (value === '') {
	          callback(new Error('请输入姓名'));
	        } else {
	          callback();
	        }
	      };
	      var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	      var checkPhone = (rule, value, callback) => {
	        if (value === '') {
	          this.phoneFlag = false;
	          return callback(new Error('请输入手机号'));
	        }
	        if (!reg.test(value)) {
	        	  this.phoneFlag = false;
		          callback(new Error('手机号格式不正确'));
		    } else {
		          this.phoneFlag = true;
		          callback();
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
	      var checkRegion = (rule, value, callback) => {
	        if (value =='') {
	          callback(new Error('请选择地址'));
	        } else {
	          callback();
	        }
	      };
	      var checkAddress= (rule, value, callback) => {
	        if (value === '') {
	          callback(new Error('请输入详细地址'));
	        } else {
	          callback();
	        }
	     };
	    return {
	    	options: regionData,
	    	realregion:'',
	    	countryId:null,
	    	btnFlag:false,
	    	title:'获取验证码',
	    	timer:null,
	    	count:60,
	    	phoneFlag:false,
	    	subTitle:"提交",
	    	loadingFlag:false,
	    	ruleForm: {
	          username: '',
	          phone:'',
	          securitycode: '',
	          region:[],
	          address:''
	        },
	        rules: {
	          username: [
	            { validator: checkUsername, trigger: 'blur' }
	          ],
	          phone:[
	            { validator: checkPhone, trigger: 'blur' }
	          ],
	          securitycode: [
	            { validator: checkSecuritycode, trigger: 'blur' }
	          ],
	          region: [
	        	 {validator: checkRegion, trigger: 'change' }
	      	  ],
	          address: [
	            { validator: checkAddress, trigger: 'blur' }
	          ],
	        }
	    }
  },
   methods: {
   	      handleChange(value){
// 	      	 console.log(value);
   	      	 this.realregion = CodeToText[this.ruleForm.region[0]]+''+CodeToText[this.ruleForm.region[1]]+''+CodeToText[this.ruleForm.region[2]]
   	      },
	      submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
		          if (valid) {
                     this.subData();
		          } else {
		          	 console.log('error submit!!');
		             return false;
		          }
	        });
	      },
	      go(){
	        this.$router.go(-1);
	      },
	      subData(){
	      	  var agentId = sessionStorage.getItem("type");
	      	  if(agentId){
	      	  	 agentId = Number(agentId);
	      	  }else{
	      	  	 agentId = null;
	      	  }
	      	  var countryId = sessionStorage.getItem("countryId");
	      	  var orderName = this.ruleForm.username;
	      	  var orderPhone = '86'+this.ruleForm.phone;
	      	  var captcha = this.ruleForm.securitycode;
	      	  var orderAddress = this.realregion + this.ruleForm.address;
	      	  this.loadingFlag = true;
//	      	  this.subTitle = "提交中";
	      	  var that = this;
	      	  setTimeout(function(){
	      	  	    axios({
				  method: 'post',
				  url:'../center/cardOrder',
				  data:querystring.stringify({
				  	 agentId:agentId,
				     countryId:countryId,
				     orderSource:1,
				     orderName:orderName,
				     orderPhone:orderPhone,
				     captcha:captcha,
				     orderAddress:orderAddress
				  })
			  })
		  	  .then(function(r) {
//		  		   console.log(r);
		  		   that.loadingFlag = false;
//		  		   that.subTitle = "提交";
		  		   if(r.data.success){
		  		   	  that.$router.push({ name: 'CardSuccess'});
		  		   }else{
//		  		   	  that.$router.push({ name: 'CardSuccess'});
			  		  var message = r.data.desc;
//			  		  console.log(that.$message);
	                  that.$message({
				          message:message,
				          type: 'warning',
				          duration:1500,
				          center:true
	        		  });
		  		   }
			  })
		  	  .catch(function (error) {
		  	  	   that.loadingFlag = false;
		  		   that.subTitle = "提交";
	               that.$message({
			          message:"请求失败",
			          type: 'error',
			          duration:1500,
			          center:true
	               });
	  		  });
	      	  },3000)
		  	 
  		 },
  		 getCaptcha(){
//		 	 console.log(this);
  		     this.$refs.ruleForm.validateField('phone');
  		     if(this.phoneFlag){
  		     	 var phone = '86'+this.ruleForm.phone;
  		     	 var that = this;
	  		     axios({
					  method: 'post',
					  url:'../center/captcha',
					  data:querystring.stringify({
					      phone:phone
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
//		 	 	    console.log(that);
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
  	    }
    }
}
</script>

<style scoped>
	.free-container{
	    width:100%;
	}
	.free{
		width:1190px;
		height:614px;
		margin:0 auto;
	}
	form{
		padding-top:72px;
		padding-left:327px;
		padding-right:155px;
	}
	.el-input{
		width:400px;
	}
	.el-cascader{
		width:400px;
	}
	p{
		padding-left:427px;
		font-size:14px;
	}
</style>