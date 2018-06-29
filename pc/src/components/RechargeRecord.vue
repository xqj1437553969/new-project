<template>
	<div class="recharge-record" v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
        <div v-if="logShow" class="check-login">
		 	登录之后才可以查看充值记录
		 	<el-button type="primary" @click="goLogin" v-bind:style="{marginLeft:'20px'}">登录</el-button>
		 </div>
		 <div v-else>		 	
		 	<div v-if="recordshow" class="empty">您的充值记录是空的！</div>
		 	<div class="list-wrapper" v-else>
		 		<ul v-for="(item,index) in records">
		 		   <li><span class="left">订单编号</span><span class="right">{{item.orderNo}}</span></li>
		 		   <li><span class="left">国家</span><span class="right">{{item.countryName}}</span></li>
		 		   <li><span class="left">充值号码</span><span class="right">{{item.phoneNo}}</span></li>
		 		   <li><span class="left">充值金额</span><span class="right">{{item.productName}}</span></li>
		 		   <li><span class="left">订单价格</span><span class="right">{{item.orderPirce}}CNY</span></li>
		 		   <li><span class="left">订单状态</span><span class="right">{{item.orderStatus=='充值失败'?'充值失败（请联系客服进行退款）':item.orderStatus}}</span></li>
		 		   <li><span class="left">提交时间（北京时间）</span><span class="right">{{item.createTime | formattotime}}</span></li>
		 		</ul>
		 	</div>
		 </div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring')
export default {
  name: 'RechargeRecord',
  data () {
    return {
       logShow:true,
       student:null,
       loading:false,
       recordshow:false,
       records:[]
    }
  },
  beforeMount(){
  	 this.student = JSON.parse(sessionStorage.getItem('student'));
	 if(this.student){
	 	 this.logShow = false;
	 	 this.getRecord();
	 }else{
	 	 this.logShow = true;
//	     this.$router.push({ name: 'Login'});
	 }
  },
  methods:{
  	 goLogin(){
  	 	this.$router.push({ name: 'Login'});
  	 },
  	 getRecord(){
  	 	   this.loading = true;
  	 	   var that = this;
  	       axios({
			  method: 'post',
			  url:'../center/rechargeRecord',
			  data:querystring.stringify({
			  	 type:0,
			  	 studentId:that.student.studentId 
			  })
		  })
      	  .then(function(r){
      	  	  that.loading = false;
              if(r.data.success){
              	 that.records = r.data.data.record;
                 if(that.records.length==0){
                 	that.recordshow = true;
                 }else{
                 	that.recordshow = false;
                 	that.records.reverse();
                 }
              }else{
              	  that.$message({
			          message:r.data.desc,
			          type: 'error',
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
  }
}
</script>

<style scoped>
  .recharge-record{
  	 box-sizing:border-box;
   	 height:614px;
   	 padding-top:20px;
   	 padding-left:88px;
   	 padding-right:88px;
   	 overflow-y:auto;
  }
  .check-login{
   	    text-align:center;
  	    line-height:520px;
   }
  .empty{
  	text-align:center;
  	line-height:560px;
  }
   ul{
   	 border:1px solid #333;
   	 border-bottom:none;
   	 margin-bottom:20px;
   }
   ul>li{
   	line-height:56px;
   	display:flex;
   	border-bottom:1px solid #333;
   }
   .left{
   	 display:block;
   	 width:210px;
   	 padding-left:70px;
   }
    .right{
       flex:1;
       padding-left:80px;
    }
</style>