$(document).ready(function(){
    $("#guandeng").click(function(){
        var a = $("#guandeng_v").css('display');
        if(a == "none"){
            $("#guandeng").html("关灯▲");
            $("#guandeng_v").css('display','block');
        }
        else{
            $("#guandeng").html("关灯▼");
            $("#guandeng_v").css('display','none');
        }
    });
    $("#YAB").click(function(){
        var a = $("#YAB_v").css('display');
        if(a == "none"){
            $("#YAB").html("You Are Beautiful ▲");
            $("#YAB_v").css('display','block');
        }
        else{
            $("#YAB").html("You Are Beautiful ▼");
            $("#YAB_v").css('display','none');
        }
    });
});