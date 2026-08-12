from django.db import models
from django.contrib.auth.models import User


class Idea(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ideas")

    def __str__(self):
        return self.title


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name="votes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "idea"],
                name="one_vote_per_user"
            )
        ]

    def __str__(self):
        return f"{self.user.username} voted for {self.idea.title}"
