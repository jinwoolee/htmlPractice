/*
    --allow-file-access-from-files
*/
$(document).ready(function () {
    $("nav li").on("click", function () {

        $("#container").css("max-width", "100%");

        $("nav li").removeClass("on");
        $(this).addClass("on");
        var id = $(this).data("rol");

        $(".content").removeClass("prev this next");

        $("#" + id).addClass("this").prevAll().addClass("prev");
        $("#" + id).nextAll().addClass("next");
    });

    $(".logo_box").on("click", function () {
        $("nav li").removeClass("on");
        $(".content").removeClass("prev this next");
        $("#container").css("max-width", "1200px");
    });
    
    $(".roll_left").on("click", function(){
       $(".book_roll li").eq(0).insertAfter(".book_roll li:last-child");
    });
    
    $(".roll_right").on("click", function(){
       $(".book_roll li").eq(-1).insertBefore(".book_roll li:first-child");
    });
    
    $(".book_roll li").on("click", function(){
        var _this = $(this);
        var liurl = _this.data("url");
        $(".notebook").html();
        
        $.ajax({
            type: 'get',
            url: liurl,
            datatype: 'html',
            success: function(data){
               $(".notebook").html(data);
            },
            error: function(e){
                console.log(e);
            }
        });
    });
    
    $(".accordio_box ol li").on("click", function(){
        $(".accordio_box ol li").removeClass("on")
        $(this).addClass("on");
    });
    
    $(".close").on("click", function(){
       $(".thankyou_message").css("display", "none");
    });
    
    $("#container").addClass("start");
});
