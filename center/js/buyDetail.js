$(function(){
	//确定取消弹出层
    $iosDialog1 = $('#iosDialog1'),
    $('#cancel').on('click', function(){
        $(this).parents('.js_dialog').fadeOut(200);
    });
    $('#showIOSDialog1').on('click', function(){
        $iosDialog1.fadeIn(200);
    });
});
var orderNo = null;
var openId = localStorage.getItem("openId");//openId
//console.log(openId);
getDetail();
function getDetail(){
    var detail = JSON.parse(localStorage.getItem("detail"));
    console.log(detail);
    putDetail(detail);
}
function putDetail(info){
	console.log(info);
	var cardNo =info.cardNo;//卡号
	var cardNoName = info.cardNoName;//卡名称
    var packageName = info.packageName;//套餐名称
    var month = info.monthNo;//订购月数
    var price = info.orderPirce;//套餐总金额
    var orderSource = info.orderSource;//支付方式
    var orderStatus = info.orderStatus;//订单状态
    orderNo = info.orderNo;//订单号
    isPay(orderStatus);
    var createTime = formatToTime(info.createTime);//订单提交时间
    var str = `<li><span class="info-left">${cardNoName}</span><span class="info-right">${cardNo}</span></li>
			   <li><span class="info-left">套餐名称</span><span class="info-right">${packageName}</span></li>
			   <li><span class="info-left">订购月数</span><span class="info-right">${month}</span></li>
			   <li><span class="info-left">套餐总金额</span><span class="info-right">${price}CNY</span></li>
			   <li><span class="info-left">支付方式</span><span class="info-right">${orderSource}</span></li>
			   <li><span class="info-left">订单状态</span><span class="info-right">${orderStatus}</span></li>
			   <li><span class="info-left">提交时间</span><span class="info-right">${createTime}</span></li>`
    $(".buy-info").html(str);
}
function isPay(status){
	if(status!="未支付"){
		$(".btn-continue-pay").hide();
		$(".btn-cancel-pay").hide();
	}else{
		$(".btn-continue-pay").show();
		$(".btn-cancel-pay").show();
	}
}

$(".btn-continue-pay").click(function(){
	console.log(orderNo);
	$.ajax({
		type:"post",
		url:"../center/continuePay",
		data:{
		   openid:openId,
		   payType:0,
		   orderNo:orderNo
		},
		success:function(r){
			console.log(r);
			if(r.success){
				 function onBridgeReady(){
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

$("#continue").click(function(){
	$.ajax({
		type:"post",
		url:"../center/cancelOrder",
		data:{
		   openid:openId,
		   orderNo:orderNo
		},
		success:function(r){
			console.log(r);
			if(r.success){
				$(".buy-info>li").eq(5).children(".info-right").html("已取消");
				$('.js_dialog').fadeOut(200);
				$(".btn-continue-pay").hide();
		        $(".btn-cancel-pay").hide();
			}
		}
	});
})
