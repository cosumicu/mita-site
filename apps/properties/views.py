from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from decimal import Decimal
from datetime import datetime
import django_filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Property, Reservation, PropertyView, PropertyLike
from .serializers import PropertyListSerializer, PropertyDetailSerializer, PropertyCreateSerializer, ReservationSerializer

class PropertyFilter(django_filters.FilterSet):
    user = django_filters.UUIDFilter(field_name='user__profile__id')

    class Meta:
        model = Property
        fields = ['user']

class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropertyFilter

class PropertyDetailView(generics.RetrieveAPIView):
    serializer_class = PropertyDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = "id"

    def get_object(self):
        return get_object_or_404(Property, id=self.kwargs.get(self.lookup_url_kwarg))

    def retrieve(self, request, *args, **kwargs):
        property = self.get_object()
        ip = self.get_client_ip(request)

        view, created = PropertyView.objects.get_or_create(
            property=property, ip_address=ip
        )

        if created:
            property.views_count = property.views.count()
            property.save(update_fields=["views_count"])

        serializer = self.get_serializer(property, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_client_ip(self, request):
        """Extract real client IP address."""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip

class PropertyCreateView(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print("Current user:", self.request.user)
        return Reservation.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        data = self.request.data
        id = data.get('property_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        property = get_object_or_404(Property, id=id)

        start_date_ = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_ = datetime.strptime(end_date, "%Y-%m-%d").date()

        number_of_nights = (end_date_ - start_date_).days
    
        serializer.save(
            user=self.request.user,
            property=property,
            number_of_nights=number_of_nights,
        )

        property.reservations_count = property.reservations.count()
        property.save(update_fields=["reservations_count"])

class ToggleFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        property = get_object_or_404(Property, id=id)

        like, created = PropertyLike.objects.get_or_create(
            property=property, user=request.user
        )

        if not created:
            like.delete()

        liked = property.likes.filter(user=request.user).exists()
        property.likes_count = property.likes.count()
        property.save(update_fields=["likes_count"])

        return Response(
            {"is_liked": liked},
            status=status.HTTP_200_OK,
        )
