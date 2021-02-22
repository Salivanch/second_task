from django.urls import path
from .views import ChatList, ChatDetail, ActionChat, ActionMembers, FindChat

urlpatterns = [
    path("", ChatList.as_view(), name="chatlist"),
    path("chat/<slug>", ChatDetail.as_view(), name="chatdetail"),
    path('find-chat', FindChat.as_view(), name="find-chat"),
    path("action-chat/<int:id>/<str:move>", ActionChat.as_view(), name="action-chat"),
    path("action-members/<int:id>/<str:move>/<int:user_id>", ActionMembers.as_view(), name="action-member"),
]