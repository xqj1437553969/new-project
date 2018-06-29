<template>
	<div class="success-container">
		<div class="success">
		    <strong v-text="msg"></strong>
		    <p>感谢您的支持，您现在可以在个人中心里查看自己的充值记录<br/>如有任何问题可以拨打0512-67679962与我们取得联系</p>
		</div>
	</div>
</template>

<script>
export default {
  name: 'ChargeSuccess',
  data () {
    return {
       msg:'✔支付成功'
    }
  }
}
</script>

<style scoped>
	.success-container{
		width:100%;
	}
	.success{
		width:1190px;
		height:453px;
		margin:0 auto;
		padding-top:161px;
		text-align:center;
	}
	strong{
		margin-right:22px;
		font-size:29px;
	}
	p{  
		margin-top:33px;
		line-height:35px;
		font-size:18px;
	}
</style>