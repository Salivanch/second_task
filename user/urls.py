from django.urls import path
from .views import ProfileDetail

urlpatterns = [
    path('profile/<slug>', ProfileDetail.as_view(), name="profile")
]