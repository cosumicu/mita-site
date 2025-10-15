from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from decimal import Decimal
from datetime import datetime
import django_filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Property, Reservation
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
        property_id = self.kwargs.get(self.lookup_url_kwarg)
        return get_object_or_404(Property, id=property_id)

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
        property_id = data.get('property_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        property = get_object_or_404(Property, id=property_id)

        start_date_ = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_ = datetime.strptime(end_date, "%Y-%m-%d").date()

        number_of_nights = (end_date_ - start_date_).days

        serializer.save(
            user=self.request.user,
            property=property,
            number_of_nights=number_of_nights,
        )