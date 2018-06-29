<template>
	<div class="recharge-container">
		<!--<img src="../assets/recharge.jpg" alt="" />-->
		<div class="recharge">
		     <el-form :model="ruleForm"  :inline="true" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-bind:style="{paddingTop:height+'px'}">
		      		<p class="title">请填写国外号码</p>
		      		</el-form-item label="">
		      		   <el-select v-model="value" placeholder="请选择" disabled>
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
  					    </el-select>
  					</el-form-item>
				  	<el-form-item label="" prop="phone">
				    	<el-input v-model="ruleForm.phone" placeholder="请输入国外号码"></el-input>
				  	</el-form-item>
				  	<p class="title" v-if="packageShow">选择充值金额</p>
			  	    <el-form-item  v-if="packageShow">
			  			<ul class="productlist">
						    <li v-for="(item,index) in productItems" @click="countMoney(index,item.productPrice,item.productId)" v-bind:class="{active:tactive===index}">{{item.productName}}</li>
			  			</ul>
			  			<p v-if="priceShow">总计：{{foreignPrice}}=<strong>{{rmbPrice}}CNY</strong></p>
  					</el-form-item>
		  			<div>		  				
			  			<el-form-item v-bind:style="{marginTop:top+'px'}">
						    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loadingFlag" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">{{subTitle}}</el-button>
						    <el-button type="primary" @click="go">返回</el-button>
			  			</el-form-item>
		  			</div>
			</el-form>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Pay',
  data () {
  	      var reg = /^0?7[0-9]{9}$/
	      var checkPhone = (rule, value, callback) =>{
		        if(value === '') {
		          return callback(new Error('请输入手机号'));
		        }
		        if(!reg.test(value)){
		        	callback(new Error('手机号格式不正确'));
		        	this.studentId = null;
	                this.currencySymbol = null;
	                this.exchangeRate = null;
	                this.productItems = null;
	                this.tactive = null;
	                this.productId = null;
	                this.packageShow = false;
	                this.priceShow = false;
	                this.height = 210;
	                this.top = 0;
		        }else{
		        	this.getProductListByPhone(callback)
		        }
	      };
		  return {
		  	   top:20,
		  	   canpay:true,
		  	   height:210,
		  	   packageShow:false,
		  	   priceShow:false,
		  	   studentId:null,
		  	   currencySymbol:null,
		  	   exchangeRate:null,
		  	   productItems:null,
		  	   productId:null,
		  	   tactive:null,
		  	   foreignPrice:null,
		  	   rmbPrice:null,
		       subTitle:'提交',
		       loadingFlag:false,
		       options: [{
		          value:'44',
		          label: '英国(+44)'
		        }, {
		          value:'07',
		          label: '俄罗斯(+07)'
		        }, {
		          value: '选项3',
		          label: '蚵仔煎'
		        }, {
		          value: '选项4',
		          label: '龙须面'
		        }, {
		          value: '选项5',
		          label: '北京烤鸭'
		       }],
		       value: '44',
		       ruleForm: {
			       phone:''
			   },
			   rules: {
			      phone:[
			        { validator: checkPhone, trigger: 'blur' }
			      ]
			   }
		   }
	},
  methods:{
  	     getProductListByPhone(rcallback){
  	     	if(this.ruleForm.phone.indexOf("0")==0){
  	     		this.ruleForm.phone = this.ruleForm.phone.replace("0","");
  	     	}
  	     	var that = this;
  	     	axios({
				  method: 'post',
				  url:'../center/getPackageByPhone',
				  data:querystring.stringify({
				  	phoneNo:that.value + that.ruleForm.phone
				  })
			  })
	      	  .then(function(r){
//	      	  	 console.log(r);
	      	  	 if(r.data.success){
	                rcallback();
	                that.studentId = r.data.data.studentId;
	                that.currencySymbol = r.data.data.currencySymbol;
	                that.exchangeRate = r.data.data.exchangeRate;
	                that.productItems = r.data.data.productList;
	                that.packageShow = true;
	                that.height = 150;
	                that.top = 0;
	      	  	 }else{
	      	  	 	rcallback(new Error(r.data.desc));
	      	  	 	that.studentId = null;
	                that.currencySymbol = null;
	                that.exchangeRate = null;
	                that.productItems = null;
	                that.tactive = null;
	                that.productId = null;
	                that.packageShow = false;
	                that.priceShow = false;
	                that.height = 210;
	                that.top = 20;
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
	      subOrder(){
	      		this.loadingFlag = true;
	      		var that = this;
	  	     	axios({
					  method: 'post',
					  url:'../center/rechargeOrder',
					  data:querystring.stringify({
					  	 studentId:that.studentId,
					  	 phoneNo:that.value + that.ruleForm.phone,
					  	 productId:that.productId,
					  	 orderSource:1
					  })
				  })
		      	  .then(function(r){
//		      	  	 console.log(r);
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
	      },
	      go(){
	         this.$router.go(-1);
	      }
  }
}
</script>

<style scoped>
	.recharge-container{
		width:100%;
	}
	img{
		display:block;
		width:100%;
	}
	.recharge{
		width:1190px;
		height:614px;
		margin:0 auto;
	}
	form{
		padding-top:150px;
		padding-left:370px;
		padding-right:155px;
	}
	.el-select{
		width:150px;
	}
	.el-input{
		width:300px;
		margin-right:200px;
	}
	.title{
		margin-bottom:40px;
		font-size:14px;
		color:#000;
		font-weight:bold;
	}
	.productlist{
		width:460px;
	}
	.productlist>li{
		width:129px;
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
	.productlist>li:hover{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
	.productlist>li.active{
		color: #CA1D7B;
	    border-color: rgb(239, 187, 215);
	    background-color: rgb(250, 232, 242);
	}
</style>