from django.shortcuts import render
from django.views.generic import ListView, View
from .models import News, Comment
from .parsebd import parseBD
from user.models import Profile
from datetime import datetime
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy


class NewsList(ListView):
    model = News
    template_name = "newsletter/newslist.html"
    context_object_name = "news"
    
    def get_queryset(self):
        user_profile = Profile.objects.get(user=self.request.user)
        user_friends = user_profile.interlocutors.all()
        parseBD()
        queryset1 = News.objects.filter(user__in=user_friends)
        queryset2 = News.objects.filter(user__isnull=True)
        queryset = queryset1 | queryset2
        queryset = queryset.order_by("-date")
        return queryset


class NewsAdd(View):
    success_url = reverse_lazy('news')

    def post(self, request, *args, **kwargs):
        file = None
        if request.FILES:
            file = request.FILES.get('attached_file')
        content = request.POST.get('content')
        user = self.request.user
        date = datetime.now()
        News(user=user, content=content, date=date, attached_file=file).save()
        return HttpResponseRedirect(self.success_url)


class CommentAdd(View):
    success_url = reverse_lazy('chatlist')

    def post(self, request, id, *args, **kwargs):
        file = None
        if request.FILES:
            file = request.FILES.get('attached_file')
        news = News.objects.get(id=id)
        content = request.POST.get('content')
        user = self.request.user
        date = datetime.now()
        Comment(news=news, user=user, content=content, date=date, attached_file=file).save()
        return HttpResponseRedirect(self.success_url)