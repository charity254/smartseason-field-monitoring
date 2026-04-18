from django.db import models
from apps.users.models import User
# Create your models here.
class Field(models.Model):
    PLANTED = 'planted'
    GROWING = 'growing'
    READY = 'ready'
    HARVESTED = 'harvested'

    STAGE_CHOICES = [
        (PLANTED, 'Planted'),
        (GROWING, 'Growing'),
        (READY, 'Ready'),
        (HARVESTED, 'Harvested'),
    ]

    name = models.CharField(max_length=100)
    crop_type = models.CharField(max_length=100)
    planting_date = models.DateField()
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default=PLANTED)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='fields')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_status(self):
        from datetime import date
        days_since_planting = (date.today() - self.planting_date).days

        if self.stage == self.HARVESTED:
            return 'completed'
        elif self.stage == self.GROWING and days_since_planting > 90:
            return 'at_risk'
        return 'active'

    def __str__(self):
        return f"{self.name} ({self.crop_type})"

class FieldUpdate(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='updates')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updates')
    stage = models.CharField(max_length=20, choices=Field.STAGE_CHOICES)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.field.name} update by {self.agent.username}"