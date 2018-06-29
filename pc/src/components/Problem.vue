<template>
	<div class="problem-container">
		<div class="problem">
			<h3 class="tit">常见问题</h3>
		    <el-collapse v-model="activeName" accordion v-bind:style="{marginRight:'50px'}">
				  <el-collapse-item name="1">
					  	<template slot="title">
					       <h3>手机卡能打电话却不能上网？</h3>
					    </template>
					    <div>按照以下方式进行手机设置：</div>
					    <div>苹果手机：①【设置】→【蜂窝移动网络】 →【开启4G/LTE】→【打开数据漫游】 ；②点开【蜂窝移动数据网络】一栏，APN：giffgaff.com；用户名：giffgaff；
	③如果还不能上网，请还原网络设置：【设置】→【通用】→【还原】→【还原网络设置】，重启手机即可。</div>
	                    <div>安卓手机：【设置】→【无线和网络】→【移动网络设置】 →【开启数据漫游】→【接入点名称】→按手机上方或下方的“菜单”键→【新建APN】→【名称：giffgaff】→【APN：giffgaff.com】→按手机“菜单”键保存接入点，并选择该接入点。</div>
				  </el-collapse-item>
				  <el-collapse-item  name="2">
					  	<template slot="title">
					       <h3>到达英国后，无法拨打中国长途？</h3>
					    </template>
					    <div>套餐里的通话为英国通话，不包含国际通话。如果拨打套餐外的中国通话，按0.02镑/分钟计费，所以卡内要先预留一定的话费。</div>
				  </el-collapse-item>
				  <el-collapse-item name="3">
					  	<template slot="title">
					       <h3>国际长途的资费怎么算？</h3>
					    </template>
					    <div>国际通话不包含在套餐内，需通过余额扣费。如：卡内余额15磅，开通10磅套餐，剩余5磅可拨打中国（0.02磅/分钟）通话250分钟。</div>
				  </el-collapse-item>
				  <el-collapse-item name="4">
					  	<template slot="title">
					       <h3>国际漫游如何收费？</h3>
					    </template>
					    <div>去欧洲及某些特定国家旅游，giffgaff可在37个国家免漫游费。 直接像在英国一样正常使用giffgaff套餐，不用再买其他套餐。只要用量没超套餐定量，就不会额外收钱。（tips：使用前请打开手机里的漫游设置 ）</div>
				  </el-collapse-item>
				   <el-collapse-item name="5">
					  	<template slot="title">
					       <h3>在英国如何拨打电话？</h3>
					    </template>
					    <div>拨打英国当地手机：直接拨出即可；英国拨打中国手机：0086+手机号码；英国拨打中国座机：0086+区号（去首位0）+座机号码；中国拨打英国手机：0044+手机号码（去首位0）。</div>
				  </el-collapse-item>
				  <el-collapse-item name="6">
					  	<template slot="title">
					       <h3>如何查询剩余流量、话费余额及套餐使用情况？</h3>
					    </template>
					    <div>下载APP“my giffgaff”，可查询卡内余额、套餐使用情况；也可进行充值续费，更改套餐，操作方便直观。也可在Fuwii弗威公众号中进行话费充值。</div>
				  </el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Problem',
  data () {
    return {
        activeName: ''
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
	.problem-container{
		width:100%;
	}
	.problem{
		width:1190px;
		height:553px;
		margin:0 auto;
		padding-top:60px;
		padding-left:110px;
	}
	.tit{
		color:#cd3785;
		margin-bottom:33px;
	}
</style>