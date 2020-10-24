$(document).ready(function(){
        $.getJSON("../message_json",function(data){
             for(var i=0,l=data.length;i<l;i++){
                if(l>0){
                    $("#message_content").prepend("<div id='message_content_"+i+"'></div>")
                    $("#message_content_"+i).append("<p style='display:inline;margin:0px 10px 0px 0px'>"+(i+1)+"楼"+"</p>")
                    $("#message_content_"+i).append("<button id='message_delete_"+i+"'class='delete'>删除</button>")
                    for(var key in data[i]){
                        if(key=="user"){
                            $("#message_content_"+i).append("<p>"+"用户名:"+data[i][key]+"</p>")
                        }
                        if(key=="text"){
                            message1 = face_replace(data[i][key])
                            $("#message_content_"+i).append("<p>"+"留言内容:"+message1+"</p>")
                        }
                        if(key=="date"){
                            $("#message_content_"+i).append("<p>"+"留言时间:"+data[i][key]+"</p>")
                        }
                }
                }
             }
        });


        $(document).click(function (e) {
            var drag = $("#face_div")
            var dragel = $("#face_div")[0]
            var target = e.target;
            if (dragel != target && !$.contains(dragel, target)) {
                drag.css({"display":"none"});
            }
        });

        $("#message_send").click(function(xxx){
            var message = $("#message").val()
            if(message==""){
                window.alert("留言内容不能为空");
                return false;
            }
            else{
                $.ajax({
                    url: "../message_send",   //对应django的url
                    type: "POST", //请求方法
                    data: message,   //传送的数据
                    dataType: "json", //传送的数据类型
                    success: function (message_json) {  //成功得到返回数据后回调的函数
                        $("#message").val("")
                        $("#message_content").prepend("<div id='message_content_"+(message_json["floor"]-1)+"'></div>")
                        $("#message_content_"+(message_json["floor"]-1)).append("<p style='display:inline;margin:0px 10px 0px 0px'>"+message_json["floor"]+"楼"+"</p>");
                        $("#message_content_"+(message_json["floor"]-1)).append("<button id='message_delete_"+(message_json["floor"]-1)+"'class='delete'>删除</button>");
                        $("#message_content_"+(message_json["floor"]-1)).append("<p>"+"用户名:"+message_json["user"]+"</p>");
                        message1 = face_replace(message)
                        $("#message_content_"+(message_json["floor"]-1)).append("<p>"+"留言内容:"+message1+"</p>");
                        $("#message_content_"+(message_json["floor"]-1)).append("<p>"+"留言时间:"+message_json["date"]+"</p>");
                    }
                })
            }
        });

        $("body").on('click','.delete',function(){
            var id_index = $(this).attr('id').replace(/[^0-9]/ig,"")
                $.ajax({
                    url: "../message_delete",   //对应django的url
                    type: "POST", //请求方法
                    data: id_index,   //传送的数据
                    dataType: "json", //传送的数据类型
                    success: function (delete_json) {  //成功得到返回数据后回调的函数
                        if(delete_json["can_delete"]==0){
                            window.alert("只能删除自己的留言哦")
                        }
                        else{
                            window.location.reload() //刷新页面
                        }
                    }
                })
        });

        $("#message_clear").click(function(){
            $("#message_clear_div").toggle();
        });

        $("#message_clear_submit").click(function(){
            var pwd = $("#message_clear_password").val()
                $.ajax({
                    url: "/message/clear",   //对应django的url
                    type: "POST", //请求方法
                    data: pwd,   //传送的数据
                    dataType: "json", //传送的数据类型
                    success: function (clear_json) {  //成功得到返回数据后回调的函数
                        if(clear_json["clear_result"]==1){
                            window.location.reload() //刷新页面
                        }
                        else{
                            window.alert("请输入正确的密码")
                        }
                    }
                })
        });

        function face_replace(str){
            var path = "/static/img/tieba_face/"
            // {% static 'img/tieba_face/hehe.png' %}
            str = str.replace("[#啊]", "<img src='" + path + "a.png'/>")
				.replace("[#爱你]", "<img src='" + path + "aini.png'/>")
					.replace("[#爱心]", "<img src='" + path + "aixin.png'/>")
					.replace("[#鄙视]", "<img src='" + path + "bishi.png'/>")
					.replace("[#不高兴]", "<img src='" + path + "bugaoxing.png'/>")
					.replace("[#彩虹]", "<img src='" + path + "caihong.png'/>")
					.replace("[#茶杯]", "<img src='" + path + "chabei.png'/>")
					.replace("[#大拇指]", "<img src='" + path + "damuzhi.png'/>")
					.replace("[#蛋糕]", "<img src='" + path + "dangao.png'/>")
					.replace("[#灯泡]", "<img src='" + path + "dengpao.png'/>")
					.replace("[#乖]", "<img src='" + path + "guai.png'/>")
					.replace("[#haha]", "<img src='" + path + "haha.png'/>")
					.replace("[#汗]", "<img src='" + path + "han.png'/>")
					.replace("[#呵呵]", "<img src='" + path + "hehe.png'/>")
					.replace("[#黑线]", "<img src='" + path + "heixian.png'/>")
					.replace("[#呼]", "<img src='" + path + "hu.png'/>")
					.replace("[#滑稽]", "<img src='" + path + "huaji.png'/>")
					.replace("[#花心]", "<img src='" + path + "huaxin.png'/>")
					.replace("[#惊哭]", "<img src='" + path + "jingku.png'/>")
					.replace("[#惊讶]", "<img src='" + path + "jingya.png'/>")
					.replace("[#开心]", "<img src='" + path + "kaixin.png'/>")
					.replace("[#酷]", "<img src='" + path + "ku.png'/>")
					.replace("[#狂汗]", "<img src='" + path + "kuanghan.png'/>")
					.replace("[#泪]", "<img src='" + path + "lei.png'/>")
					.replace("[#冷]", "<img src='" + path + "leng.png'/>")
					.replace("[#礼物]", "<img src='" + path + "liwu.png'/>")
					.replace("[#玫瑰]", "<img src='" + path + "meigui.png'/>")
					.replace("[#勉强]", "<img src='" + path + "mianqiang.png'/>")
					.replace("[#怒]", "<img src='" + path + "nu.png'/>")
					.replace("[#ok]", "<img src='" + path + "ok.png'/>")
					.replace("[#喷]", "<img src='" + path + "pen.png'/>")
					.replace("[#钱]", "<img src='" + path + "qian.png'/>")
					.replace("[#钱币]", "<img src='" + path + "qianbi.png'/>")
					.replace("[#弱]", "<img src='" + path + "ruo.png'/>")
					.replace("[#胜利]", "<img src='" + path + "shengli.png'/>")
					.replace("[#生气]", "<img src='" + path + "shengqi.png'/>")
					.replace("[#睡觉]", "<img src='" + path + "shuijiao.png'/>")
					.replace("[#太开心]", "<img src='" + path + "taikaixin.png'/>")
					.replace("[#太阳]", "<img src='" + path + "taiyang.png'/>")
					.replace("[#吐]", "<img src='" + path + "tu.png'/>")
					.replace("[#吐舌]", "<img src='" + path + "tushe.png'/>")
					.replace("[#委屈]", "<img src='" + path + "weiqu.png'/>")
					.replace("[#笑眼]", "<img src='" + path + "xiaoyan.png'/>")
					.replace("[#星星月亮]", "<img src='" + path + "xingxingyueliang.png'/>")
					.replace("[#心碎]", "<img src='" + path + "xinsui.png'/>")
					.replace("[#咦]", "<img src='" + path + "yi.png'/>")
					.replace("[#阴险]", "<img src='" + path + "yinxian.png'/>")
					.replace("[#音乐]", "<img src='" + path + "yinyue.png'/>")
					.replace("[#疑问]", "<img src='" + path + "yiwen.png'/>")
                    .replace("[#真棒]", "<img src='" + path + "zhenbang.png'/>");
			return str;
            };

        $(".img_face").click(function(){
            var text1 = $("#message").val();
            cursor_pos = $("#message").get(0).selectionStart;  // 获得光标的位置
            len = text1.length;
            face_alt = $(this).attr("alt")
            face_len = face_alt.length + 3
            text2 = text1.substr(0,cursor_pos)+"[#"+face_alt+"]"+text1.substr(cursor_pos,len);// 拼接
            $("#message").val(text2)
            document.getElementById("message").setSelectionRange(cursor_pos+face_len, cursor_pos+face_len);  // 设置光标位置 jquery 用不了setSelectionRange
            document.getElementById("message").focus();
            $("#face_div").css({"display":"none"});
        })

        $("#face").click(function(){
            var display = $("#face_div").css("display")
            if(display=="none"){
                var face_pos = $(this).offset().top;  // 按钮的位置
                var height = $(this).outerHeight()    // 按钮的高度
                var pos = (face_pos+height).toString()
                $("#face_div").css({"display":"block","top":pos+"px"});
                return false; // 为了不执行$(document).click(function (e)
            }
//            else{
//                $("#face_div").css({"display":"none"});
//            }
        })


});

