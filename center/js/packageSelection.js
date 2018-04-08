var packageDetail = {};
var selectInfo = JSON.parse(localStorage.getItem("selectInfo"));
console.log(selectInfo);
var cardNo = selectInfo.cardNo;//获取cardNo
var countryId = Number(selectInfo.countryId);//获取countryId
$.ajax({
	url: '../center/packageList',
	type: 'post',
	data:{
		cardNo:cardNo,
		countryId:countryId
	},
	success:function(res){
		 console.log(res);
		 packageDetail = res.data;
		 var packageList = packageDetail.packageList;//取出套餐列表数据
		 var str = '';
		 for(var i=0;i<packageList.length;i++){//循环将列表数据导入页面
		 	 console.log(i);
			 str+=`<div class="basic-package">
					<div class="basic-img"><img class="img" src="${packageList[i].packagePic}" alt="" /></div>
					<div class="basic-info">
						<p>${packageList[i].packageDesc}</p>
					</div>
					<div class="select">
						<img src="images/package-select_06.png" alt="" />
					</div>
				</div>`
		 }
		 $(".wrapper").html(str);
		 console.log($(".select>img"));
		 $(".select>img").click(function(){//点击角标跳到套餐订购页面
		 	 console.log($(this).parents(".basic-package").index());
		 	 var index = $(this).parents(".basic-package").index();
		 	 var packageId = packageList[index].packageId;
		 	 var cardId = packageDetail.cardId;
		 	 console.log(packageId,cardId);
		 	 localStorage.setItem("packageId",packageId);
		 	 localStorage.setItem("cardId",cardId);
		 	 location.href="packageOrder.html";
		 })
	}
})


