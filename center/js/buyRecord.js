
var myScroll = new IScroll("#wrapper",{//初始化iscroll
	  hScrollbar:false,
    vScroll:true,
    bounce:false,
    click:true,    
    hideScrollbar: true
});

var details = null;
var studentId = JSON.parse(localStorage.getItem("student")).studentId;//studentId
console.log(studentId);
console.log(typeof studentId);

getData();
function getData(){
  $.ajax({
	type:"post",
	url:"../center/packageOrderRecord",
	data:{
		studentId:studentId
	},
	success:function(r){
		console.log(r);
		if(r.success){
		    var _data = r.data.record;
        details = _data;//将数据存起来点击时记录详情时使用
			  putData(_data);	
		}
	}
  });	
}

function putData(data){
	console.log(typeof data)
	var str = "";
    for(var i=0;i<data.length;i++){
    	var info = data;
    	var cardNo =info[i].cardNo;//卡号
    	var cardNoName = info[i].cardNoName;//卡名称
    	var packageName = info[i].packageName;//套餐名称
    	var orderStatus = info[i].orderStatus;//订单状态
    	var createTime = formatToTime(info[i].createTime);//订单提交时间
    	str+=`<li class="activate-info">
				<div><span class="info-left">${cardNoName}</span><span class="info-right">${cardNo }</span></div>
				<div><span class="info-left">套餐名称</span><span class="info-right">${packageName}</span></div>
				<div><span class="info-left">订单状态</span><span class="info-right">${orderStatus}</span></div>
				<div><span class="info-left">提交信息</span><span class="info-right">${createTime}</span></div>
				<span class="position-icon">></span>
			</li>`
    }
    $(".list").html(str);
    myScroll.refresh();//iscroll刷新
}

$(".list").on("click",".activate-info",function(){//点击每个购买记录跳转到购买详情
//	console.log($(this).index());
    var detaiId = Number($(this).index());
    var detail = JSON.stringify(details[detaiId]);
    console.log(detail);
	  localStorage.setItem("detail",detail);
	  location.href="buyDetail.html";
})
