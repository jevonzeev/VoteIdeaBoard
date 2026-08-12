import logging
from celery import shared_task
from django.contrib.auth.models import User
from .models import Idea, Vote
from django.db import IntegrityError

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=2)
def process_vote_task(self, user_id, idea_id, action):
    """
    Asynchronously processes a vote with retries and structured logging.
    action: 'add' or 'remove'
    """
    try:
        user = User.objects.get(id=user_id)
        idea = Idea.objects.get(id=idea_id)
        
        if action == 'add':
            Vote.objects.get_or_create(user=user, idea=idea)
            logger.info(f"Vote added: user={user_id}, idea={idea_id}")
        elif action == 'remove':
            Vote.objects.filter(user=user, idea=idea).delete()
            logger.info(f"Vote removed: user={user_id}, idea={idea_id}")

    except (User.DoesNotExist, Idea.DoesNotExist) as e:
        logger.error(f"Task failed: Target object does not exist (user={user_id}, idea={idea_id}). Error: {str(e)}")
    except IntegrityError as exc:
        logger.warning(f"Integrity error processing vote (user={user_id}, idea={idea_id}). Retrying... Error: {str(exc)}")
        raise self.retry(exc=exc)
    except Exception as exc:
        logger.error(f"Unexpected error processing vote (user={user_id}, idea={idea_id}). Retrying... Error: {str(exc)}")
        raise self.retry(exc=exc)
