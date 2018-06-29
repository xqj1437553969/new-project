<template>
	<div class="success-container">
		<div class="success">
			 <!--<el-date-picker
		      v-model="value"
		      type="date"
		      placeholder="选择日期"
		      default-value = "2018-5-23"
		      format="yyyy 年 MM 月 dd 日"
		      value-format="yyyy-MM-dd"
		      :picker-options="pickerOptions1"
		      >
    		 </el-date-picker>-->
			 <p>您已经成功提交信息，卡会在3-5个工作日<br>内送到，请注意查收</p>
			 <router-link to="/information/cardrecord">个人中心</router-link>
		</div>
	</div>
</template>

<script>
export default {
  name: 'CardSuccess',
  data () {
    return {
//    msg:"2018-5-23",
//    value:'',
//	  pickerOptions1:{
//	      	disabledDate:(time)=>{
//	      	  console.log(time);
//            return time.getTime() <new Date(this.msg).getTime();
//          }
//	   }
    }
  },
  beforeMount(){
//	console.log(getServerDate(0))
  }
}
</script>

<style scoped>
	.success-container{
		width:100%;
	}
	.success{
		width:1190px;
		height:614px;
		margin:0 auto;
		padding-top:160px;
		text-align:center;
	}
	p{
		line-height:32px;
		font-size:18px;
	}
	a{
		display:inline-block;
        margin-top:40px;		
		padding:8px 20px;
		text-align:center;
		color:#fff;
		font-size:16px;
		background:#ca1d7b;
		border-radius:4px;
	}
</style>