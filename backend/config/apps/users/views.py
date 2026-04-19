from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
        }
    })

@api_view(['POST'])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
def get_agents(request):
    agents = User.objects.filter(role='agent')
    return Response(UserSerializer(agents, many=True).data)

@api_view(['GET'])
def get_agents_with_stats(request):
    if request.user.role != User.ADMIN:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    agents = User.objects.filter(role='agent')
    data = []
    for agent in agents:
       data.append({
        'id': agent.id,
        'username': agent.username,
        'email': agent.email,
        'phone': agent.phone,
        'location': agent.location,
        'is_active': agent.is_active,
        'total_fields': agent.fields.count(),
        'active_fields': sum(1 for f in agent.fields.all() if f.get_status() == 'active'),
        'at_risk_fields': sum(1 for f in agent.fields.all() if f.get_status() == 'at_risk'),
    })
    return Response(data)

@api_view(['POST'])
def create_agent(request):
    if request.user.role != User.ADMIN:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    data = request.data
    try:
        agent = User.objects.create_user(
            username=data.get('username'),
            email=data.get('email', ''),
            password=data.get('password'),
            role='agent',
            phone=data.get('phone', ''),
            location=data.get('location', ''),
        )
        return Response(UserSerializer(agent).data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_agent(request, pk):
    if request.user.role != User.ADMIN:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        agent = User.objects.get(pk=pk, role='agent')
    except User.DoesNotExist:
        return Response({'error': 'Agent not found'}, status=status.HTTP_404_NOT_FOUND)
    agent.email = request.data.get('email', agent.email)
    agent.phone = request.data.get('phone', agent.phone)
    agent.location = request.data.get('location', agent.location)
    agent.save()
    return Response(UserSerializer(agent).data)


@api_view(['PUT'])
def deactivate_agent(request, pk):
    if request.user.role != User.ADMIN:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    try:
        agent = User.objects.get(pk=pk, role='agent')
    except User.DoesNotExist:
        return Response({'error': 'Agent not found'}, status=status.HTTP_404_NOT_FOUND)
    agent.is_active = not agent.is_active
    agent.save()
    return Response({'message': 'Agent status updated', 'is_active': agent.is_active})