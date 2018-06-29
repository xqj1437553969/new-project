<template>
   <div class="main-container">
        <img src="../assets/recharge.jpg" alt="" />
        <ul class="package-lists" v-loading="loading"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <li class="package-item" v-for="(item,index) in items">
            	<div class="package-price">{{item.packageName | pricefilter}}</div>
            	<div class="package-desc">
            		<p class="bold">{{item.packageName | namefilter}}</p>
            		<p v-html="item.packageDesc"></p>
            	</div>
            	<el-button type="primary" @click="go">立即订购</el-button>
            </li>
        </ul>
   </div>
</template>

<script>
import axios from 'axios';
const querystring = require('querystring');
export default {
  name: 'Main',
  data () {
    return {
      loading:true,
      uk:null,
      items:null,
      type:null
    }
  },
  beforeMount:function(){
//	    var that = this;
//	    setTimeout(function(){  	    	
//	    	that.getData()
//	    },3000)
        if(this.IEVersion()!=-1){
        	alert("检测到您使用的是IE浏览器或者浏览器使用的是兼容IE模式,该网页不支持IE,建议您更换其他浏览器或者切换为极速模式");
        	window.close();
        }
        this.type = this.getQueryString("type");
        if(this.type){
        	sessionStorage.setItem("type",this.type);
        }
        this.getData();
  },
  methods:{
  	 IEVersion(){
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    return 8;
                } else if(fIEVersion == 9) {
                    return 9;
                } else if(fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }   
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 11; //IE11  
            }else{
                return -1;//不是ie浏览器
            }
     },
  	 getQueryString(str) {
		var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	 },
	 getData(){
	 	  var that = this;
	  	  axios({
			  method: 'post',
			  url:'../center/cardCountry',
			  data:querystring.stringify({
			  	  orderSource:1
			  })
		  })
	  	  .then(function(r) {
	  	  	  that.loading = false;
	  		  that.putData(r) 
		  })
	  	  .catch(function (error) {
              that.$message({
		          message:"请求失败",
		          type: 'error',
		          duration:1500,
		          center:true
	          });
		  });
	 },
	 putData(r){
//	 	    console.log(r);
	 	 	var countryList = r.data.data.countryList;
		    for(var j=0;j<countryList.length;j++){
		    	if(countryList[j].countryName=="英国"){
		    		this.uk = countryList[j];
		    	}
		    }
		    sessionStorage.setItem("countryId",this.uk.countryId);
		    this.items = this.uk.packageList;
	},
	go(){
		this.$router.push({ name: 'Business'});
	}
  }
}
</script>

<style scoped>
	.main-container{
	    width:100%;
	}
	img{
		display:block;
		width:100%;
	}
	.package-lists{
		box-sizing:border-box;
		width:1190px;
		height:527px;
		margin:0 auto;
		padding-top:45px;
		display:flex;
	    justify-content:space-between;
	}
	.package-price{
		width:169px;
		line-height:146px;
		text-align:center;
		font-size:46px;
		font-weight:600;
		color:#ca1d7b;
		border:1px solid #aaa;
	}
	
	.package-desc{
		width:169px;
		text-align:center;
		line-height:50px;
		border:1px solid #aaa;
		border-top:none;
	}
	.bold{
		font-weight:bold;
	}
	button{
		width:169px;
		margin-top:30px;
		/*margin-left:20px;*/
		font-size:16px;
	}
</style>