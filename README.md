# Mita site

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

### Other features
- Live chat with host/guest
- Toasts

### System
- Authentication (JWT)
- Pagination and filtering

## Monorepo Structure
.
├── apps/ # Django apps
├── booking_site/ # Django project
├── client/tempest/ # Frontend client app
│ └── .env.example # Next.js .env file example
├── docker/
│ └── local/ # Local Docker configs / scripts
├── docker-compose.yml # Dev stack
├── docker-compose.prod.yml # Production stack
├── manage.py # Django entrypoint
├── requirements.txt # Backend Python dependencies
├── Makefile # Dev/prod helper commands
├── .dockerignore
├── .gitignore
└── .env.example # Django .env file example

