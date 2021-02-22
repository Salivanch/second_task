from django.db import models
from user.models import User


class News(models.Model):
    user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.CASCADE, blank=True, null=True)
    IdBD = models.IntegerField("ID записи со стронней БД", blank=True, null=True)
    content = models.TextField("Контент")
    attached_file = models.ImageField(upload_to="news", blank=True, null=True)
    date = models.DateTimeField("Дата создание записи")

    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"

    def __str__(self):
        if self.user:
            return f"Новость от пользователя {self.user}"
        else:
            return f"Новость с БД № {self.IdBD}"


class Comment(models.Model):
    news = models.ForeignKey(News,verbose_name="Комментарии к новости", on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, verbose_name="Пользователь", on_delete=models.CASCADE)
    content = models.TextField("Контент")
    attached_file = models.ImageField(upload_to="comment", blank=True, null=True)
    date = models.DateTimeField("Дата отправки комментария", auto_now_add=True)

    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"

    def __str__(self):
        return f"Комментарий от пользователя {self.user} к новости {self.news}"
