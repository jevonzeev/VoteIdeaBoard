from django.contrib.auth.models import User
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import Idea, Vote


@override_settings(
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class AuthAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='jevon', password='password333')

    def test_login_success(self):
        response = self.client.post(
            '/api/auth/login/',
            {'username': 'jevon', 'password': 'password333'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {'id': self.user.id, 'username': 'jevon'})

    def test_login_invalid_credentials(self):
        response = self.client.post(
            '/api/auth/login/',
            {'username': 'jevon', 'password': 'wrong'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_requires_auth(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_me_returns_user_when_authenticated(self):
        self.client.login(username='jevon', password='password333')
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['username'], 'jevon')

    def test_logout_destroys_session(self):
        self.client.login(username='jevon', password='password333')
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


@override_settings(
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class IdeaAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='jevon', password='password333')
        self.client.login(username='jevon', password='password333')

    def test_list_ideas_requires_auth(self):
        self.client.logout()
        response = self.client.get('/api/ideas/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_and_list_idea(self):
        create_response = self.client.post(
            '/api/ideas/',
            {'title': 'Dark mode', 'description': 'Add dark mode support'},
            content_type='application/json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        body = create_response.json()
        self.assertEqual(body['title'], 'Dark mode')
        self.assertEqual(body['description'], 'Add dark mode support')
        self.assertEqual(body['created_by_username'], 'jevon')
        self.assertEqual(body['vote_count'], 0)
        self.assertFalse(body['user_has_voted'])
        self.assertIn('id', body)
        self.assertIn('created_at', body)

        list_response = self.client.get('/api/ideas/')
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.json()), 1)
        self.assertEqual(list_response.json()[0]['title'], 'Dark mode')

    def test_create_idea_requires_title(self):
        response = self.client.post(
            '/api/ideas/',
            {'title': '', 'description': 'No title'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


@override_settings(
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
)
class VoteAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='jevon', password='password333')
        self.other = User.objects.create_user(username='alice', password='password333')
        self.idea = Idea.objects.create(title='Test idea', created_by=self.user)
        self.client.login(username='jevon', password='password333')

    def test_vote_returns_accepted_and_persists(self):
        response = self.client.post(f'/api/ideas/{self.idea.id}/vote/')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(
            response.json(),
            {'idea_id': self.idea.id, 'user_has_voted': True},
        )
        self.assertTrue(Vote.objects.filter(user=self.user, idea=self.idea).exists())

    def test_unvote_removes_vote(self):
        Vote.objects.create(user=self.user, idea=self.idea)
        response = self.client.delete(f'/api/ideas/{self.idea.id}/vote/')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(
            response.json(),
            {'idea_id': self.idea.id, 'user_has_voted': False},
        )
        self.assertFalse(Vote.objects.filter(user=self.user, idea=self.idea).exists())

    def test_vote_updates_list_and_leaderboard_counts(self):
        self.client.post(f'/api/ideas/{self.idea.id}/vote/')

        ideas_response = self.client.get('/api/ideas/')
        idea = ideas_response.json()[0]
        self.assertEqual(idea['vote_count'], 1)
        self.assertTrue(idea['user_has_voted'])

        leaderboard_response = self.client.get('/api/leaderboard/')
        self.assertEqual(leaderboard_response.json()[0]['vote_count'], 1)

    def test_vote_requires_auth(self):
        self.client.logout()
        response = self.client.post(f'/api/ideas/{self.idea.id}/vote/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_vote_unknown_idea_returns_404(self):
        response = self.client.post('/api/ideas/9999/vote/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
