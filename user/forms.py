from django import forms
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from .models import User


class LoginForm(forms.Form):
    email=forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Почта'}),label='', )
    password=forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Пароль'}),label='')

    class Meta:
        model=User
        fields=("email","password")

    def clean(self):
        cleaned_data = super(LoginForm,self).clean() 
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            raise ValidationError('Пожалуйста, проверьте правильность написания почты и пароля.')
        return cleaned_data


class UserCreationForm(forms.Form):
    email=forms.EmailField(widget=forms.EmailInput(attrs={'placeholder':'Почта'}))
    password=forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Пароль'}),label='')

    class Meta:
        model = User
        fields = ("email", "password")

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("Данная почта используется другим пользователем")
        return email

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password)<4:
            raise ValidationError('Пожалуйста, введите пароль содержащий более 4 символов')
        return password