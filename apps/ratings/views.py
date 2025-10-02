from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from apps.profiles.models import Profile
from .models import Rating
from .serializers import RatingSerializer

User = get_user_model()


class RatingCreateView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = "id"

    def perform_create(self, serializer):
        landlord_id = self.kwargs.get(self.lookup_url_kwarg)
        landlord_profile = get_object_or_404(Profile, id=landlord_id)

        landlord = landlord_profile.user
        if landlord == self.request.user:
            raise ValidationError({"message": "You can't rate yourself"})

        already_exists = landlord_profile.landlord_review.filter(
            rater=self.request.user
        ).exists()
        if already_exists:
            raise ValidationError({"detail": "Profile already reviewed"})

        rating_value = self.request.data.get("rating")
        if not rating_value or int(rating_value) == 0:
            raise ValidationError({"detail": "Please select a rating"})

        review = serializer.save(rater=self.request.user, landlord=landlord_profile)

        reviews = landlord_profile.landlord_review.all()
        landlord_profile.num_reviews = reviews.count()
        total = sum([r.rating for r in reviews])
        landlord_profile.rating = round(total / reviews.count(), 2)
        landlord_profile.save()

        return review

    def create(self, request, *args, **kwargs):
        """Override create to return custom success message."""
        response = super().create(request, *args, **kwargs)
        return Response({"message": "Review Added"}, status=status.HTTP_201_CREATED)
