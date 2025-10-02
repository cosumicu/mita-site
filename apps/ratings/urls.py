from django.urls import path

from .views import RatingCreateView

urlpatterns = [
    path("<uuid:id>/", RatingCreateView.as_view(), name="create-rating")
]