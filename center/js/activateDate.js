//$(function(){
//  $iosDialog1 = $('#iosDialog1'),
//  $('.reset-weui-dialog__btn').on('click', function(){
//      $(this).parents('.js_dialog').fadeOut(200);
//  });
//  $('.x-btn').on('click', function(){
//      $('.js_dialog').fadeOut(200);
//  });
//  $('#showIOSDialog1').on('click', function(){
//      $iosDialog1.fadeIn(200);
//  });
//});
var data = JSON.parse(localStorage.getItem("activateInfo"));
console.log(data);
putData(data);
function putData(res){
    var activateStatus = res.activateStatus;//激活状态
	var countryName = res.countryName;//国家
	var cardNoName  = res.cardNoName;//卡名
	var cardNo  = res.cardNo;//卡号
	var activateDatePrompt = res.activateDatePrompt;//激活时区
	var activateDate = formatToDate(res.activateDate);//激活日期
	var createTime = formatToTime(res.createTime);//提交时间
	var isTrue = res.limitUpdateDate;
	var updateDateAhead = res.updateDateAhead;
	var str = `<li><span class="info-left">激活状态</span><span class="info-right">${activateStatus}</span></li>
			   <li><span class="info-left">国家</span><span class="info-right">${countryName}</span></li>
			   <li><span class="info-left">${cardNoName}</span><span class="info-right">${cardNo}</span></li>
			   <li><span class="info-left">激活日期（${activateDatePrompt}）</span><span class="info-right">${activateDate}</span></li>
			   <li><span class="info-left">提交时间（北京时间）</span><span class="info-right">${createTime}</span></li>`
	$(".activate-info").html(str);
	if(isTrue){//限制修改激活日期
		$(".modification-btn").hide();
	}else{//可修改激活日期
		$(".modification-btn").show();
	}
}
$(".modification-btn").click(function(){//点击修改激活日期按钮，弹出层出现
	$("#date").html("请选择激活日期（"+data.activateDatePrompt+"）")
	$("#iosDialog1").fadeIn(200);
});
$('.x-btn').on('click', function(){//点击弹出层x号，弹出层消失
    $("#iosDialog1").fadeOut(200);
});
$("#date").click(function(){//点击请选择激活日期
	    var firstDay = getDate(data.activateDateEarliest);
//		console.log(new Date().getTimezoneOffset());
		weui.datePicker({
			start : firstDay, // 从今天开始
			end : 2030,
			defaultValue : [ firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate() ],
			onConfirm : function(result) {
				console.log(result);
				var x = result[0].value + "-" + (result[1].value < 10 ? ('0' + result[1].value) : result[1].value) + "-" + (result[2].value < 10 ? ('0' + result[2].value) : result[2].value);
				$("#date").html(x);
			},
			id : 'datePicker'
		});
})

$("#sub").click(function(){
	var txt = $("#date").html();
	console.log(txt.indexOf("请选择激活日期"));
	if(txt.indexOf("请选择激活日期")!=-1){
		alert("请选择激活日期");
		return;
	}
	revise();
})

function revise(){
	var reviseDate = $("#date").html();
	var orderId = data.orderId;//激活订单id
	console.log(orderId,reviseDate);
	$.ajax({
		type:"post",
		url:"../center/updateActivateDate",
		data:{
			orderId:orderId,
			activateDate:reviseDate
		},
		success:function(r){
			if(r.success){
				alert("修改激活日期成功");
				$("#iosDialog1").fadeOut(200);
				putAgain();
			}
		}
	});
}

function putAgain(){
	var index = Number(localStorage.getItem("activateIndex"));
	console.log(index);
	$.ajax({
		type:"post",
		url:"../center/activationRecord",
		data:{
			studentId:27
		},
		success:function(r){
			if(r.success){
				var againInfo = r.data.orderDtoList[index];
				var againCreateTime = formatToTime(againInfo.createTime);
				var againActivateDate = formatToDate(againInfo.activateDate);
				$(".activate-info>li").eq(3).children(".info-right").html(againActivateDate);
				$(".activate-info>li").eq(4).children(".info-right").html(againCreateTime);
			}
		}
	});
}
