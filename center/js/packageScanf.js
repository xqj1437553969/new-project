$.ajax({
	url : '../center/isLogin',
	type : 'post',
	dataType : 'json',
	success : function(r) {
		if (r.success){
		} else {
			location.href = "login.html?callback=packageScanf.html"
		}
	}
})

function getQueryString(str) {
	var reg = new RegExp("(^|&)" + str + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
var openId = null;
//var businessId = getQueryString("businessId");
var code = getQueryString("code");
console.log(code);
//var state = getQueryString("state");
//console.log(state);
//var countryID = getQueryString("countryId");
//var url = location.href.split("?")[1];
//console.log(url);
$.ajax({
	type:"post",
	url:"../center/buyPackage",
	data:{
		code:code
	},
	success:function(res){
		console.log(res)
		   if (res.success) {
			openId = res.data.openId;
			localStorage.setItem("openId",openId);
			for (var i = 0; i < res.data.countryList.length; i++) {
				var country = res.data.countryList[i];
				var str = "<option value='" + country.countryId 
		                + "' id='" + country.countryId 
		                + "' length='" + country.cardNoLength 
		                + "' name='" + country.cardNoName 
		                + "' img='" + country.imgurl 
		                + "' barCodeLength='" + country.barCodeLength 
		                + "' activateDatePrompt='" + country.activateDatePrompt 
		                + "' activateDateEarliest='" + country.activateDateEarliest + "'>"
				        + country.countryName + "</option>"
		        $("#country_name").append(str);
			}
	//		$("#country_name").find("option[value = '" + countryID + "']").attr("selected", "selected");
			$("#picturesty").css('display', 'none');
			$("#bodysection").css('display', 'block');
			initCountry();
			var jssdk = res.data.jssdk;
			var dataObj = eval(jssdk);
			var options = {
				debug:false,
				jsApiList : [ "scanQRCode" ]
			};
			$.extend(options, dataObj);
			console.log(options);
			wx.config(options);
			wx.ready(function() {
				$("#scanQRCode").click(function() {//二维码扫描验证条形码
					var country = $("#country_name").val();
					if (!country) {
						alert("请选择国家");
						return;
					}
					var countryId = $("#" + country).val();
					wx.scanQRCode({
						needResult : 1,
						desc : 'scanQRCode desc',
						success : function(res) {
							var result = res.resultStr;
							var barCode = "";
							if (result.indexOf(",") >= 0) {
								var tempArray = result.split(',');
								var tempNum = tempArray[1];
								barCode = tempNum;
							} else {
								barCode = result;
							}
							if (!validateCodeLength(country, barCode)) {
								alert("无效的条形码");
								return;
							}
							$.post("../center/checkBarCode", {
								barCode : barCode,
								countryId : countryId
							}, function(r) {
								console.log(r);
								if (r.success) {
									var cardNo = r.data.cardNo;
									$("#cardNo").val(cardNo);
								} else {
									alert(r.desc);
								}
							}, 'json');
						}
					});
				});
			});
		} else if (res.code == 2) {
			window.location.href = res.desc;
		} else {
			window.location.href = "not-exist.html";
		}
	}
	
});
//$.post("../center/buyPackage", {
//	code:code,
//	state:state
//}, function(res) {
//	console.log(res);
//	
//})

function initCountry() {//初始化select的option选项
	var country = $("#country_name").val();
	var cardNoName = $("#" + country).attr("name");
	var imgurl = $("#" + country).attr("img");
	var activateDatePrompt = $("#" + country).attr("activateDatePrompt");
	$("#pic").html("<img src='" + imgurl + "' id='picsty'>");
	$("#card").empty();
	$("#card").append("<div class='weui-cell'>" + cardNoName + "</div>");
	$("#card").append("<div class='weui-cell'><div class='weui-cell__bd'><input class='weui-input' disabled='disabled' type='text' id='cardNo' placeholder='请输入" + cardNoName + "'></div></div>");
	$("#scanQRCode").html("扫码获取" + cardNoName);
	$("#code").attr("placeholder", "手动输入获取" + cardNoName);
}

function validateCodeLength(country, code) {
	var cardLength = $("#" + country).attr("length");
	var barCodeLength = $("#" + country).attr("barCodeLength");
	var length = cardLength.split(",");
	var length2 = barCodeLength.split(",");
	if ($.inArray(code.length.toString(), length) == -1 && $.inArray(code.length.toString(), length2) == -1 && code.length != 13) {
		return false;
	} else {
		return true;
	}
}

function hand_input() {//点击手动输入按钮触发的事件
//	console.log("点击手动输入")
	var country = $("#country_name").val();
//	console.log(country);
	if (country) {
		var cardNoName = $("#" + country).attr("name");
		$("#code").attr("placeholder", "手动输入获取" + cardNoName);
		$("#iosDialog1").fadeIn(200);
	} else {
		alert("请选择国家");
	}
}

function submit() {//点击弹出层确定按钮手动输入卡号
	var code = $("#code").val();
	if (!code) {
		alert("不能为空");
		return;
	}
	var country = $("#country_name").val();
	var countryId = Number($("#" + country).val());
	console.log(typeof country, typeof countryId );
	console.log(code);
	if (!validateCodeLength(country, code)) {
		alert("输入错误");
		return;
	}
	$.post("../center/checkBarCode", {//验证手动输入的卡号
		barCode : code,
		countryId : countryId
	}, function(r) {
		console.log(r);
		if (r.success) {
			var cardNo = r.data.cardNo;
			$("#cardNo").val(cardNo);
			$("#iosDialog1").fadeOut(200);
		} else {
			alert("输入错误");
		}
	}, 'json');
}

function cancel() {//点击弹出层取消按钮让弹出层消失
	$("#iosDialog1").fadeOut(200);
}

//function sertime() {//日期选择器
//	var country = $("#country_name").val();
//	var firstDay = getDate($("#" + country).attr("activateDateEarliest"));
//	weui.datePicker({
//		start : firstDay, // 从今天开始
//		end : 2030,
//		defaultValue : [ firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate() ],
//		onConfirm : function(result) {
//			var x = result[0].value + "-" + (result[1].value < 10 ? ('0' + result[1].value) : result[1].value) + "-" + (result[2].value < 10 ? ('0' + result[2].value) : result[2].value);
//			$("#in").val(x);
//		},
//		id : 'datePicker'
//	});
//}

function submit_inf() {//点击下一步购买套餐时进行输入是否为空的验证
	var country = $("#country_name").val();
	if (!country) {
		alert("请选择国家");
		return;
	}
	var countryId = $("#" + country).val();
	var cardNoName = $("#" + country).attr("name");
	var cardNo = $("#cardNo").val().trim();
	if (!cardNo) {
		alert("请获取" + cardNoName);
		return;
	}
	var selectInfo = {
		countryId:countryId,
		cardNo:cardNo
	}
	
//	console.log("sacnf");
    localStorage.setItem("selectInfo",JSON.stringify(selectInfo));//将国家id和卡号存起来
	location.href = "packageSelection.html"
}



