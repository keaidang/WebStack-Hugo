//关键词sug
var hotList = 0;
$(function() {
    // 关闭外部联想：仅在输入时隐藏建议列表
    $('#search-text').keyup(function() {
        var keywords = $(this).val();
        if (keywords == '') { $('#word').hide(); return };
        $('#word').hide();
    })

    //点击搜索数据复制给搜索框
    $(document).on('click', '#word li', function() {
        var word = $(this).text().replace(/^[0-9]/, '');
        $('#search-text').val(word);
        $('#word').empty();
        $('#word').hide();
        //$("form").submit();
         $('.submit').trigger('click');//触发搜索事件
    })
    //$(document).on('click', '.container,.banner-video,nav', function() {
    $(document).on('click', '.io-grey-mode', function() {
        $('#word').empty();
        $('#word').hide();
    })

})
