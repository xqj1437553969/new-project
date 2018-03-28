$(function(){
	//确定取消弹出层
    $iosDialog1 = $('#iosDialog1'),
    $('.weui-dialog__btn').on('click', function(){
        $(this).parents('.js_dialog').fadeOut(200);
    });
    $('#showIOSDialog1').on('click', function(){
        $iosDialog1.fadeIn(200);
    });
});