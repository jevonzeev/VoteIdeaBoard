#!/usr/bin/env python
"""Create a starter .env file for local development."""
import os

DEFAULT_ENV = """DEBUG=True
SECRET_KEY=dev-secret-key-not-for-production
ALLOWED_HOSTS=127.0.0.1,localhost
DB_NAME=votingboard_db
DB_USER=votingboard_user
DB_PASSWORD=votingboard_password
DB_HOST=localhost
DB_PORT=5432
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
"""


def create_or_fix_env():
    env_path = '.env'
    if os.path.exists(env_path):
        print(f"{env_path} already exists — not overwriting.")
        return
    with open(env_path, 'w') as f:
        f.write(DEFAULT_ENV)
    print(f"Created {env_path}")


if __name__ == '__main__':
    create_or_fix_env()
