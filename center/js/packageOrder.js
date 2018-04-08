//console.log(1);
var buyInfo = {};
var _packageId = localStorage.getItem("packageId");
console.log(_packageId);
$.ajax({//根据相应的packageId请求对应的套餐详情
	url: '../center/packageInfo',
	type: 'post',
	data:{
		packageId:_packageId
	},
	success:function(r){
		if(r.success){
			buyInfo = r.data;
			putInfo(buyInfo);
		}else{}
	}
})

function putInfo(res){//将对应的套餐详情展示到页面
//	console.log(res);
	var orderInfo = res.packageDesc;//套餐属性
	var orderImg = res.packagePic;//套餐图片
	var orderSymbol = res.currencySymbol;//货币符号
	var excRate = res.exchange_rate;//汇率
	var unitPrice = res.priceList[0].price;//单价
	var month = $(".month>select").val()//月数
	var totalPrice = unitPrice*month;
	var rmb = totalPrice*excRate;
	console.log(totalPrice);
	console.log(unitPrice);
	console.log(orderInfo);
	console.log(orderImg);
	$(".order-img").html('<img class="img" src='+orderImg+' alt="" />');
	$(".order-info>p").html(orderInfo);
	var symp = orderSymbol+unitPrice.toFixed(1);//货币符号+单价
	var symt= orderSymbol+totalPrice.toFixed(1);//货币符号+总价
    $(".buy-total").html('总计:'+symp+'*'+month+'个月='+symt);
    $(".buy-rmb").html(symt+'='+rmb.toFixed(1)+'CNY');
}

$(".month>select").change(function(){//选择月数，重新放置将对应的套餐详情重新展示到页面
	 putInfo(buyInfo)
})



//立即购买
$(".btn-buy").click(function(){
//	alert("支付");
	var _priceId = $(".month>select").val();
	_priceId = Number(_priceId);//价格id
	console.log(_priceId);	
	var openId = localStorage.getItem("openId");//openId
	console.log(openId);	
	var studentId = JSON.parse(localStorage.getItem("student")).studentId;//studentId
	console.log(studentId);
	var cardId = Number(localStorage.getItem("cardId"));//cardId
	console.log(cardId);
	$.ajax({
		type:"post",
		url:"../center/placeOrder",
		data:{
			openid:openId,
			priceId:_priceId,
		    cardId:cardId,
		    studentId:studentId,
		    orderSource:0
		},
		success:function(r){
			console.log(r);
		    if(r.success){
		    	function onBridgeReady(){
		    	   console.log(r);
				   WeixinJSBridge.invoke(
				       'getBrandWCPayRequest', {
				           "appId":r.data.appId,     //公众号名称，由商户传入     
				           "timeStamp":r.data.timeStamp,         //时间戳，自1970年以来的秒数     
				           "nonceStr":r.data.nonceStr, //随机串     
				           "package":r.data.packageStr,     
				           "signType":r.data.signType, //微信签名方式：     
				           "paySign":r.data.paySign//微信签名 
				       },
				       function(res){     
				           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				           	   location.href="paySuccess.html";
				           }else{
				           	   location.href="payFailed.html";
				           }
				       }
				   ); 
				}
				if (typeof WeixinJSBridge == "undefined"){
				   if( document.addEventListener ){
				       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				   }else if (document.attachEvent){
				       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
				       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				   }
				}else{
				   onBridgeReady();
				}

		    }
	    }	 
	});
	
})	
	
	




