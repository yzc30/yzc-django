$(document).ready(function(){
    $.getJSON("json/problem",function(data){
        for(var i=0,l=data.length;i<l;i++){
        if(l>0){
            $("#problem_content").append("<div id='problem_content_"+i+"'></div>")
            for(var key in data[i]){
//                console.log(data[i])
                if(key=="title"){
                    $("#problem_content_"+i).append("<p>"+"标题:"+data[i][key]+"</p>")
                }
                if(key=="content"){
                    a = data[i][key].replace(/(\r\n|\n|\r)/gm, "<br/>")
//                    console.log(a)
                    $("#problem_content_"+i).append("<p>"+a+"</p>")
                }
        }
        }
        }
     });

    $("#problem_write_btn").click(function(){
        var title = $("#problem_write_title").val();
        var content = $("#problem_write_content").val();
        var data= {
            data: JSON.stringify({
                'title': title,
                'content': content
            }),
        };
        $.ajax({

            url: "/problem/submit",   //对应flask中的路由
            type: "POST", //请求方法
            data: data,   //传送的数据
            dataType: "json", //传送的数据类型
            success: function (data_problem) {  //成功得到返回数据后回调的函数
                window.location.reload() //刷新页面
            }
        })
    })
});