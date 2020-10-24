from __future__ import unicode_literals
import json
import time
from datetime import datetime, timedelta
import re, os
from PIL import Image
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from collections import  OrderedDict
from . import models

# Create your views here.
from django.http import HttpResponse, response


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


@require_http_methods(["GET"])
def login(request):
    print("login", request.method)
    print(request.POST)
    xx = models.Login.objects
    # for i in xx.all():
    #     print(i.user, i.pwd)
    # print(request.COOKIES)
    return render(request, 'login.html')


@require_http_methods(["POST"])
def login_user(request):
    print("login_user")
    if request.method == 'POST':
        # print(request.POST)
        user = request.POST.get("user")
        pwd = request.POST.get("pwd")
        login_models = models.Login.objects
        can_login = 0  # 默认不能登录
        for table in login_models.all():  # 遍历数据库的table
            if user == table.user:
                if pwd == table.pwd:
                    can_login = 1  # 用户密码一致
                    request.session['user'] = user
                    break
        # print(request.session)
        return HttpResponse(json.dumps({"can_login": can_login}))


@require_http_methods(["POST"])
def register_user(request):
    print(request.method)
    if request.method == 'POST':
        register_user = request.POST.get("user")
        register_pwd = request.POST.get("pwd")
        # register_email = request.POST.get("email")
        print("register_user", register_user)
        print("register_pwd", register_pwd)
        if register_user == "":
            msg = "用户名不能为空"
            return HttpResponse(json.dumps({"commit": 0, "msg": msg}))  # 不需要刷新
        if register_pwd == "":
            msg = "密码不能为空"
            return HttpResponse(json.dumps({"commit": 0, "msg": msg}))  # 不需要刷新
        # print("register_email", register_email)
        login_models = models.Login.objects
        register_list_models = models.RegisterList.objects
        for table in login_models.all():  # 遍历数据库的table
            # print(table.user)
            if register_user == table.user:
                msg = "用户名已存在"
                return HttpResponse(json.dumps({"commit": 0, "msg": msg}))  # 不需要刷新
        # 用户名不存在,写入注册列表
        register_list_models.create(
            register_user=register_user,
            register_pwd=register_pwd
        )
        msg = "注册申请已提交,请联系管理员"
        return HttpResponse(json.dumps({"commit": 1, "msg": msg}))  # 不需要刷新


@require_http_methods(["GET", "POST"])
def log_out(request):
    user = request.session['user']
    print(user)
    if user:
        request.session['user'] = None
        print(request.session['user'])
        return redirect('/zone/yzc/')
    else:
        return redirect('/zone/login/')


def navigation(request):
    # print("navigation")
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        return render(request, 'navigation.html', {
            'user': json.dumps({"user": user})
        })


@require_http_methods(["GET", "POST"])
def yzc(request):
    user = request.session.get('user')
    print("当前登录用户：", user)
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        time_ymd_today = datetime.now().strftime("%Y-%m-%d")
        print(time_ymd_today)
        visit_information_models = models.VisitInformation.objects
        sign_models = models.Sign.objects
        sign_refresh_models = models.SignRefresh.objects
        # 处理访问人数
        id = visit_information_models.last().id  # 最后一行的id
        visit_date = visit_information_models.last().date  # 最后一行的日期
        visit_times_today = visit_information_models.last().visit_times_today
        visit_times_all = visit_information_models.last().visit_times_all
        # print(visit_date)
        if visit_date == time_ymd_today:  # 最近一天的日期记录与今天日期一致
            visit_information_models.filter(id=id).update(  # 最后一行更新
                visit_times_today=visit_times_today + 1,
                visit_times_all=visit_times_all + 1,
            )
        else:  # 最近一天的日期记录与今天日期不一致
            visit_information_models.create(  # 新增一行
                date=time_ymd_today,
                visit_times_today=1,
                visit_times_all=visit_times_all + 1
            )
        visit_date = visit_information_models.last().date  # 最后一行的日期
        visit_times_today = visit_information_models.last().visit_times_today
        visit_times_all = visit_information_models.last().visit_times_all
        # 处理签到刷新
        # print(sign_refresh_models.filter(id=1))
        for sign_refresh_obj in sign_refresh_models.filter(id=1):
            sign_refresh_time = sign_refresh_obj.sign_refresh_time  # 得到签到刷新时间
            # print("sign_refresh_time", sign_refresh_time)
            if sign_refresh_time == time_ymd_today:  # 签到刷新日期是今天,不用处理
                pass
            else:
                for obj in sign_models.all():
                    obj.is_sign_today = False
                    obj.save()
                for refresh_obj in sign_refresh_models.filter(id=1):
                    refresh_obj.sign_refresh_time = time_ymd_today
                    refresh_obj.save()
        # 查询签到返回字典
        sign_tag = 0  # 循环标记
        dict_sign_all = {}
        for sign_models_object in sign_models.all():  # 把数据循环一遍成字典
            sign_tag += 1
            # print(sign_models_object)
            # print(sign_models_object.sign_user)
            # print(sign_models_object.is_sign_today)
            # print(sign_models_object.sign_total)
            # print(sign_models_object.sign_continuous)
            # print(sign_models_object.sign_last_time)
            # print(type(sign_models_object.sign_last_time))
            dict_sign = {"sign_user": sign_models_object.sign_user, "is_sign_today": sign_models_object.is_sign_today,
                         "sign_total": sign_models_object.sign_total,
                         "sign_continuous": sign_models_object.sign_continuous,
                         "sign_last_time": sign_models_object.sign_last_time}
            # print(dict_sign)
            dict_sign_all.update({"sign_" + str(sign_tag): dict_sign})
        # print(dict_sign_all)
        return render(request, 'yzc.html', {
            'visit_times': json.dumps(
                {'user': user, 'visit_times_all': visit_times_all, 'visit_times_today': visit_times_today}),
            'sign': json.dumps(dict_sign_all)
        })


