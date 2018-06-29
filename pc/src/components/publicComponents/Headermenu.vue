<template>
	<div class="menu-container">
		<div class="menu-box">
			<img src="../../assets/logo.jpg"/>
			<div class="menu">
				<router-link to="/main">首页</router-link>
				<router-link to="/freecard">免费领卡</router-link>
				<router-link to="/business">开通SIM卡</router-link>
				<router-link to="/recharge">话费充值</router-link>
				<router-link to="/information">个人中心</router-link>
			</div>
			
		</div>
	</div>
</template>

<script>
	 export default {
	  name: 'Headermenu',
	  data () {
	    return {
	    	
	    }
	  }
	}
</script>

<style scoped>
	.menu-container{
		width:100%;
		height:60px;
		background:#fff;
		border-bottom:1px solid #333;
    }
	.menu-box{
		width:1190px;
		margin:0 auto;
		height:60px;
	}
	img{
		float:left;
	}
	.menu{
	   float:right;
	}
	a{
	   display:block;
	   float:left;
	   width:191px;
	   text-align:center;
	   line-height:60px;
	   border-left:1px solid #aaa;
	   font-size:16px;
	}
	a:last-child{
	   border-right:1px solid #aaa;
	}
	a.router-link-active{
		background:#ca1d7b;
		color:#fff;
	}
</style>