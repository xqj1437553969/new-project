<template>
	<div class="information-container">
		<div class="information">
		    <div class="left">
		    	<router-link to="/information/user">个人信息</router-link>
				<router-link to="/information/cardrecord">领卡记录</router-link>
				<router-link to="/information/businessrecord">开通记录</router-link>
				<router-link to="/information/rechargerecord">充值记录</router-link>
		    </div>
		    <div class="right">
		    	<router-view></router-view>
		    </div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Information',
  data () {
    return {
    }
  }
}
</script>

<style scoped>
	.information-container{
		width:100%;
	}
	.information{
		display: flex;
		width:1190px;
		height:614px;
		margin:0 auto;
	}
	.left{
	   display:flex;
	   flex-direction:column;
	   width:230px;
	   /*border-left:1px solid #333;
	   border-right:1px solid #333;*/
	}
	.left>a{
	   display:block;
	   width:100%;
	   text-align:center;
	   line-height:45px;
       margin-bottom:5px;
	   background:#e1e1e1
	}
	.left>a.router-link-active{
		background:#ca1d7b;
		color:#fff;
	}
	.right{
		overflow:hidden;
/*		border-right:1px solid #333;*/
		flex:1;
	}
</style>