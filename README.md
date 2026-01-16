# Mita Site

A full-stack booking platform where guests can browse listings, book stays, and hosts can create/manage properties and reservations.

## Tech Stack

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS
- Redux

**Backend**
- Django + Django REST Framework
- PostgreSQL
- Redis (message broker)
- Celery
- Nginx

**Infrastructure**
- Docker
- VPS (Ubuntu)

## Features

### Guest
- Browse listings with search filters (location, dates, guests, etc.)
- View property details (picture, pricing, host info, reviews)
- Create reservations / send booking requests
- Save/favorite listings
- User profile management

### Host
- Create, update, and manage listings
- View reservations by status
- Host dashboard
- Host calendar

### System
- Authentication (JWT)
- Pagination and filtering

### Other features
- Live chat with host/guest
- Toasts

## Monorepo Structure

```text
.
├── apps/                     # Django apps
├── booking_site/             # Django project (settings/urls/asgi/wsgi)
├── client/
│   └── tempest/              # Frontend client app (Next.js)
│       └── .env.example      # Frontend env example
├── docker/
│   └── local/                # Local Docker configs / scripts
├── docker-compose.yml        # Dev stack
├── docker-compose.prod.yml   # Production stack
├── manage.py                 # Django entrypoint
├── requirements.txt          # Backend Python dependencies
├── Makefile                  # Dev/prod helper commands
├── .env.example              # Backend env example (Django)
├── .dockerignore
└── .gitignore


