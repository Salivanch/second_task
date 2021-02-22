from django.urls import path
from .views import NewsList, NewsAdd, CommentAdd


urlpatterns = [
    path('', NewsList.as_view(), name="news"),
    path('news-create', NewsAdd.as_view(), name="news-create"),
    path('comment-create/<int:id>', CommentAdd.as_view(), name="comment-create"),
]