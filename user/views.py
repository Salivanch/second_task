from django.shortcuts import render
from django.views.generic import DetailView, View 
from .models import Profile, User
from .forms import LoginForm, UserCreationForm
from django.http import JsonResponse
from django.contrib.auth import login, authenticate


class ProfileDetail(DetailView):
    model = Profile


class Auntificate(View):
    template_name="authenticate.html"
    form_class = LoginForm

    def get(self, request):
        return render(request, self.template_name, self.get_context_data())
    
    def get_context_data(self, ctx={}, *args, **kwargs):
        ctx['login'] = LoginForm()
        ctx['reg'] = UserCreationForm()
        return ctx


class LoginView(View):
    def post(self, request, ans={}, *args, **kwargs):
        form = LoginForm(request.POST)
        if form.is_valid():
            email=form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = authenticate(email=email, password=password)
            if user is not None:
                login(request,user)
                ans["status"] = True
        else:
            ans['errors'] = form.errors
        return JsonResponse(ans)


class RegistrationView(View):
    def post(self, request, ans={}, *args, **kwargs):
        form = UserCreationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = User.objects.create(email=email, password=password)
            user.save()
            login(request,user)
            ans["status"] = True
        else:
            ans["errors"] = form.errors
        return JsonResponse(ans)
