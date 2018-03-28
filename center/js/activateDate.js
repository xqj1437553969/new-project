$(function(){
    $iosDialog1 = $('#iosDialog1'),
    $('.reset-weui-dialog__btn').on('click', function(){
        $(this).parents('.js_dialog').fadeOut(200);
    });
    $('.x-btn').on('click', function(){
        $('.js_dialog').fadeOut(200);
    });
    $('#showIOSDialog1').on('click', function(){
        $iosDialog1.fadeIn(200);
    });
});
