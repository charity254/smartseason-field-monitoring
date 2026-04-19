from django.urls import path
from . import views

urlpatterns = [
    path('fields/', views.FieldListView.as_view(), name='field-list'),
    path('fields/<int:pk>/', views.FieldDetailView.as_view(), name='field-detail'),
    path('fields/<int:pk>/updates/', views.FieldUpdateListView.as_view(), name='field-updates'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('updates/recent/', views.recent_updates, name='recent-updates'),
]