def yzc_sign(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        sign_models = models.Sign.objects
        # print(sign_models.all())
        time_ymd_today = datetime.now().strftime("%Y-%m-%d")
        time_ymd_yesterday = (datetime.now() + timedelta(days=-1)).strftime("%Y-%m-%d")
        # print("time_ymd_today", time_ymd_today)
        # print("time_ymd_yesterday", time_ymd_yesterday)
        sign_filter = sign_models.filter(sign_user=user)
        # print(sign_filter)
        if sign_filter.exists():  # 判断数据里是否有这个用户
            for i in sign_filter:
                sign_user = i.sign_user
                is_sign_today = i.is_sign_today  # 该用户今天是否签到
                sign_total = i.sign_total
                sign_continuous = i.sign_continuous
                sign_last_time = i.sign_last_time
            if is_sign_today is True and sign_last_time == time_ymd_today:  # 今天已签到和最后签到日期为
                msg = "今天已签到"
                return HttpResponse(json.dumps({"refresh": 0, "msg": msg}))  # 不需要刷新
            else:
                # print(sign_last_time)
                if sign_last_time == time_ymd_yesterday:  # 最后签到时间是昨天
                    sign_models.filter(sign_user=user).update(
                        is_sign_today=True,
                        sign_total=sign_total + 1,
                        sign_continuous=sign_continuous + 1,
                        sign_last_time=time_ymd_today
                    )
                    return HttpResponse(json.dumps({"refresh": 1}))  # 需要刷新
                else:  # 最后签到时间不是昨天
                    sign_models.filter(sign_user=user).update(
                        is_sign_today=True,
                        sign_total=sign_total + 1,
                        sign_continuous=1,
                        sign_last_time=time_ymd_today
                    )
                    return HttpResponse(json.dumps({"refresh": 1}))  # 需要刷新
        else:  # 签到数据没有这个用户
            sign_models.create(  # 新增一行
                sign_user=user,
                is_sign_today=True,
                sign_total=1,
                sign_continuous=1,
                sign_last_time=time_ymd_today
            )
            is_sign_today = False  # 没有该用户，当然今日没签到
            return HttpResponse(json.dumps({"refresh": 1}))  # 需要刷新


@require_http_methods(["POST"])
def register_apply(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        if user != "yzc":
            msg = "暂无权限"
            return HttpResponse(json.dumps({"can_show": 0, "msg": msg}))
        else:
            register_list_models = models.RegisterList.objects
            dict_register_all = {}
            for table in register_list_models.all():
                # print(table.id)
                # print(type(table.id))
                # print(table.register_user)
                # print(table.register_pwd)
                dict_register = {"id": table.id, "register_user": table.register_user,
                                 "register_pwd": table.register_pwd}
                dict_register_all.update({"register_" + str(table.id): dict_register})
            # print(dict_register_all)
            return HttpResponse(json.dumps({"can_show": 1, "dict_register_all": dict_register_all}))


@require_http_methods(["POST"])
def register_pass(request):
    global register_user
    global register_pwd
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        register_id = request.POST.get("id")
        register_list_models = models.RegisterList.objects
        login_models = models.Login.objects
        # print(register_list_models.filter(id=register_id))
        for i in register_list_models.filter(id=register_id):  # 取出注册的账号密码
            register_user = i.register_user
            register_pwd = i.register_pwd
        for table in login_models.all():  # 遍历login数据库的table
            if register_user == table.user:
                msg = "用户名已存在"
                return HttpResponse(json.dumps({"pass": 0, "msg": msg}))
        login_models.create(
            user=register_user,
            pwd=register_pwd
        )
        register_list_models.filter(id=register_id).delete()
        msg = "已通过" + register_user + "注册"
        return HttpResponse(json.dumps({"pass": 1, "msg": msg}))


@require_http_methods(["POST"])
def register_clear(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        register_id = request.POST.get("id")
        # print(register_id)
        register_list_models = models.RegisterList.objects
        register_list_models.filter(id=register_id).delete()
        return HttpResponse(json.dumps({"clear": 1}))


def six(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        return render(request, '66.html')


def seven(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        return render(request, '777.html')


def journal(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        return render(request, 'journal.html')


def message(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        return render(request, 'message.html')


def message_json(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        leavemessage_models = models.LeaveMessage.objects
        floor = leavemessage_models.count()  # 表的总条数
        message_list = []  # 存放message的json数据
        for i in leavemessage_models.all():
            message_dict = OrderedDict()
            # print(i.leave_message_username)
            message_dict["user"] = i.leave_message_username
            # print(i.leave_message_text)
            message_dict["text"] = i.leave_message_text
            # print(i.leave_message_time)
            message_dict["date"] = i.leave_message_time
            message_list.append(message_dict)
        # print(message_list)
        return HttpResponse(json.dumps(message_list))


def message_send(request):
    user = request.session.get('user')
    if not user:
        return redirect('/zone/login/')
    else:
        user = request.session.get('user')  # 当前登录用户
        text_dict = request.POST.dict()  # 获取ajax的传入，为字典类型
        print(text_dict)
        for i in text_dict:
            text = i
            print(text)
        date = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        # print(date)
        leavemessage_models = models.LeaveMessage.objects
        leavemessage_models.create(  # 新增一行
            leave_message_username=user,
            leave_message_text=text,
            leave_message_time=date
        )
        # print(leavemessage_models.all())
        # message_list = []
        message_dict = {"user": user, "text": text, "date": date}  # 给前端回传参数
        floor = leavemessage_models.count()  # 表的总条数
        print(message_dict)
        # print(floor)
        return HttpResponse(json.dumps({"floor": floor, "user": user, "date": date}))


def message_delete(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        # 0为非自己的留言不可删除，1为可以删除
        can_delete = 0  # 默认不可删除
        floor_dict = request.POST.dict()  # 获取ajax的传入，为字典类型
        # print("floor_dict",floor_dict)
        # print(floor_dict.keys()) # 返回字典的keys
        floor = int(list(floor_dict.keys())[0]) + 1 # 从0开始，留言显示从1楼开始，所以要加1
        # print("floor",floor)
        leavemessage_models = models.LeaveMessage.objects
        floor_message = 1
        for i in leavemessage_models.all():
            if floor == floor_message:
                # print("i.id",i.id)
                id_message = i.id
                # print("i.leave_message_username",i.leave_message_username)
                user_message = i.leave_message_username
                # print("leave_message_text",i.leave_message_text)
                # print("i.leave_message_time",i.leave_message_time)
                break
            floor_message += 1
        if user_message == user:
            leavemessage_models.filter(id=id_message).delete()  # 根据id 删除
            can_delete = 1
        else:
            can_delete = 0
        return HttpResponse(json.dumps({"can_delete": can_delete}))


def picture(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        return render(request, 'picture.html')


def picture_upload(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    allow_type = ["jpg", "jpeg", "png", "bmp"]
    print(request.FILES)
    a = request.FILES
    pic = request.FILES.get('pic')
    print("pic", pic)
    print("pic.name", pic.name)
    print("pic.content_type", pic.content_type)
    pattern = re.compile(r"/(.*?)$")
    pic_type = pattern.search(pic.content_type).group()[1:]  # 上传文件的格式
    print("pic_type", pic_type)
    if pic_type in allow_type:
        basepath = os.path.dirname(__file__)  # 当前文件所在路径
        print(basepath)
        upload_path = basepath + '/static/pictures/picture_upload/' + user + '_' + str(int(time.time())) + '.' + \
                      pic.name.split('.')[-1]
        print(upload_path)
        Image.open(pic).save(upload_path)
        can_upload = 1
        msg = "上传成功"
    else:
        can_upload = 0
        msg = "只能上传jpg,jpeg,png,bmp格式的文件"
    return HttpResponse(json.dumps({"can_upload": can_upload, "msg": msg}))


def problem(request):
    user = request.session.get('user')
    if not user:  # session没有user
        return redirect('/zone/login/')
    else:
        return render(request, 'problem.html')
