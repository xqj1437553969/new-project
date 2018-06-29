<template>
   <div class="business-container">
      <div class="business" v-bind:style="{height:height+'px'}">
      	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      		<p class="title">资料填写</p>
      		<!--<el-form-item label="资料填写"></el-form-item>-->
		  	<el-form-item label="激活码" prop="activatecode">
		    	<el-input v-model="ruleForm.activatecode" placeholder="请输入卡片上6位Activation Code"></el-input>
		  	</el-form-item>
		  	<el-form-item label="手机号" prop="phone">
		    	<el-input v-model="ruleForm.phone" placeholder="请输入国内手机号"></el-input>
		  	</el-form-item>
		  	<el-form-item label="验证码" prop="securitycode" v-if="codeShow">
		    	<el-input v-model.number="ruleForm.securitycode" placeholder="请输入验证码"></el-input>
		    	<el-button type="primary" @click="getCaptcha" :disabled="btnFlag">{{title}}</el-button>
		  	</el-form-item>
		  	<el-form-item label="激活日期" prop="date1">
			    	 <el-date-picker v-model="ruleForm.date1"
				      type="date"
				      :disabled="dateTrue"
				      :placeholder="datePlaceholder"
				      :default-value = "defaultDate"
				      format="yyyy 年 MM 月 dd 日"
				      value-format="yyyy-MM-dd"
				      :picker-options="pickerOptions1"
			      	>
    		 		</el-date-picker>
		  	</el-form-item>
		  	<p class="title" v-if="packageShow">选择套餐</p>
		  	<!--<el-form-item label="选择套餐"></el-form-item>-->
		  	<el-form-item  v-if="packageShow">
		        <ul class="packagelist">
				    <li v-for="(item,index) in items" @click="changePackage(index,item.packageDesc,item.packageId)" v-bind:class="{active:pactive===index}">{{item.packageName | packagenamefilter}}</li>
	  			</ul>
  			 </el-form-item>
  			 <p class="title" v-if="packageShow">套餐详情</p>
  			 <!--<el-form-item label="套餐详情"></el-form-item>-->
  			 <el-form-item  v-if="packageShow">
	  			<div class="detail">{{packageDesc | descfilter}}</div>
	  	    </el-form-item>
	  	    <p class="title tit"  v-if="packageShow">选择充值金额</p>
	  	    <!--<el-form-item label="选择充值金额"></el-form-item>-->
	  	    <el-form-item  v-if="packageShow">
	  			<ul class="rechargelist">
				    <li v-for="(item,index) in productItems" @click="countMoney(index,item.productPrice,item.productId)" v-bind:class="{active:tactive===index}">{{item.productName}}</li>
	  			</ul>
	  			<p v-if="priceShow">总计：{{foreignPrice}}=<strong>{{rmbPrice}}CNY</strong></p>
  			</el-form-item>
  			<el-form-item>
			    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">{{subTitle}}</el-button>
			    <el-button type="primary" @click="go">返回</el-button>
  			</el-form-item>
		</el-form>
      </div>
   </div>
</template>

<script>

