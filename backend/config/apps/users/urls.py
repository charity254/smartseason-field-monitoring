from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('users/', views.get_agents, name='agents'),
    path('agents/', views.get_agents_with_stats, name='agents-stats'),
    path('agents/create/', views.create_agent, name='create-agent'),
    path('agents/<int:pk>/update/', views.update_agent, name='update-agent'),
    path('agents/<int:pk>/deactivate/', views.deactivate_agent, name='deactivate-agent'),
]