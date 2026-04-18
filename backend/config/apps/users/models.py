from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ADMIN = 'admin'
    AGENT = 'agent'

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (AGENT, 'Field Agent'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=AGENT)

    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        related_name='custom_user_set'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True,
        related_name='custom_user_set'
    )
    
    def __str__(self):
        return f"{self.username} ({self.role})"