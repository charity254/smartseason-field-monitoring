from rest_framework import serializers
from .models import Field, FieldUpdate


class FieldUpdateSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.username', read_only=True)
    field_name = serializers.CharField(source='field.name', read_only=True)
    
    class Meta:
        model = FieldUpdate
        fields = ['id', 'stage', 'notes', 'agent_name', 'field_name', 'created_at']


class FieldSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = Field
        fields = ['id', 'name', 'crop_type', 'planting_date', 'stage', 'assigned_to', 'assigned_to_name', 'status', 'created_at']

    def get_status(self, obj):
        return obj.get_status()