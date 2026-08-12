from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/me/', views.MeView.as_view(), name='me'),
    path('ideas/', views.IdeaListCreateView.as_view(), name='ideas'),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('ideas/<int:pk>/vote/', views.VoteView.as_view(), name='vote'),
]
