<template>
	<div class="footer-container">
		<div class="footer">
		   <div class="about-us">
		      <ul>
		         <li>
		            <p class="title">关于我们</p>
		            <p class="other"><router-link to="/company">公司介绍</router-link></p>
		            <p class="other"><router-link to="/contactus">联系我们</router-link></p>
		         </li>
		         <li>
		            <p class="title">快捷操作</p>
		            <p class="other"><router-link to="/freecard">免费领卡</router-link></p>
		            <p class="other"><router-link to="/business">开通SIM卡</router-link></p>
		            <p class="other"><router-link to="/recharge">话费充值</router-link></p>
		         </li>
		         <li>
		            <p class="title">帮助与支持</p>
		            <p class="other"><router-link to="/problem">常见问题</router-link></p>
		         </li>
		         <li>
		            <p class="title">个人中心</p>
		            <p class="other"><router-link to="/information/cardrecord">领卡记录</router-link></p>
		            <p class="other"><router-link to="/information/businessrecord">开通记录</router-link></p>
		            <p class="other"><router-link to="/information/rechargerecord">充值记录</router-link></p>
		         </li>
		      </ul>
		      <div class="qr-code">
		      	 <img src="../../assets/qr_code.jpg" alt="" />
		      </div>
		   </div>
		   <div class="copy-right">Copyright 2018 弗兰威尔信息科技（苏州）有限公司ICP备17014738号-2</div>
		</div>
	</div>
</template>

<script>
	export default {
	  name: 'Footer',
	  data () {
	    return {
	      msg: 'Welcome to Your Vue.js App'
	    }
	  }
	}
</script>

<style scoped>
	.footer-container{
		width:100%;
		border-top:1px solid #333;
		background:#fff;
	}
	.footer{
		width:1190px;
		margin:0 auto;
		height:252px;
	}
	ul{
		width:684px;
		padding-top:20px;
		padding-bottom:60px;
		display:flex;
		justify-content:space-between;
	}
	.about-us{
		height:170px;
		display:flex;
	}
	p.title{
		padding-bottom:13px;
		font-size:18px;
		font-weight:bold;
		border-bottom:1px solid #999;
	}
	p.other{
		margin-top:13px;
		font-size:16px;
	}
	.qr-code{
		flex:1;
		display:flex;
		justify-content:flex-end;
	}
	.copy-right{
		line-height:82px;
	    text-align:center;
		font-size:16px;
	}
	a.router-link-active{
		color:#ca1d7b;
	}
</style>