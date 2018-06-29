<template>
	<div class="company-container">
		<div class="company">
			<h4>弗兰威尔科技有限公司</h4>
			<img src="../assets/company.jpg" alt="" />
			<div class="desc">
			    弗兰威尔科技有限公司是一家专注做海外充值业务的公司，我们可以提供给消费者全新且与众不同的用户体验。
			    我们保证弗兰威尔拥有：优惠的本地、国际通讯资费、有竞争力的漫游费用；灵活、诱人的套餐；安全、可靠、优质的通话服务和覆盖全英最广的2G/3G网络；
			    多样、便利的充值方式；定期的酬宾促销活动回馈客户。
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Company',
  data () {
    return {
        activeName: '1'
    }
  },
  methods:{
  	go(){
  		this.$router.push({ name: 'BusinessRecord'});
  	}
  }
}
</script>

<style scoped>
	.company-container{
		width:100%;
	}
	.company{
		box-sizing:border-box;
		width:1190px;
		height:614px;
		margin:0 auto;
		padding-top:60px;
		padding-left:50px;
	}
	h4{
		color:#cd3785;
		margin-bottom:33px;
	}
	img{
		width:100%;
	}
	.desc{
	   margin-top:20px;
	   line-height:35px;
	}
</style>