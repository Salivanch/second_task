from django.db import models
from user.models import User
from user.service import slug_generator, slugify
from django.shortcuts import reverse


class Chat(models.Model):
    title = models.CharField("Название чата", max_length=30, default="Групповой чат", blank=True)
    photo = models.ImageField("Логотип чата", upload_to="chat", default="chat/logo.jpg", blank=True)
    members = models.ManyToManyField(User, verbose_name="Участники чата")
    slug = models.SlugField("Ссылка на чат", unique=True, blank=True)
    last_message = models.DateTimeField("Последнее сообщение", blank=True, null=True)
    was_group = models.BooleanField("Было больше 2-х пользователей", default=False)


    class Meta:
        verbose_name = "Чат"
        verbose_name_plural = "Чаты"

    def __str__(self):
        return f"chat № {self.id}"

    def save(self, *args, **kwards):
        if not self.slug:
            self.slug = slug_generator()
            while Chat.objects.filter(slug=self.slug).exists():
                self.slug = slug_generator()
        super().save(*args, **kwards)

    def get_absolute_url(self):
        return reverse("chat", kwargs={"slug": self.slug})


class Message(models.Model):
    sender = models.ForeignKey(User, verbose_name="Отправитель", on_delete=models.CASCADE, related_name="sender")
    recipient = models.ForeignKey(Chat, verbose_name="Получатель", on_delete=models.CASCADE, related_name="recipient")
    date = models.DateTimeField("Дата отправки",auto_now_add=True)
    content = models.TextField("Сообщение")
    attached_file = models.FileField(upload_to="chat", blank=True, null=True)

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"

    def __str__(self):
        return f"from {self.sender} to {self.recipient}"
    