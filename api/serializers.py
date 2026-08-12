from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Idea


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            data['user'] = user
            return data
        raise serializers.ValidationError('Please check your credentials and try again')


class IdeaSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    user_has_voted = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = [
            'id', 'title', 'description', 'created_at',
            'created_by_username', 'vote_count', 'user_has_voted',
        ]
        read_only_fields = [
            'id', 'created_at', 'created_by_username', 'vote_count', 'user_has_voted',
        ]

    def get_created_by_username(self, obj):
        return obj.created_by.username

    def get_vote_count(self, obj):
        return getattr(obj, 'vote_count', 0)

    def get_user_has_voted(self, obj):
        return bool(getattr(obj, 'user_has_voted', False))
