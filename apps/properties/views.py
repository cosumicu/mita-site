from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
from decimal import Decimal
from datetime import datetime
import django_filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Property, Reservation, PropertyView, PropertyLike, ReservationStatus
from .pagination import PropertyPagination
from apps.chat.models import Conversation
from .serializers import PropertyListSerializer, PropertyDetailSerializer, PropertyCreateSerializer, ReservationSerializer

class PropertyFilter(django_filters.FilterSet):
    user = django_filters.UUIDFilter(field_name='user__id')
    location = django_filters.CharFilter(method='filter_search')
    guests = django_filters.NumberFilter(field_name='guests', lookup_expr='gte')
    min_price_per_night = django_filters.NumberFilter(field_name='price_per_night', lookup_expr='gte')
    max_price_per_night = django_filters.NumberFilter(field_name='price_per_night', lookup_expr='lte')

    start_date = django_filters.DateFilter(method='filter_by_dates')
    end_date = django_filters.DateFilter(method='filter_by_dates')

    class Meta:
        model = Property
        fields = ['user', 'location', 'guests', 'min_price_per_night', 'max_price_per_night', 'start_date', 'end_date']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(location__icontains=value)
            | Q(title__icontains=value)
            | Q(category__icontains=value)
        )

    def filter_by_dates(self, queryset, name, value):
        """
        Exclude properties that have reservations overlapping with the search range.
        """
        start_date = self.data.get('start_date')
        end_date = self.data.get('end_date')

        if start_date and end_date:
            # Exclude properties that have conflicting reservations
            queryset = queryset.exclude(
                reservations__start_date__lt=end_date,
                reservations__end_date__gt=start_date
            )
        return queryset

class ReservationFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status')


class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PropertyFilter
    pagination_class = PropertyPagination

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

class PropertyUpdateView(generics.UpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You cannot edit this property.")
        return obj

class PropertyDeleteView(generics.DestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You cannot delete this property.")
        return obj

class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PropertyPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ReservationFilter


    def get_queryset(self):
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

        if number_of_nights >= 28:
            long_stay_discount = property.monthly_discount_rate
        elif number_of_nights >= 7:
            long_stay_discount = property.weekly_discount_rate
        else:
            long_stay_discount = Decimal("0.00")
        
        price_per_night = property.price_per_night
        cleaning_fee = property.cleaning_fee
        guest_service_fee_rate = Decimal("0.10")
        host_service_fee_rate = Decimal("0.02")
        tax_rate = Decimal("0.03")

        subtotal = price_per_night * number_of_nights
        discounted_subtotal = subtotal - (subtotal * long_stay_discount)
        guest_service_fee = discounted_subtotal * guest_service_fee_rate
        tax = (discounted_subtotal + cleaning_fee + guest_service_fee) * tax_rate
        total_amount = discounted_subtotal + cleaning_fee + guest_service_fee + tax

        host_service_fee = discounted_subtotal * host_service_fee_rate
        host_pay = (discounted_subtotal + cleaning_fee) - host_service_fee

        reservation = serializer.save(
            user=self.request.user,
            property=property,
            price_per_night=price_per_night,
            number_of_nights=number_of_nights,
            long_stay_discount=long_stay_discount,
            cleaning_fee=cleaning_fee, 
            guest_service_fee_rate=guest_service_fee_rate,
            host_service_fee_rate=host_service_fee_rate,
            tax_rate=tax_rate,
            total_amount=total_amount,
            host_pay=host_pay
        )

        Conversation.objects.create(
            reservation=reservation,
            guest=self.request.user,
            landlord=property.user
        )

class ApprovedReservationListProperty(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return Reservation.objects.filter(
            property__id=self.kwargs.get(self.lookup_url_kwarg),
            status__in=[ReservationStatus.APPROVED, ReservationStatus.ONGOING]
        ).order_by("-created_at")

class ReservationListUserProperty(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return Reservation.objects.filter(
            property__user=self.request.user,
            property__id=self.kwargs.get(self.lookup_url_kwarg),
        ).order_by("-created_at")


class PendingReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permissions_classes = [permissions.IsAuthenticated]
    pagination_class = PropertyPagination

    def get_queryset(self):
        return Reservation.objects.filter(
            property__user=self.request.user,
            status='PENDING'
        ).select_related('user', 'property').order_by('-created_at')


class ApproveReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, reservation_id):
        reservation = get_object_or_404(Reservation, id=reservation_id)

        if reservation.property.user != request.user:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        if reservation.status != ReservationStatus.PENDING:
            return Response({"detail": "Reservation is not pending"}, status=status.HTTP_400_BAD_REQUEST)

        reservation.status = ReservationStatus.APPROVED
        reservation.save()

        reservation.property.reservations_count = reservation.property.reservations.count()
        reservation.property.save(update_fields=["reservations_count"])

        # TODO: send notification to guest

        return Response({"detail": "Reservation approved successfully"}, status=status.HTTP_200_OK)

class DeclineReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, reservation_id):
        reservation = get_object_or_404(Reservation, id=reservation_id)

        if reservation.property.user != request.user:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        if reservation.status != ReservationStatus.PENDING:
            return Response({"detail": "Reservation is not pending"}, status=status.HTTP_400_BAD_REQUEST)

        reservation.status = ReservationStatus.DECLINED
        reservation.save()

        # TODO: send notification to guest

        return Response({"detail": "Reservation declined successfully"}, status=status.HTTP_200_OK)

class UserFavoritesView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        user = self.request.user
        return Property.objects.filter(likes__user=user).distinct()

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
