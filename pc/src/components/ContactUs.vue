<template>
	<div class="contact-us-container">
		<div class="contact-us">
			<h4>联系我们</h4>
			<div class="desc">
			    <p>弗兰威尔科技有限公司竭力为您提供卓越的服务。无论您在中国或者外国，我们的客户服务中心提供7天24小时中英文双语咨询，随时解决您的问题。</p>
			    <p>您可以通过以下方式联系我们：</p>
			    <p>中国客服电话：0512-67679962</p>
			    <p>官方微信账号：Fuwii弗威</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'ContactUs',
  data () {
    return {
       
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
	.contact-us-container{
		width:100%;
	}
	.contact-us{
		box-sizing:border-box;
		width:1190px;
		height:614px;
		margin:0 auto;
		padding-top:100px;
		padding-left:50px;
	}
	h4{
		color:#cd3785;
		margin-bottom:33px;
	}
    p{
    	margin-top:35px;
    }
</style>