<template>
	<div class="business-record" v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
         <div v-if="logShow" class="check-login">
		 	登录之后才可以查看开通记录
		 	<el-button type="primary" @click="goLogin" v-bind:style="{marginLeft:'20px'}">登录</el-button>
		 </div>
		 <div v-else>
	        <div v-if="recordshow" class="empty">您的开通记录是空的！</div>
			<div class="list-wrapper" v-else v-loading.fullscreen.lock="continueLoading" element-loading-text="拼命加载中"
	    element-loading-spinner="el-icon-loading"
	    element-loading-background="rgba(0, 0, 0, 0.8)">
				<ul v-for="(item,index) in records">
				   <li v-if="item.phoneNo?true:false"><span class="left">国外号码</span><span class="right">{{item.phoneNo}}</span></li>
				   <li v-if="item.username?true:false"><span class="left">Giffgaff帐号</span><span class="right">{{item.username}}</span></li>
				   <li v-if="item.password?true:false"><span class="left" >Giffgaff密码</span><span class="right">{{item.password}}</span></li>
				   <li><span class="left">{{item.cardNoName}}</span><span class="right">{{item.cardNo}}</span></li>
				   <li><span class="left">激活日期（英国时间）</span><span class="right">{{item.activateDate | formattodate}}<el-button type="primary" v-if="!item.limitUpdateDate" @click="changeDate(item.orderNo,item.activateDateEarliest)">修改激活日期</el-button></span></li>
				   <li><span class="left">套餐名称</span><span class="right">{{item.packageName | packagenamefilter}}</span></li>
				   <li><span class="left">充值金额</span><span class="right">{{item.productname}}</span></li>
				   <li><span class="left">订单价格</span><span class="right">{{item.orderPirce}}CNY</span></li>
				   <li>
				   	    <span class="left">订单来源</span><span class="right">{{item.orderSource}}
				   	        <el-button type="primary" v-if="item.orderStatus=='未支付'" @click="continuePay(item.orderNo)">继续支付</el-button>
				   	    	<el-button type="primary" v-if="item.orderStatus=='未支付'" v-bind:style="{marginLeft:'20px'}" @click="cancel(item.orderNo)">取消订单</el-button></span>
				   </li>
				   <li><span class="left">订单状态</span><span class="right">{{item.orderStatus}}</span></li>
				   <li><span class="left">提交时间（北京时间）</span><span class="right">{{item.createTime | formattotime}}</span></li>
				</ul>
				<el-dialog
					  title="修改激活日期"
					  :visible.sync="centerDialogVisible"
					  width="400px"
					  center>
				    	<el-date-picker v-model="date1"
					      type="date"
					      :placeholder="datePlaceholder"
					      :default-value = "defaultDate"
					      format="yyyy 年 MM 月 dd 日"
					      value-format="yyyy-MM-dd"
					      :picker-options="pickerOptions1"
				      	>
	    		 		</el-date-picker>
					  <span slot="footer" class="dialog-footer">
					    <el-button type="primary" @click="subDate" v-bind:style="{marginLeft:'0px',width:'124px'}" :loading="subLoading">提交</el-button>
					  </span>
				</el-dialog>
			</div>
		 </div>
	</div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring')
export default {
  name: 'BusinessRecord',
  data () {
    return {
       logShow:true,
       student:null,
       recordshow:false,
       datePlaceholder:'请选择激活日期（英国时间）',
       activateDateEarliest:null,
       defaultDate:'2018-5-16',
       pickerOptions1:{
	      	disabledDate:(time)=>{
              return time.getTime() < new Date(this.defaultDate).getTime()-8*60*60000;
            }
	   },
       date1:'',
       centerDialogVisible: false,
       subLoading:false,
       continueLoading:false,
       loading:false,
       orderNo:null,
       records:[]
    }
  },
  beforeMount(){
  	 this.student = JSON.parse(sessionStorage.getItem('student'));
	 if(this.student){
	 	 this.logShow=false;
	 	 this.getRecord();
	 }else{
	 	this.logShow=true;
//	    this.$router.push({ name: 'Login'});
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
			  url:'../center/packageOrderRecord',
			  data:querystring.stringify({
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
  	 },
  	 changeDate(_orderNo,_activateDateEarliest){
  	 	this.date1 = '';
  	 	this.orderNo = _orderNo;
  	 	this.activateDateEarliest = _activateDateEarliest;
  	 	this.defaultDate = getServerDate(this.activateDateEarliest);
  	 	this.centerDialogVisible = true; 
  	 },
  	 subDate(){
  	 	 if(!this.date1){
  	 	 	return this.$message({
			          message:'请选择激活日期',
			          type: 'error',
			          duration:1500,
			          center:true
             });
  	 	 }
  	 	 this.subLoading = true;
  	 	 var that = this;
  	     axios({
			  method: 'post',
			  url:'../center/updateActivateDate',
			  data:querystring.stringify({
			  	 orderNo:that.orderNo,
			  	 activateDate:that.date1
			  })
		  })
      	  .then(function(r){
      	  	  
              if(r.data.success){
                 that.getRecord();
                 that.subLoading = false;
                 that.centerDialogVisible = false; 
              	 that.$message({
			          message:'修改成功',
			          type: 'success',
			          duration:1500,
			          center:true
                  });
              }else{
              	  that.subLoading = false;
              	  that.centerDialogVisible = false;
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
  	 },
  	 continuePay(_orderNo){
  	 	  this.orderNo = _orderNo;
  	 	  this.continueLoading = true;
  	 	  var that = this;
  	 	  axios({
			  method: 'post',
			  url:'../center/continuePay',
			  data:querystring.stringify({
			  	 payType:1,
			  	 orderNo:that.orderNo
			  })
		  })
      	  .then(function(r){
              if(r.data.success){
//            	    that.continueLoading = false;
                    const div = document.createElement('div');
			        div.innerHTML = r.data.desc;
			        document.body.appendChild(div);
			        document.getElementsByName("punchout_form")[0].submit();
			        
              }else{
//            	  that.continueLoading = false;
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
  	 },
  	 cancel(_orderNo){
  	 	this.orderNo = _orderNo;
  	 	this.$confirm('确定取消订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'     
        }).then(() => {
           this.cancelOrder()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            duration:1500,
            center:true
          });          
        });
  	 },
  	 cancelOrder(){
  	 	var that = this;
  	 	axios({
			  method: 'post',
			  url:'../center/cancelOrder',
			  data:querystring.stringify({
			  	 orderNo:that.orderNo
			  })
		  })
      	  .then(function(r){
              if(r.data.success){
              	 that.getRecord()
              	 that.$message({
		            type: 'success',
		            message: '取消成功!',
		            duration:1500,
			        center:true
         		 });
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
  .business-record{
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
    .el-button{
    	margin-left:50px;
    }
    .el-input{
    	width:350px;
    }
</style>