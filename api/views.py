from django.contrib.auth import login, logout
from django.db.models import Count, Exists, OuterRef
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions

from .authentication import CSRFExemptSessionAuthentication
from .serializers import LoginSerializer, IdeaSerializer
from .models import Idea, Vote
from .tasks import process_vote_task


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [CSRFExemptSessionAuthentication]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response({'id': user.id, 'username': user.username})


class LogoutView(APIView):
    authentication_classes = [CSRFExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    authentication_classes = [CSRFExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'id': request.user.id, 'username': request.user.username})


class IdeaListCreateView(generics.ListCreateAPIView):
    serializer_class = IdeaSerializer
    authentication_classes = [CSRFExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Idea.objects.annotate(
            vote_count=Count('votes'),
            user_has_voted=Exists(
                Vote.objects.filter(idea=OuterRef('pk'), user=self.request.user)
            ),
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LeaderboardView(generics.ListAPIView):
    serializer_class = IdeaSerializer
    authentication_classes = [CSRFExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Idea.objects.annotate(
            vote_count=Count('votes'),
            user_has_voted=Exists(
                Vote.objects.filter(idea=OuterRef('pk'), user=self.request.user)
            ),
        ).order_by('-vote_count', '-created_at')


class VoteView(APIView):
    authentication_classes = [CSRFExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        idea = get_object_or_404(Idea, pk=pk)
        process_vote_task.delay(request.user.id, idea.id, 'add')
        return Response(
            {'idea_id': idea.id, 'user_has_voted': True},
            status=status.HTTP_202_ACCEPTED,
        )

    def delete(self, request, pk):
        idea = get_object_or_404(Idea, pk=pk)
        process_vote_task.delay(request.user.id, idea.id, 'remove')
        return Response(
            {'idea_id': idea.id, 'user_has_voted': False},
            status=status.HTTP_202_ACCEPTED,
        )
