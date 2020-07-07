var canScroll = true;

$(document).ready(function(){
    
    if($(".day").val() != "" && $(".money") ){
        setDailySalary();
    }
        
    var pathes = $('path');
    pathes.each(function( i, path ) {
        // 1번 부분
        var total_length = path.getTotalLength();

        // 2번 부분
        path.style.strokeDasharray = total_length + " " + total_length;

        // 3번 부분
        path.style.strokeDashoffset = total_length;

        // 4번 부분
        $(path).animate({
            "strokeDashoffset" : 0
        }, 1500);
    });

    //급여일 입력-keypress
    $(".day").on("keypress", function(event){
        //입력 2글자 이상 입력 제한
        if ($(this).val().length >= 2){
            event.preventDefault();
            return false;
        }
    });
    
    //급여일 입력-keyup
    $(".day").on("keyup", function(event){
        var width = 0;
        
        if($(this).val() >= 31){
            $(this).val(31);
        }
        
        //날짜 입력이 안되어 있을 때 : placeholder 기준으로 폭을 맞춘다
        //날짜 입력이 되어 있을 때 : 날짜값을 기준으로 폭을 맞춘다
        width = $(this).val().trim() == "" ? getVirtualDomWidth($(this).attr("placeholder")) :
                                             getVirtualDomWidth($(this).val().trim());    
        
        $(this).css("width", width+10);    
    });
    
    //급여일, 월급 실수령액 변경 이벤트
    $(".day, .money").on("keyup", function(){
         setDailySalary();
    });
    
    function setDailySalary(){
           if( $(".day").val().trim() != "" && $(".money").val().trim() != "" ){
            
            //일, 월급여 계산
            setInterval(function(){

                //일수 계산
                var currentDt = new Date();
                var currentHour = currentDt.getHours();
                var currentMonthDt = currentDt.setDate($(".day").val());
                
                var prevMonthDt = currentDt.setMonth(currentDt.getMonth() - 1);
                var totalMinutes = currentMonthDt-prevMonthDt;
                var untilTodayMinutes = Date.now() - prevMonthDt;
                //console.log("untilTodayMinutes : ", untilTodayMinutes, " / totalMinutes : ", totalMinutes, " / untilTodayMinutes/totalMinutes : ", untilTodayMinutes/totalMinutes);
                
                var days = totalMinutes/1000/60/60/24;
                var hour_8 = 8*60*60;
                
                var salaryDaily = Math.round($(".money").val().replace(/,/g, "")/days);
                var salaryMonthly = Math.round($(".money").val().replace(/,/g, ""));
                
                var startWorkHour = 9;
                var workTime = 0;
                
                if(currentHour < 9 ){
                    $("#beforeWork").html("(근무전 입니다)");
                }
                else if(currentHour < 12 ){
                    workTime = (currentHour-startWorkHour)*60*60 + currentDt.getMinutes()*60 + currentDt.getSeconds();
                    workTime = workTime <= 0 ? 0 : workTime;
                }
                else if(currentHour == 12 ){
                    workTime = (currentHour-startWorkHour)*60*60;    
                }
                else if(currentHour > 12 ){
                    workTime = (currentHour-startWorkHour-1)*60*60 + currentDt.getMinutes()*6 + currentDt.getSeconds();    
                }
                
                var currentSalary = Math.round(salaryDaily*workTime/hour_8);
                var currentMonthlySalary = Math.round(salaryMonthly*untilTodayMinutes/totalMinutes + currentSalary);
                
                var fmtcurrentSalary = new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format(currentSalary);
                var fmtcurrentMonthlySalary = new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format(currentMonthlySalary);
                
                $("#dailySalaryGage progress").val(workTime/hour_8);
                $("#dailySalaryGage span").html( (workTime*100/hour_8).toFixed(2) + "%");
                
                $("#monthlySalaryGage progress").val(untilTodayMinutes/totalMinutes);
                $("#monthlySalaryGage span").html( (untilTodayMinutes*100/totalMinutes).toFixed(2) + "%");
                                               
                //console.log("workTime : ", workTime, " / hour_8 :", hour_8);
                //console.log( new Date(currentMonthDt), " / ", new Date(prevMonthDt), " / ", days, " : ", Math.round($(".money").val().replace(/,/g, "")/days));
                
                $("#dailySalary").html(fmtcurrentSalary);
                $("#monthlySalary").html(fmtcurrentMonthlySalary);
            }, 1000);
        }
        else
            $("#sec3").css("display", "none");
    }
    
    
    //실수령액 입력-keypress
    $(".money").on("keypress", function(event){
        
        var re = /^[0-9]+$/;
        var money = $(this).val().replace(/,/g, "") + '' + event.key
        var right = re.test(money);
        
        if(right == false || money > 10000000000000000){
            event.stopPropagation();
            return false;
        }
    });
    
    //실수령액 입력-keyup
    $(".money").on("keyup", function(event){
        var fmtNumber = new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format($(this).val().replace(/,/g, ""));
        
        width = fmtNumber.trim() == "" ? getVirtualDomWidth($(this).attr("placeholder")) :
                                         getVirtualDomWidth(fmtNumber);
        
        $(this).val(fmtNumber);
        $(this).css("width", width+25);
    });
    
    $(document).keydown(function(event){
        
        if(event.keyCode == 33 || event.keyCode == 34){
            event.preventDefault();
            event.stopPropagation();
            
            //키 이벤트로 페이지 스크롤 제어
            var scrHeight = window.innerHeight;
            var currentScr = window.pageYOffset;
            var no_of_sec = $("section").length;

            var currentIdx = Math.ceil(currentScr / scrHeight) + 1; 
            console.log("currentIdx : ", currentIdx, " / currentScr : ", currentScr, " / scrHeight : ", scrHeight );

            //key up
            if(event.keyCode == 33){
                gotoSec(getPrevSec(no_of_sec, currentIdx));
            }

            //key down
            else if(event.keyCode == 34){
                gotoSec(getNextSec(no_of_sec, currentIdx));
            }
        }
    });
    

    $(".sec").on("mousewheel", function(event){
        event.preventDefault(); 
        
        //mousewheel의 종료 시점은 알수가 없다.
        if(canScroll == true){
            canScroll = false;
            console.log("can scroll");
        }
        else{
            console.log("can't scroll");
            return false;
        }

        var no_of_sec = $("section").length;
        var idx = $(this).data("idx");
        
        //스크롤-내리기
        if(event.originalEvent.wheelDelta <= 0){
            console.log("down");
            gotoSec(getNextSec(no_of_sec, idx));
        }
        //스크롤-올리기
        else if(event.originalEvent.wheelDelta > 0) {
            console.log("upper");
            gotoSec(getPrevSec(no_of_sec, idx));
        }
        setTimeout(function(){
            canScroll = true;
            console.log("setTimeout");
        }, 700);
        
    });
});


function getVirtualDomWidth(value){
    $("body").append("<div id='virtual_dom'>" + value + "</div>");
    var width = $("#virtual_dom").width();
    $("#virtual_dom").remove();
    
    //console.log("width : ", width);
    
    return (width);
}

function getNextSec(no_of_sec, idx){
    if(no_of_sec == idx)
        return false;
    else
        return idx+1;
}

function getPrevSec(no_of_sec, idx){
    if(1 == idx)
        return false;
    else
        return idx-1;
}

function gotoSec(idx){
    
    if(idx == false)
        return false;
    
    console.log("gotoSec : ", idx);
    console.log("top : ",  $(".sec[data-idx=" + idx + "]").offset().top);

    //급여일과 월급 실수령액이 입력되지 않을경우 3페이지는 넘어가지 못한다
    if(idx == 3 && ($(".day").val() == "" || $(".money").val() == "" )){
        console.log("day : ", $(".day").val(), " / money : ", $(".money").val());
        return false;
    }
    
    $("body").stop().animate({
        scrollTop: $(".sec[data-idx=" + idx + "]").offset().top + "px"
    },
    { duration: 250, complete: function(){}});
}