var myScroll = new IScroll("#wrapper",{//初始化iscroll
	hScrollbar:false,
    vScroll:true,
    bounce:false,
    click:true,    
    hideScrollbar: true
});
$.ajax({
	type:"post",
	url:"../center/activationRecord",
	data:{studentId:27},
	success:function(r){
		if(r.success){
			putData(r)
		}
	}
});
function putData(res){
	console.log(res);
	var data = res.data.orderDtoList;
	var str = "";
	for(var i=0;i<data.length;i++){
		var activateStatus = data[i].activateStatus;//激活状态
		var countryName = data[i].countryName;//国家
		var cardNoName  = data[i].cardNoName;//卡名
		var cardNo  = data[i].cardNo;//卡号
		var activateDatePrompt = data[i].activateDatePrompt;//激活时区
		var activateDate = formatToDate(data[i].activateDate);//激活日期
		var createTime = formatToTime(data[i].createTime);//提交时间
		console.log(activateDate,createTime);
		str+=`<li class="activate-info">
					<div><span class="info-left">激活状态</span><span class="info-right">${activateStatus}</span></div>
					<div><span class="info-left">国家</span><span class="info-right">${countryName}</span></div>
					<div><span class="info-left">${cardNoName}</span><span class="info-right">${cardNo}</span></div>
					<div><span class="info-left">激活日期（${activateDatePrompt}）</span><span class="info-right">${activateDate}</span></div>
					<div><span class="info-left">提交时间（北京时间）</span><span class="info-right">${createTime}</span></div>
					<span class="position-icon">></span>
				</li>`
	}
	$(".list").html(str);
    myScroll.refresh();//iscroll刷新
	$(".activate-info").click(function(){
		var index = $(this).index();
		var activateInfo = JSON.stringify(data[index]);
		localStorage.setItem("activateIndex",index);
		localStorage.setItem("activateInfo",activateInfo);
		window.location.href = "activateDate.html";
	})
}
