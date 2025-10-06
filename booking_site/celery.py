from __future__ import absolute_import
import os

from celery import Celery
from booking_site import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "booking_site.settings")

app = Celery("booking_site")

app.config_from_object("booking_site.settings", namespace="CELERY"),

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)