from django import forms
from django.contrib.auth import authenticate
# from django.core.exceptions import ValidationError
from .models import User


class LoginForm(forms.ModelForm):
    email_l=forms.EmailField(widget=forms.EmailInput(attrs={'placeholder':'введите почту'}),label='Почта', )
    password_l=forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'введите пароль'}),label='Пароль')

    class Meta:
        model=User
        fields=("email_l","password_l")

    def clean(self):
        cleaned_data = super(LoginForm,self).clean() 
        email_l = cleaned_data.get('email_l')
        password_l = cleaned_data.get('password_l')
        user = authenticate(email=email_l, password=password_l)
        if not user:
            raise forms.ValidationError('Пожалуйста, проверьте правильность написания почты и пароля.')
        return cleaned_data


class UserCreationForm(forms.ModelForm):
    email=forms.EmailField(widget=forms.EmailInput(attrs={'placeholder':'введите почту'}),label='Почта')
    password=forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'введите пароль'}),label='Пароль')

    class Meta:
        model = User
        fields = ("email", "password")

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Данная почта используется другим пользователем")
        return email

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password)<4:
            raise forms.ValidationError('Пожалуйста, введите пароль содержащий более 4 символов')
        return password