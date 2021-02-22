from django.db import models
from django.shortcuts import reverse
from django.db.models.signals import post_save
from .service import resize_photo, slugify, slug_generator


from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None):
            """
            Creates and saves a User with the given email and password.
            """
            if not email:
                raise ValueError('Users must have an email address')

            user = self.model(
                email=self.normalize_email(email),
            )

            user.set_password(password)
            user.save(using=self._db)
            return user

    def create_superuser(self, email, password):
            """
            Creates and saves a superuser with the given email and password.
            """
            user = self.create_user(
                email,
                password=password,
            )
            user.is_staff = True
            user.is_superuser = True
            user.save(using=self._db)
            return user


class User(AbstractBaseUser, PermissionsMixin):
    login = models.CharField("Логин", max_length=30, unique=True, blank=True)
    email = models.EmailField('Почта', unique=True)
    first_name = models.CharField('Имя', max_length=30, blank=True)
    last_name = models.CharField('Фамилия', max_length=30, blank=True)
    patronymic = models.CharField('Отчество', max_length= 30, blank=True)
    photo = models.ImageField("Фото пользователя", upload_to="user", default="user/user.png", blank=True)
    bithday = models.DateTimeField("Дата рождения", null=True, blank=True)
    date_joined = models.DateTimeField('Дата регистрации', auto_now_add=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def get_full_name(self):
        '''
        Returns the first_name plus the last_name, with a space in between.
        '''
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    # def get_profile(self):
    #     profile = Profile.objects.get(user__id=self.id)
    #     return profile.get_absolute_url()

    def get_short_name(self):
        '''
        Returns the short name for the user.
        '''
        return self.first_name


    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def save(self, *args, **kwards):
        if not self.login:
            self.login = self.email.split("@")[0]
            while User.objects.filter(login=self.login).exists():
                self.login = slug_generator()
        super().save(*args, **kwards)
        if self.photo:
            image = resize_photo(self.photo.path)

    def __str__(self):
        return f"{self.login}"


class Profile(models.Model):
    user = models.OneToOneField(User, verbose_name="Пользователь", on_delete=models.CASCADE, related_name="profile")
    interlocutors = models.ManyToManyField(User, verbose_name="Собеседники", related_name="friends", blank=True)
    slug = models.SlugField("Ссылка на профиль", unique=True, blank=True)

    def __str__(self):
        return f"{self.user}"

    def get_absolute_url(self):
        return reverse("profile", kwargs={"slug": self.slug})
    
    def save(self, *args, **kwards):
        if not self.slug:
            print(self.user.login)
            self.slug = slugify(self.user.login)
            while Profile.objects.filter(slug=self.slug).exists():
                self.slug = slug_generator()
        super().save(*args, **kwards)

    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    post_save.connect(create_user_profile, sender=User)

    class Meta:
        verbose_name = "Профиль"
        verbose_name_plural = "Профиля"