import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Free',
  data () {
  	     var regc = /^[0-9A-Z]{6}$/;
  	     var checkActivatecode = (rule, value, callback) => {
	        if (value === '') {
	        	this.clear();
                return callback(new Error('请输入激活码'));
	        }
	        if(!regc.test(value)){
	        	this.clear();
	        	callback(new Error('激活码格式不正确'));
	        
	        }else{	        	
	        	this.checkCardNo(callback);
	        }  	
	      };
	      var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	      var checkPhone = (rule, value, callback) =>{
	        if (value === '') {
	          this.phoneFlag = false;
	          return callback(new Error('请输入手机号'));
	        }
	        if (!reg.test(value)) {
	        	  this.phoneFlag = false;
		          callback(new Error('手机号格式不正确'));
		    } else {
		          this.phoneFlag = true;
		          this.checkPhone();
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
	      var checkDvalue = (rule, value, callback) => {
	        if (!value) {
	          callback(new Error('请选择激活日期'));
	        } else {
//	          console.log(value);
//	          console.log(this.ruleForm.date1)
	          callback();
	        }
	      };
	    return {
	    	msg:null,
	    	height:614,
	    	uk:null,
	    	activateDateEarliest:null,
			activateDatePrompt:null,
			datePlaceholder:'请选择激活日期',
	    	cardId:null,
	    	countryId:null,
	    	items:null,
	    	btnFlag:false,
	    	codeShow:false,
	    	dateTrue:true,
	    	packageShow:false,
	    	pactive:0,
	    	tactive:null,
	    	packageDesc:null,
	    	packageId:null,
	    	productItems:null,
	    	exchangeRate:null,
	    	currencySymbol:null,
	    	foreignPrice:null,
	    	rmbPrice:null,
	    	productId:null,
	    	priceShow:false,
	    	defaultDate:'2017-8-15',
	    	pickerOptions1:{
		      	disabledDate:(time)=>{
	              return time.getTime() < new Date(this.defaultDate).getTime()-8*60*60000;
	            }
	        },
	    	title:'获取验证码',
	    	timer:null,
	    	count:60,
	    	subTitle:'提交',
	    	loadingFlag:false,
	    	ruleForm: {
	          activatecode:'',
	          phone:'',
	          securitycode:'',
	          date1:''
	        },
	        rules: {
	          activatecode: [
	            { validator: checkActivatecode, trigger: 'blur' }
	          ],
	          phone:[
	            { validator: checkPhone, trigger: 'blur' }
	          ],
	          securitycode: [
	            { validator: checkSecuritycode, trigger: 'blur' }
	          ],
	          date1: [
	            { validator: checkDvalue, trigger: 'change' }
	          ]
	        }
	    }
  },
  beforeMount:function(){
  	this.getPackage();
  },
   methods: {
   	      getPackage(){
	      	 var that = this;
	      	 axios({
				  method: 'post',
				  url:'../center/buyPackage',
				  data:querystring.stringify({
				  	orderSource:1
				  })
			  })
	      	  .then(function(r){
//	      	  	 console.log(r);
	      	  	 if(r.data.success){
	      	        var countryList = r.data.data.country;
				    for(var j=0;j<countryList.length;j++){
				    	if(countryList[j].countryName=='英国'){
				    		that.uk = countryList[j];
				    		that.activateDateEarliest = countryList[j].activateDateEarliest;
				    		that.activateDatePrompt ='请选择激活日期（'+countryList[j].activateDatePrompt+'）';
				    	}
				    }  
	      	  	 }
	      	  })
	      	  .catch(function (error) {
	               that.$message({
			          message:'请求失败',
			          type: 'error',
			          duration:1500,
			          center:true
	               });
	  		  });
	      },
	     submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
		          if (valid) {
                     if(!this.productId){
                     	this.$message({
				          message:'请选择充值金额',
				          type: 'warning',
				          duration:1500,
				          center:true
	               		});
                     }else{
                     	this.subOrder();                     	
                     }
		          } else {
		          	 console.log('error submit!!');
		             return false;
		          }
	        });
	      },
	      changePackage(_index,_packageDesc,_packageId){
	      	 if(this.pactive==_index){
	      	 	return false;
	      	 }
	      	 this.productId = null;
  	    	 this.priceShow = false;
  	    	 this.tactive = null;
	      	 this.pactive=_index;
	      	 this.packageDesc = _packageDesc;
	      	 this.packageId = _packageId;
	      	 this.getProductList();
//	      	 console.log(this.pactive,this.packageDesc,this.packageId)
	      },
	      go(){
	         this.$router.go(-1);
	      },
	      checkCardNo(rcallback){
	      	  var scallback = rcallback;
	      	  var cardNo = this.ruleForm.activatecode;
	      	  var that = this;
	      	  axios({
				  method: 'post',
				  url:'../center/checkCardNo',
				  data:querystring.stringify({
				  	 cardNo:cardNo
				  })
			  })
	      	  .then(function(r){
//	      	  	 console.log(r);
	      	  	 if(r.data.success){
//	      	  	 	console.log(scallback)
	      	  	 	scallback();
//	      	  	 	console.log(r);
	      	  	 	that.cardId = r.data.data.cardId;
	      	  	 	that.countryId = r.data.data.countryId;
	      	  	 	that.items = r.data.data.packagelist;
	      	  	 	that.packageDesc = that.items[0].packageDesc;
	      	  	 	that.packageId = that.items[0].packageId;
	      	  	 	that.getProductList();
	      	  	    that.datePlaceholder =  that.activateDatePrompt;
//	      	  	 	console.log(that);
	      	  	 	that.defaultDate = getServerDate(that.activateDateEarliest);
//	                console.log(that.defaultDate)
	      	  	 	that.dateTrue = false;
	      	  	 	that.packageShow = true;
	      	  	 	that.height = 1000;
	      	  	 }else{
	      	  	    scallback(new Error(r.data.desc));
	      	  	    that.clear();
	      	  	 }
	      	  })
	      	  .catch(function (error) {
	               that.$message({
			          message:'请求失败',
			          type: 'error',
			          duration:1500,
			          center:true
	               });
	  		  });
	      },
	       checkPhone(){
	      	  var that = this;
	      	  axios({
				  method: 'post',
				  url:'../center/checkPhone',
				  data:querystring.stringify({
				  	 phone:'86'+ that.ruleForm.phone
				  })
			  })
	      	  .then(function(r){
	      	  	 if(r.data.success){
	      	  	 	that.codeShow = false;
//	      	  	 	console.log(that.cardShow)
	      	  	 }else{
	      	  	    that.codeShow = true;
//	      	  	    console.log(that.cardShow)
	      	  	 }
	      	  })
	      	  .catch(function (error) {
	               that.$message({
			          message:'请求失败',
			          type: 'error',
			          duration:1500,
			          center:true
	               });
	  		  });
	      },
  		 getCaptcha(){
//		 	 console.log(this);
  		     this.$refs.ruleForm.validateField('phone');
  		     if(this.phoneFlag){
  		     	 var that = this;
	  		     axios({
					  method: 'post',
					  url:'../center/captcha',
					  data:querystring.stringify({
					      phone:'86'+that.ruleForm.phone
					  })
			      })
			  	  .then(function(r){
			  	  	   console.log(r)
			  		   if(r.data.success){
//						 	 console.log(that);
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
				          message:'请求失败',
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
		 	 	    that.title = '已发送'+that.count+'s';
		  		   	if(that.count==0){
		  		   		  clearInterval(that.timer);
		  		   		  that.count = 60;
		  		   		  that.btnFlag = false;
		  		   		  that.title = '重新获取';
		  		   	}
			},1000);
  	    },
  	    getProductList(){
  	    	    var that = this;
  	    	    axios({
					  method: 'post',
					  url:'../center/packageInfo',
					  data:querystring.stringify({
					      packageId:that.packageId
					  })
			      })
			  	  .then(function(r){
//			  	  	   console.log(r)
			  		   if(r.data.success){
						 	that.productItems = r.data.data.productList;
						 	that.exchangeRate = r.data.data.exchangeRate;
						 	that.currencySymbol = r.data.data.currencySymbol;
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
				          message:'请求失败',
				          type: 'error',
				          duration:1500,
				          center:true
	                   });
		  		  });
  	    },
  	    countMoney(_index,_productPrice,_productId){
//	    	console.log(_productPrice,_productId);
  	    	this.tactive = _index;
  	    	this.foreignPrice = this.currencySymbol + _productPrice;
  	    	this.rmbPrice = (_productPrice*this.exchangeRate).toFixed(2);
  	    	this.priceShow = true;
  	    	this.productId = _productId;
  	    },
  	    clear(){
  	    	this.cardId = null;
  	    	this.countryId = null;
  	    	this.items = null;
    		this.packageDesc = null;
      	  	this.packageId = null;
      	  	this.datePlaceholder = '请选择激活日期';
      	  	this.ruleForm.date1 ='';
      	  	this.$refs.ruleForm.validateField('date1');
      	  	this.productId = null;
      	  	this.dateTrue = true;
      	  	this.pactive = 0;
      	  	this.tactive = null;
      	  	this.packageShow = false;
      	  	this.height = 614;
      	  	this.priceShow = false;
  	    },
  	    subOrder(){
  	    	 this.loadingFlag = true;
  	    	 if(this.codeShow){
  	    	 	this.msg = {
  	    	 		  packageId:this.packageId,
				      productId:this.productId,
				      cardId:this.cardId,
				      activateDate:this.ruleForm.date1,
				      phone:'86'+this.ruleForm.phone,
				      captcha:this.ruleForm.securitycode,
				      orderSource:1
  	    	 	}
  	    	 }else{
  	    	 	this.msg = {
  	    	 		  packageId:this.packageId,
				      productId:this.productId,
				      cardId:this.cardId,
				      activateDate:this.ruleForm.date1,
				      phone:'86'+this.ruleForm.phone,
				      orderSource:1
  	    	 	}
  	    	 }
  	    	 var that = this;
    	     axios({
				  method: 'post',
				  url:'../center/placeOrder',
				  data:querystring.stringify(that.msg)
		      })
		  	  .then(function(r){
//		  	  	   console.log(r)
		  		   if(r.data.success){
		  		   	    const div = document.createElement('div');
				        div.innerHTML = r.data.desc;
				        document.body.insertBefore(div,document.body.children[0]);				        		        	
				        document.forms[0].submit();
		  		   }else{
		  		   	   that.$message({
				          message:r.data.desc,
				          type: 'warning',
				          duration:1500,
				          center:true
                   	   });
                   	   that.loadingFlag = false;
		  		   }
			  })
		  	  .catch(function (error) {
	               that.$message({
			          message:'请求失败',
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
	.business-container{
	    width:100%;
	}
	.business{
		width:1190px;
		height:614px;
		margin:0 auto;
	}
	form{
		padding-top:150px;
		padding-left:346px;
		padding-right:155px;
	}
	.el-input{
		width:400px;
	}
	.title{
		padding-left:32px;
		margin-bottom:20px;
		font-size:14px;
		color:#000;
		font-weight:bold;
	}
	.tit{
		padding-left:9px;
	}
	.packagelist,.rechargelist{
		width:460px;
	}
	.packagelist>li,.rechargelist>li,.detail{
		margin-right:10px;
		margin-bottom:20px;
		display: inline-block;
	    line-height: 1;
	    white-space: nowrap;
	    cursor: pointer;
	    background: #fff;
	    border: 1px solid #dcdfe6;
	    color: #606266;
	    -webkit-appearance: none;
	    text-align: center;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    outline: 0;
	    -webkit-transition: .1s;
	    transition: .1s;
	    padding: 12px 20px;
	    font-size: 14px;
	    border-radius: 4px;
	}
	.rechargelist>li{
		width:129px;
	}
	.packagelist>li:hover,.rechargelist>li:hover{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.detail{
		width:340px;
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.packagelist>li.active,.rechargelist>li.active{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
</style>