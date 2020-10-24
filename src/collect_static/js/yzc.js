$(document).ready(function(){
    setInterval(function(){
        document.getElementById("nowTime").innerHTML = "当前时间:" + new Date();
    },1000);
//    console.log(visit_times);
        $("#sign").click(function(xxx){
            $.ajax({
                url: "../yzc_sign/",   //对应django中的路由
                type: "POST", //请求方法
//                    data: message,   //传送的数据
//                    dataType: "json", //传送的数据类型
                success: function (sign_msg) {  //成功得到返回数据后回调的函数
                    sign_msg = JSON.parse(sign_msg); //由JSON字符串转换为JSON对象
//                    console.log(sign_msg["is_sign_today"]);
                    if(sign_msg["refresh"] == 0){
    //                 console.log(sign_msg)
                       window.alert(sign_msg["msg"]);
                    }
                    else{
                        window.location.replace("../yzc");
                    }
                    }}
            )
        });

    var user=visit_times["user"];
    var visit_times_all=visit_times["visit_times_all"];
    var visit_times_today=visit_times["visit_times_today"];
//    console.log(sign);
    var values_sign = Object.values(sign);
//    console.log(values_sign);
    $("#nowTime").after("<p>今日访问量:"+visit_times_today+"</p><p>历史访问量:"+visit_times_all+"</p><p>"+user+"!<p>");
    $("#sign").after("<p></p>\
<table border='1'>\
    <tbody>\
      <tr id='sign_tr'>\
        <th>用户名</th>\
        <th>今日签到</th>\
        <th>累计签到</th>\
        <th>连续签到</th>\
        <th>最后签到日期</th>\
      </tr>\
    </tbody>\
</table>\
");
    for(count in values_sign){
//    console.log(values_sign[count])
        $("#sign_tr").after("<tr><th>"+values_sign[count]['sign_user']+"</th><th>"+values_sign[count]['is_sign_today']+"</th><th>"+values_sign[count]['sign_total']+"天</th><th>"+values_sign[count]['sign_continuous']+"天</th>\<th>"+values_sign[count]['sign_last_time']+"</th></tr>")
    };


    var register_apply_flag = true;
    $("#register_apply").click(function(xxx){
    if(register_apply_flag==true){
    register_apply_flag = false;
    $.ajax({
        url: "../register_apply/",   //对应django中的路由register_apply
        type: "POST", //请求方法
//                    data: message,   //传送的数据
//                    dataType: "json", //传送的数据类型
        success: function (register_msg) {  //成功得到返回数据后回调的函数
            register_msg = JSON.parse(register_msg); //由JSON字符串转换为JSON对象
//            console.log(register_msg["can_show"]);
            if(register_msg["can_show"] == 0){
//               console.log(register_msg["msg"]);
               window.alert(register_msg["msg"]);
            }
            else{
//               console.log(register_msg["dict_register_all"]);
               var object_register = Object.values(register_msg["dict_register_all"]);
//               console.log(object_register);
               $("#register_apply").after("<p></p>\
               <table border='0'>\
                    <tbody>\
                      <tr id='register_apply_tr'>\
                        <th>用户名</th>\
                        <th>密码</th>\
                        <th> </th>\
                        <th> </th>\
                      </tr>\
                    </tbody>\
                </table>\
               ");
               for ( i in object_register){
//                 console.log(i);
//                 console.log(object_register[i]);
                 $("#register_apply_tr").after("<tr id = 'register_tr_"+object_register[i]['id']+"'><th>"+object_register[i]['register_user']+"</th><th>"+object_register[i]['register_pwd']+"</th><th><button class='register_pass' id='register_pass_"+object_register[i]['id']+"'>通过</button></th><th><button class='register_clear' id='register_clear_"+object_register[i]['id']+"'>清除</button></th></tr>");
               }
            }
            }
            })
    }
    });


    $("body").on('click','.register_pass',function(){  // 通过class 点击
        var id_index = $(this).attr('id').replace(/[^0-9]/ig,"")
        $.ajax({
            url: "../register_pass/",   //对应django中的路由
            type: "POST", //请求方法
            data: {
                "id" : id_index
            },
            dataType: "json", //传送的数据类型
            success: function (pass_json) {  //成功得到返回数据后回调的函数
//                pass_json = JSON.parse(pass_json); //由JSON字符串转换为JSON对象
                if(pass_json["pass"]==1){
                    window.alert(pass_json["msg"]);
                    tr_remove = "#register_tr_"+id_index
//                    console.log(tr_remove)
                    $(tr_remove).remove();
                }
                else{
                    window.alert(pass_json["msg"]);
                }
            }
        })
    });


    $("body").on('click','.register_clear',function(){  // 通过class 点击
        var id_index = $(this).attr('id').replace(/[^0-9]/ig,"")
        $.ajax({
            url: "../register_clear/",   //对应django中的路由
            type: "POST", //请求方法
            data: {
                "id" : id_index
            },
            dataType: "json", //传送的数据类型
            success: function (pass_json) {  //成功得到返回数据后回调的函数
//                pass_json = JSON.parse(pass_json); //由JSON字符串转换为JSON对象
                if(pass_json["clear"]==1){
                    tr_remove = "#register_tr_"+id_index
//                    console.log(tr_remove)
                    $(tr_remove).remove();
                }
                else{
                    window.location.reload() //刷新页面
                }
            }
        })
    });





})



