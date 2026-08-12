from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from django.test import TestCase

from api.models import Idea, Vote


class VoteConstraintTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='pw')
        self.idea = Idea.objects.create(title='Test Idea', created_by=self.user)

    def test_duplicate_vote_rejected(self):
        Vote.objects.create(user=self.user, idea=self.idea)

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Vote.objects.create(user=self.user, idea=self.idea)

        self.assertEqual(Vote.objects.filter(user=self.user, idea=self.idea).count(), 1)
