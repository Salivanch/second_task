from django.urls import path
from .views import ProfileDetail, Auntificate, LoginView, RegistrationView, InFriend
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('profile/<slug>', ProfileDetail.as_view(), name="profile"),
    path('in-friend/<int:user_id>', InFriend.as_view(), name="in-friend"),
    path('auntificate', Auntificate.as_view(), name="auntificate"),
    path('auntificate/login', LoginView.as_view(), name="login"),
    path('auntificate/logout', LogoutView.as_view(next_page='auntificate'), name='logout'),
    path('auntificate/reg', RegistrationView.as_view(), name='reg'),
]