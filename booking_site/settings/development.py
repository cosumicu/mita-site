from .base import *

DATABASES = {
    'default': {
        'ENGINE': env("SQL_ENGINE"),
        'NAME': env("SQL_DATABASE"),
        'USER': env("SQL_USER"),
        'PASSWORD': env("SQL_PASSWORD"),
        'HOST': env("SQL_HOST"),
        'PORT': env("SQL_PORT"),
    }
}

# This is for live chat feature
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [{"host": "redis", "port": 6379}], # Service name from docker compose
                                            # Add 1 to prevent celery and channels
                                            # from using the same redis db index
            'capacity': 10000,
            'expiry': 60,
        }
    }
}

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
]

CORS_ORIGINS_WHITELIST = [
    'http://localhost:8080',
    'http://localhost:3000',
]

"""
So basically, what s happening here is that I used celery email backends to handle emails
asynchronously. And to implement sendgrid service, you need to set CELERY_EMAIL_BACKEND
so that celery would know what email service you would use. Also, setting up the email service
you would use depends on the service itsself.
"""

SITE_NAME = "Mita Site - Dev"

EMAIL_BACKEND = 'djcelery_email.backends.CeleryEmailBackend'
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")

CELERY_BROKER_URL = env("CELERY_BROKER")
CELERY_RESULT_BACKEND = env("CELERY_BACKEND")
CELERY_EMAIL_BACKEND = env("CELERY_EMAIL_BACKEND")

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "Asia/Manila"

SENDGRID_API_KEY = env('SENDGRID_API_KEY')

EMAIL_HOST = env('EMAIL_HOST')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = SENDGRID_API_KEY
EMAIL_PORT = int(env("EMAIL_PORT", 587))