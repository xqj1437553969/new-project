function getQueryString(str) {
	var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
var code = getQueryString("code");
console.log(code);
$.ajax({
	type:"post",
	url:"../center/activation",
    data:{
    	code:code
    },
	success:function(r){
		console.log(r);
		if(r.success){
		    putData(r);
		    scanf(r);
		}else if(r.code == 2){
			window.location.href = r.desc;
		}else{
			window.location.href = "not-exist.html"
		}
	}
});
function putData(res){
	console.log(res);
	var countryList = res.data.countryList;//获取国家列表数据
	var sOptions = "";
	for(var i=0;i<countryList.length;i++){
		var item = countryList[i];
		sOptions +=`<option value="${i+1}"  data-activatedateearliest="${item.activateDateEarliest}"  data-activatedateprompt="${item.activateDatePrompt}" data-id="${item.countryId}" data-barcodelength="${item.barCodeLength}" data-cardnolength="${item.cardNoLength}" data-cardnoname="${item.cardNoName}" data-countryname="${item.countryName}" data-imgurl="${item.imgurl}">${item.countryName}</option>`
	}
	$("#country_name").html(sOptions);//将获取的国家列表数据插入到select中
	initCountry();
	$("#country_name").change(function(){//select的value值改变时触发initCountry
		 initCountry();
	})
}
function initCountry(){//页面数据展示
   var _index = $("#country_name").val();
   console.log(_index)
   var selected= $("option[value='"+_index+"']");
   console.log(selected);
   var imgurl = selected.attr("data-imgurl");
   console.log(imgurl);
   var cardNoName = selected.attr("data-cardnoname");
   var activateDatePrompt = selected.attr("data-activatedateprompt");
   $("#pic").html("<img src='" + imgurl + "' id='picsty'>");
   $("#scanQRCode").html("扫码获取" + cardNoName);
   $("#reset-name").html(cardNoName);
   $("#cardNo").attr("placeholder", "请输入" + cardNoName);
   $("#date").attr("placeholder", "请选择激活日期（" + activateDatePrompt + "）");
}

function scanf(result){
	console.log(result);
	var jssdk = result.data.jssdk;
	var appId = jssdk.appId;
	var timestamp = jssdk.timestamp;
	var signature = jssdk.signature;
	var nonceStr =  jssdk.nonceStr;
	wx.config({
	    debug:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId:appId, // 必填，公众号的唯一标识
	    timestamp:timestamp, // 必填，生成签名的时间戳
	    nonceStr:nonceStr, // 必填，生成签名的随机串
	    signature:signature,// 必填，签名
	    jsApiList:[scanQRCode] // 必填，需要使用的JS接口列表
  });
  
  $("#scanQRCode").click(function(){
   	   console.log("scanQRCode");
   	   var index = $("#country_name").val();
   	   var countryId = Number($("option[value='"+index+"']").attr("data-id"));
   	   console.log(countryId);
   	   wx.scanQRCode({
			needResult:1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			success: function (res) {
				console.log(res); // 当needResult 为 1 时，扫码返回的结果
				var result = res.resultStr;
				var barCode = "";
				if (result.indexOf(",") >= 0) {
					var tempArray = result.split(',');
					var tempNum = tempArray[1];
					barCode = tempNum;
				} else {
					barCode = result;
				}
				if (!validateCodeLength(barCode)) {
					alert("无效的条形码");
					return;
				}
				$.ajax({
					type:"post",
					url:"../center/checkBarCode",
					data:{barCode:barCode,countryId:countryId},
					success:function(r){
						  if(r.success) {
							  var cardNo = r.data.cardNo;
							  $("#cardNo").val(cardNo);
						  } else {
							  alert(r.desc);
						  }
					}
				});
			}
	   });
  })         
}


function validateCodeLength(code) {//条形码长度、卡号长度、唯一码长度验证
	var index = $("#country_name").val();
	var ele = $("option[value='"+index+"']")
	var barCodeLength = ele.attr("data-barcodelength");//条形码长度
	var cardNoLength =  ele.attr("data-cardnolength");//卡号长度
	var length = cardNoLength.split(",");
	var length2 = barCodeLength.split(",");
	console.log(length,length2);
	if ($.inArray(code.length.toString(), length) == -1 && $.inArray(code.length.toString(), length2) == -1 && code.length != 13) {
		return false;
	} else {
		return true;
	}
}

$("#showIOSDialog1").click(function(){//点击手动输入按钮触发的事件
	var val = $("#country_name").val();
	var ele = $("option[value='"+val+"']");
	var cardNoName = ele.attr("data-cardnoname");
	$("#code").attr("placeholder", "手动输入获取" + cardNoName);
	$("#iosDialog1").fadeIn(200);
})

$("#cancel").click(function(){//点击弹出层取消按钮触发的事件
	$("#iosDialog1").fadeOut(200);
})
$("#continue").click(function(){//点击弹出层确定按钮触发的事件
	var code = $("#code").val();
	if (!code) {
		alert("不能为空");
		return;
	}
	if (!validateCodeLength(code)) {
		alert("输入错误");
		return;
	}
	var val = $("#country_name").val();
   	var countryId = Number($("option[value='"+val+"']").attr("data-id"));
	$.ajax({
		type:"post",
		url:"../center/checkBarCode",
		data:{barCode:code,countryId:countryId},
		success:function(r){
			console.log(r);
			if(r.success){
				var cardNo = r.data.cardNo;
			    $("#cardNo").val(cardNo);
			    $("#iosDialog1").fadeOut(200);
			}
		}
	});
})

$("#date-warpper").click(function(){//日期选择
//	    console.log("date-warpper");
	    var val = $("#country_name").val();
	    var ele = $("option[value='"+val+"']");
		var firstDay = getDate(ele.attr("data-activatedateearliest"));
//		console.log(new Date().getTimezoneOffset());
		weui.datePicker({
			start : firstDay, // 从今天开始
			end : 2030,
			defaultValue : [ firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate() ],
			onConfirm : function(result) {
//				console.log(result);
				var x = result[0].value + "-" + (result[1].value < 10 ? ('0' + result[1].value) : result[1].value) + "-" + (result[2].value < 10 ? ('0' + result[2].value) : result[2].value);
				$("#date").val(x);
			},
			id : 'datePicker'
		});
})

$("#btn-sub").click(function(){
	var val = $("#country_name").val();
   	var countryId = Number($("option[value='"+val+"']").attr("data-id"));
   	var cardNo = $("#cardNo").val();
   	var activateDate = $("#date").val();
   	console.log(val,countryId,cardNo,activateDate);
// 	$("#iosDialog2").fadeIn(200);
	$.ajax({
		type:"post",
		url:"../center/saveActivation",
		data:{
			studentId:27,
			countryId:countryId,
			cardNo:cardNo,
			activateDate:activateDate
		},
		success:function(r){
			console.log(r);
			if(r.success){
				window.location.href = "activateSuccess.html";
			}else{
				$("#iosDialog2").fadeIn(200);
				$("#iosDialog2").find(".weui-dialog__bd").html(r.desc);
			}
		}
	});
})
$("#know").click(function(){
	$("#iosDialog2").fadeOut(200);
})
$("#btn-check").click(function(){
	window.location.href = "activateRecord.html";
})


























//$.ajax({
//	url : '../center/isLogin',
//	type : 'post',
//	dataType : 'json',
//	success : function(res) {
//		if (res.code == 0){
//		} else {
//			location.href = "login.html?callback=packageScanf.html"
//		}
//	}
//})
//
//function getQueryString(str) {
//	var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
//	var r = window.location.search.substr(1).match(reg);
//	if (r != null)
//		return unescape(r[2]);
//	return null;
//}
//var openId = null;
//var businessId = getQueryString("businessId");
//var code = getQueryString("code");
//var countryID = getQueryString("countryId");
//$.post("../center/buyPackage", {
//	businessId : businessId,
//	code : code,
//	countryId : countryID
//}, function(res) {
//	console.log(res);
//	if (res.success) {
//		openId = res.data.openId;
//		localStorage.setItem("openId",openId);
//		for (var i = 0; i < res.data.countryList.length; i++) {
//			var country = res.data.countryList[i];
//			var str = "<option value='" + country.countryId 
//	                + "' id='" + country.countryId 
//	                + "' length='" + country.cardNoLength 
//	                + "' name='" + country.cardNoName 
//	                + "' img='" + country.imgurl 
//	                + "' barCodeLength='" + country.barCodeLength 
//	                + "' activateDatePrompt='" + country.activateDatePrompt 
//	                + "' activateDateEarliest='" + country.activateDateEarliest + "'>"
//			        + country.countryName + "</option>"
//	        $("#country_name").append(str);
//		}
//		$("#country_name").find("option[value = '" + countryID + "']").attr("selected", "selected");
//		$("#picturesty").css('display', 'none');
//		$("#bodysection").css('display', 'block');
//		initCountry();
//		var jssdk = res.data.jssdk;
//		var dataObj = eval(jssdk);
//		var options = {
//			debug:false,
//			jsApiList : [ "scanQRCode" ]
//		};
//		$.extend(options, dataObj);
//		console.log(options);
//		wx.config(options);
//		wx.ready(function() {
//			$("#scanQRCode").click(function() {//二维码扫描验证条形码
//				var country = $("#country_name").val();
//				if (!country) {
//					alert("请选择国家");
//					return;
//				}
//				var countryId = $("#" + country).val();
//				wx.scanQRCode({
//					needResult : 1,
//					desc : 'scanQRCode desc',
//					success : function(res) {
//						var result = res.resultStr;
//						var barCode = "";
//						if (result.indexOf(",") >= 0) {
//							var tempArray = result.split(',');
//							var tempNum = tempArray[1];
//							barCode = tempNum;
//						} else {
//							barCode = result;
//						}
//						if (!validateCodeLength(country, barCode)) {
//							alert("无效的条形码");
//							return;
//						}
//						$.post("../center/checkBarCode", {
//							barCode : barCode,
//							countryId : countryId
//						}, function(r) {
//							console.log(r);
//							if (r.success) {
//								var cardNo = r.data.cardNo;
//								$("#cardNo").val(cardNo);
//							} else {
//								alert(r.desc);
//							}
//						}, 'json');
//					}
//				});
//			});
//		});
//	} else if (res.code == 2) {
//		window.location.href = res.desc;
//	} else {
//		window.location.href = "not-exist.html";
//	}
//})
//
//function initCountry() {//初始化select的option选项
//	var country = $("#country_name").val();
//	var cardNoName = $("#" + country).attr("name");
//	var imgurl = $("#" + country).attr("img");
//	var activateDatePrompt = $("#" + country).attr("activateDatePrompt");
//	$("#pic").html("<img src='" + imgurl + "' id='picsty'>");
//	$("#card").empty();
//	$("#card").append("<div class='weui-cell'>" + cardNoName + "</div>");
//	$("#card").append("<div class='weui-cell'><div class='weui-cell__bd'><input class='weui-input' disabled='disabled' type='text' id='cardNo' placeholder='请输入" + cardNoName + "'></div></div>");
//	$("#scanQRCode").html("扫码获取" + cardNoName);
//	$("#code").attr("placeholder", "手动输入获取" + cardNoName);
//}
//
//function validateCodeLength(country, code) {
//	var cardLength = $("#" + country).attr("length");
//	var barCodeLength = $("#" + country).attr("barCodeLength");
//	var length = cardLength.split(",");
//	var length2 = barCodeLength.split(",");
//	if ($.inArray(code.length.toString(), length) == -1 && $.inArray(code.length.toString(), length2) == -1 && code.length != 13) {
//		return false;
//	} else {
//		return true;
//	}
//}
//
//function hand_input() {//点击手动输入按钮触发的事件
////	console.log("点击手动输入")
//	var country = $("#country_name").val();
////	console.log(country);
//	if (country) {
//		var cardNoName = $("#" + country).attr("name");
//		$("#code").attr("placeholder", "手动输入获取" + cardNoName);
//		$("#iosDialog1").fadeIn(200);
//	} else {
//		alert("请选择国家");
//	}
//}
//
//function submit() {//点击弹出层确定按钮手动输入卡号
//	var code = $("#code").val();
//	if (!code) {
//		alert("不能为空");
//		return;
//	}
//	var country = $("#country_name").val();
//	var countryId = Number($("#" + country).val());
//	console.log(typeof country, typeof countryId );
//	console.log(code);
//	if (!validateCodeLength(country, code)) {
//		alert("输入错误");
//		return;
//	}
//	$.post("../center/checkBarCode", {//验证手动输入的卡号
//		barCode : code,
//		countryId : countryId
//	}, function(r) {
//		console.log(r);
//		if (r.success) {
//			var cardNo = r.data.cardNo;
//			$("#cardNo").val(cardNo);
//			$("#iosDialog1").fadeOut(200);
//		} else {
//			alert("输入错误");
//		}
//	}, 'json');
//}
//
//function cancel() {//点击弹出层取消按钮让弹出层消失
//	$("#iosDialog1").fadeOut(200);
//}
//
////function sertime() {//日期选择器
////	var country = $("#country_name").val();
////	var firstDay = getDate($("#" + country).attr("activateDateEarliest"));
////	weui.datePicker({
////		start : firstDay, // 从今天开始
////		end : 2030,
////		defaultValue : [ firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate() ],
////		onConfirm : function(result) {
////			var x = result[0].value + "-" + (result[1].value < 10 ? ('0' + result[1].value) : result[1].value) + "-" + (result[2].value < 10 ? ('0' + result[2].value) : result[2].value);
////			$("#in").val(x);
////		},
////		id : 'datePicker'
////	});
////}
//
//function submit_inf() {//点击下一步购买套餐时进行输入是否为空的验证
//	var country = $("#country_name").val();
//	if (!country) {
//		alert("请选择国家");
//		return;
//	}
//	var countryId = $("#" + country).val();
//	var cardNoName = $("#" + country).attr("name");
//	var cardNo = $("#cardNo").val().trim();
//	if (!cardNo) {
//		alert("请获取" + cardNoName);
//		return;
//	}
//	var selectInfo = {
//		countryId:countryId,
//		cardNo:cardNo
//	}
//	
////	console.log("sacnf");
//  localStorage.setItem("selectInfo",JSON.stringify(selectInfo));//将国家id和卡号存起来
//	location.href = "packageSelection.html"
//}



