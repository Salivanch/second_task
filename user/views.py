from django.shortcuts import render
from django.views.generic import DeleteView
from .models import Profile


class ProfileDetail(DeleteView):
    model = Profile