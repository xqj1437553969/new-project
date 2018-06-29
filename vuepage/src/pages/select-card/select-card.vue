<template>
   <div id="header">
   	  <div id="loadingToast" v-if="loading">
	        <div class="weui-mask_transparent"></div>
	        <div class="weui-toast">
	            <i class="weui-loading weui-icon_toast"></i>
	            <p class="weui-toast__content">数据加载中</p>
	        </div>
    	</div>
        <div class="container" v-if="!loading">
        	<div id="card-img"><img v-bind:src="imgsrc"/></div>
        	<div id="free-get-card"><button id="btn-free" @click="go()">免费领卡</button></div>
        	<div id="charge-detail">
        		<div id="content">
        			<div id="charge-title">英国卡资费详情</div>
        			<div id="package-title"><p class="left">套餐名称</p><p class="right">套餐内容</p></div>
        			<ul  id="list">
        				<li v-for="(item,index) in items">
					    	<div class="package-name left"><strong>{{item.packageName | pricefilter}}</strong><br/>{{item.packageName | namefilter}}</div>
					    	<div class="package-content right" v-html="item.packageDesc"></div>
			   			</li>
			   			<li></li>
        			</ul>
        		</div>
        	</div>
        </div>
   </div>
</template>

<script>
	import axios from 'axios';
    const querystring = require('querystring');
	export default {
	  name: 'selectcard',
	  data(){
	  	 return{
	  	 	code:null,
	  	 	type:null,
	  	 	openId:null,
	  	 	uk:null,
	  	 	loading:true,
	  	 	items:null,
	  	 	imgsrc:null
	  	 }
	  },
	  methods:{
	  	 pushHistory() {
		    window.addEventListener("popstate", function(e) {
		        self.location.reload();
		    }, false);
		    var state = {
		        title : "",
		        url : "#"
		    };
		    window.history.replaceState(state, "", "#");
		},
		go(){
	     	window.location.href = "getCard.html"
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
				  url: '../center/cardCountry',
				  data: querystring.stringify({
				  	   code:that.code,
					   orderSource:0
			      })
			 })
		   	 .then(function(res){
		   	 	 if(res.data.success){
		   	 	 	that.openId = res.data.data.openId;
		   	 	 	sessionStorage.setItem("openId",openId);
		   	 	 	that.putData(res); 
		   	 	 	that.loading = false;
		   	 	 }else{
		   	 	 	window.location.href = res.data.desc;
//		   	 	    that.loading = false;
		   	 	 }
			 })
	   },
	   putData(r){
	 	 	var countryList = r.data.data.countryList;
		    for(var j=0;j<countryList.length;j++){
		    	if(countryList[j].countryName=="英国"){
		    		this.uk = countryList[j];
		    	}
		    }
		    sessionStorage.setItem("countryId",this.uk.countryId);
		    this.imgsrc = this.uk.cardImgUrl;
		    this.items = this.uk.packageList;
	    }
	  },
	  beforeMount(){
	  	 this.pushHistory()
	  	 this.code = this.getQueryString("code");
	  	 this.getData();
	  	 this.type = this.getQueryString("type");
	  	 if(this.type){
	  	 	 sessionStorage.setItem("type",this.type);
	  	 }
	  }
	}
</script>
<style>
@import '../../assets/weui.min.css' ;
@import '../../assets/reset.css' ;
#header{
	height:100%;
}
.container{
	min-height:100%;
	background: url(../../assets/back.jpg) no-repeat 0 0;
	background-size:100% 100%;
	padding-bottom:.1rem;
	font-size:.16rem;
}
#card-img{
	padding-top:.12rem;
	text-align: center;
}
#card-img>img{
	height:1.48rem;
}
#free-get-card{
	padding-top:.1rem;
	padding-bottom:.1rem;
}
#btn-free{
	display:block;
	width:2.7rem;
	text-align:center;
	line-height:.46rem;
	margin:0 auto;
	border:none;
	border-radius:.05rem;
	background:#ca1d7b;
	font-size:.17rem;
	color:#fff;
	font-family:"微软雅黑";
}
#charge-detail{
	box-sizing:border-box;
	padding-left:.26rem;
	padding-right:.26rem;
}
#content{
	background:#fff;
	border-radius:.1rem;
}
#charge-title{
	text-align:center;
	line-height:.37rem;
	font-size:.15rem;
}
#package-title{
  overflow:hidden;
  border-top:1px solid #333;
}
#package-title>p.right{
	box-sizing:border-box;
	float:right;
	border-left:1px solid #333;
}
#package-title>p.left{float:left;}
#package-title>p{
	width:50%;
	text-align:center;
	line-height:.29rem;
	font-size:.15rem;
}
#list>li{
	overflow:hidden;
	position:relative;
}
#list>li:after{
	display:block;
	content:"";
	height:100%;
	width:1px;
	position:absolute;
	left:50%;
	top:0;
	background:#333;
}
#list>li>.left{
	float:left;
	border-top:1px solid #333;
}
#list>li>.right{
	float:right;
	border-top:1px solid #333;
}
#list>li>div{
	width:50%;
	box-sizing:border-box;
	text-align:center;
	padding-top:.055rem;
	padding-bottom:.055rem;
	font-size:.14rem;
}
#list>li>div.left{
	padding-top:.09rem;
	padding-bottom:.09rem;
}
#list>li:last-child{
	height:.32rem;
	border-top:1px solid #333;
}
strong{
	font-size:.17rem;
}
#know{
   color:#353535;
   font-size:0.15rem;
}
</style>
