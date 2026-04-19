from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Field, FieldUpdate
from .serializers import FieldSerializer, FieldUpdateSerializer
from apps.users.models import User

# Create your views here.
class FieldListView(APIView):
    def get(self, request):
        if request.user.role == User.ADMIN:
            fields = Field.objects.all().order_by('-created_at')
        else:
            fields = Field.objects.filter(assigned_to=request.user).order_by('-created_at')
        return Response(FieldSerializer(fields, many=True).data)

    def post(self, request):
        serializer = FieldSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FieldDetailView(APIView):
    def get(self, request, pk):
        try:
            field = Field.objects.get(pk=pk)
        except Field.DoesNotExist:
            return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(FieldSerializer(field).data)

    def put(self, request, pk):
        if request.user.role != User.ADMIN:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        try:
            field = Field.objects.get(pk=pk)
        except Field.DoesNotExist:
            return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = FieldSerializer(field, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FieldUpdateListView(APIView):
    def get(self, request, pk):
        try:
            field = Field.objects.get(pk=pk)
        except Field.DoesNotExist:
            return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
        updates = field.updates.all().order_by('-created_at')
        return Response(FieldUpdateSerializer(updates, many=True).data)

    def post(self, request, pk):
        try:
            field = Field.objects.get(pk=pk)
        except Field.DoesNotExist:
            return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = FieldUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(field=field, agent=request.user)
            field.stage = request.data.get('stage', field.stage)
            field.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    def get(self, request):
        fields = Field.objects.all() if request.user.role == User.ADMIN else Field.objects.filter(assigned_to=request.user)
        statuses = [f.get_status() for f in fields]
        return Response({
            'total_fields': len(statuses),
            'active': statuses.count('active'),
            'at_risk': statuses.count('at_risk'),
            'completed': statuses.count('completed'),
            'planted': fields.filter(stage='planted').count(),
            'growing': fields.filter(stage='growing').count(),
            'ready': fields.filter(stage='ready').count(),
            'harvested': fields.filter(stage='harvested').count(),
        })