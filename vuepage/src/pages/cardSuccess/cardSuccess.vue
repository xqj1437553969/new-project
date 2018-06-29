<template>
   <div id="header">
   	  	<div class="container">
			<div class="pay-success">
				<img src="../../assets/pay_success_03.png" alt="" />
			</div>
			<div class="pay-info">
				<p class="pay-info-title">提交成功！</p>
				<p class="sub-tip">您已成功提交信息，卡会在3-5个工作日内<br/>送到，请注意查收<br/>客服电话：0512-67679962</p>
			</div>
			<a id="btn-sub" href="information.html">个人中心</a>
		</div>
   </div>
</template>

<script>
	export default {
	  name: 'cardsuccess',
	}
</script>
<style>
@import '../../assets/weui.min.css' ;
@import '../../assets/reset.css' ;
#header{
	height:100%;
}
.container{
	height:100%;
	background: url(../../assets/back.jpg) no-repeat 0 0;
	background-size:100% 100%;
	font-size:.16rem;
}
.pay-success{
	text-align:center;
	padding-top:1.3rem;
}
.pay-success img{
	width:1.11rem;
	height:1.16rem;
}
.pay-info{
	height:1.17rem;
	padding-top:.16rem;
	text-align:center;
}
.pay-info-title{
	font-size:.16rem;
	color:#fff;
}
.pay-info>p.sub-tip{
	margin-top:.15rem;
	line-height:.26rem;
	color:#eee;
	font-size:.16rem;
}
#btn-sub{
	display:block;
	width:3.24rem;
	height:.45rem;
	text-align:center;
    line-height:.45rem;
	background:rgb(202,29,123);
	border:none;
	border-radius:.07rem;
	margin:0 auto;
	margin-top:1.27rem;
	font-size:.16rem;
	color:#fff;
	outline:none;
	
}
</style>
