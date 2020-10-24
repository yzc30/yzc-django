$(document).ready(function(){
    $("#pic_submit").click(function(){
        var pic = new FormData($("#pic_form")[0]);
        var file = $("#pic")[0].files[0];
//        console.log(pic);
//        console.log(file);
        if(file==undefined){
            window.alert("文件不能为空");
            return false;
        }
        $.ajax({
            url: "../picture_upload/",   //对应django中的路由
            type: "POST", //请求方法
            data: pic,   //传送的数据
            cache: false,//上传文件无需缓存
            processData: false,//用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须
            success: function (pic_json) {  //成功得到返回数据后回调的函数
                pic_json = JSON.parse(pic_json) //由JSON字符串转换为JSON对象
                if(pic_json["can_upload"]==0){
                    window.alert(pic_json["msg"]);
                }
                else{
                    window.alert(pic_json["msg"]);
//                    console.log($("#pic"));
                    document.getElementById('pic_form').reset();  // js 方法
                }
            }
        })
    })
})