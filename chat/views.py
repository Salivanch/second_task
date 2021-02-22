from django.shortcuts import render
from django.views.generic import View, ListView, DeleteView
from .models import Chat, Message
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from datetime import datetime
from .service import get_users
from django.http import JsonResponse
from user.models import User
from django.contrib.auth.mixins import LoginRequiredMixin


class ChatDetail(DeleteView):
    model = Chat
    template_name = "chat/chatdetail.html"
    context_object_name = 'chat'


class ChatList(LoginRequiredMixin, View):
    model = Chat
    template_name = "chat/chatlist.html"
    context_object_name = 'chats'

    def get(self, request):
        ctx = self.get_context_data() 
        return render(request, self.template_name, ctx)   

    def get_queryset(self):
        queryset = self.model.objects.filter(members__in=[self.request.user])
        queryset = queryset.order_by('-last_message')
        return queryset

    def get_context_data(self, ctx={}):
        ctx['chats'] = self.get_queryset()
        return ctx


class FindChat(ChatList):
    def get_queryset(self):
        chat = self.request.GET.get("title")
        queryset1 = self.model.objects.filter(title=chat, members__in=[self.request.user])
        chat_list = chat.split(" ")
        queryset2 = self.model.objects.filter(members__first_name=chat[0], members__last_name=chat[1],members__in=[self.request.user])
        queryset = queryset1 | queryset2
        return queryset


class ActionChat(View):
    success_url = reverse_lazy('chatlist')

    def get(self, request, id, move, ans={}):
        try:
            chat = Chat.objects.get(id=id)
        except Exception:
            return JsonResponse(ans)
        members = chat.members.all()
        if move == "members_list":
            ans = get_users(members)
        elif move == "members_add_list":
            members_ids = [pk.id for pk in members]
            profile = self.request.user.profile
            friends = profile.interlocutors.all()
            possible = friends.exclude(id__in=members_ids)
            ans = get_users(possible)
        return JsonResponse(ans)

    def post(self, request, id, move, *args, **kwargs):
        try:
            chat = Chat.objects.get(id=id)
        except Exception:
            return HttpResponseRedirect(self.success_url)  
        file = None
        if request.FILES:
            file = request.FILES.get('attached_file')
        content = request.POST.get('content')
        user = self.request.user
        Message(recipient=chat, sender=user, content=content, attached_file=file).save()
        chat.last_message = datetime.now()
        chat.save()
        return HttpResponseRedirect(self.success_url)   


class ActionMembers(View):
    def get(self, request, id, move, user_id, ans={}):
        try:
            chat = Chat.objects.get(id=id)
        except Exception:
            return JsonResponse(ans)
        if move=="remove_user":
            user = User.objects.get(id=user_id)
            chat.members.remove(user)
            chat.save()
            if chat.members.count == 0:
                chat.remove()
        if move=="add_user":
            user = User.objects.get(id=user_id)
            chat.members.add(user)
            chat.save()
        return JsonResponse(ans)