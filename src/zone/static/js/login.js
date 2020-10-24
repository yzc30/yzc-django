$(document).ready(function(){
    //首先需要禁止form表单的action自动提交
    $("#login_btn").click(function(){
        $.ajax({
            url:"../login_user/",
            type:'POST',
            data: {
                "user":$("#login_user").val(),
                "pwd":$("#login_pwd").val(),
            },
            dataType: "json", //传送的数据类型
            success:function (a) {
                if(a["can_login"]==1){
                    window.location.replace("../yzc");
                }
                else{
                    window.alert("用户名或密码错误")
                }
            }
        });
    });

    $("#register_visibility").click(function(){
        $("#register_div").toggle();
    });

    $("#register_btn").click(function(){
        $.ajax({
            url:"../register_user/",
            type:'POST',
            data: {
                "user":$("#register_user").val(),
                "pwd":$("#register_pwd").val(),
//                "email":$("#register_email").val(),
            },
            dataType: "json", //传送的数据类型
            success:function (register_msg) {
//                register_msg = JSON.parse(register_msg); //由JSON字符串转换为JSON对象
                if(register_msg["commit"] == 0){
//                 console.log(sign_msg)
                   window.alert(register_msg["msg"]);
                }
                else{
                    $("#register_user").val("");
                    $("#register_pwd").val("");
                    window.alert(register_msg["msg"]);
                }
            }
        });
    });

});
