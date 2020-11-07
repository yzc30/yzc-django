from django.conf.urls import url
from django.urls import path
from . import views
from django.conf import settings ##新增1
from django.conf.urls.static import static ##新增2

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^auth/', views.auth),
    url(r'^login/', views.login),  # 配置当访问index/时去调用views下的index方法
    url(r'^login_user/', views.login_user),
    url(r'^logout/', views.log_out),
    url(r'^register_user/', views.register_user),
    url(r'^yzc/', views.yzc),
    url(r'^yzc_sign/', views.yzc_sign),
    url(r'^register_apply/', views.register_apply),
    url(r'^register_pass/', views.register_pass),
    url(r'^register_clear/', views.register_clear),
    url(r'^66/', views.six),
    url(r'^777/', views.seven),
    url(r'^journal/', views.journal),
    url(r'^message/', views.message),
    url(r'^message_json/', views.message_json),
    url(r'^message_send', views.message_send),
    url(r'^message_delete', views.message_delete),
    url(r'^picture/', views.picture),
    url(r'^picture_upload/', views.picture_upload),
    url(r'^problem/', views.problem),
    url(r'^navigation/', views.navigation)
]

# urlpatterns += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)