from __future__ import absolute_import
import os

from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "booking_site.settings.development")

app = Celery("booking_site")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

app.conf.beat_scheduler = "django_celery_beat.schedulers:DatabaseScheduler"

app.conf.beat_schedule = {
    "complete-reservations-daily": {
        "task": "apps.properties.tasks.update_reservations_status_task",
        "schedule": crontab(minute="*"),
    },
}
