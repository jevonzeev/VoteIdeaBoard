from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Create a user account for login (users are seeded manually, not self-registered)"

    def add_arguments(self, parser):
        parser.add_argument('--username', default='jevon', help='Username for the new account')
        parser.add_argument('--password', default='password333', help='Password for the new account')
        parser.add_argument('--email', default='', help='Optional email address')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        email = options['email'] or f'{username}@example.com'

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"User '{username}' already exists — skipping."))
            return

        User.objects.create_user(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Created user '{username}'"))
