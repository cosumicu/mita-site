from django.urls import path

from .views import (
    PropertyListView,
    PropertyDetailView,
    PropertyCreateView,
    PropertyUpdateView,
    PropertyDeleteView,
    ReservationListCreateView,
    ApprovedReservationListProperty,
    ReservationListUserProperty,
    PendingReservationListView,
    ApproveReservationView,
    DeclineReservationView,
    UserFavoritesView,
    ToggleFavoriteView,
)
urlpatterns = [
    path('', PropertyListView.as_view(), name='property_list'),
    path('<uuid:id>/', PropertyDetailView.as_view(), name='property-details'),
    path('create/', PropertyCreateView.as_view(), name='property-create'),
    path('<uuid:id>/update/', PropertyUpdateView.as_view(), name='property-update'),
    path('<uuid:id>/delete/', PropertyDeleteView.as_view(), name='property-delete'),
    path('reservation/', ReservationListCreateView.as_view(), name='reservation-list-create'),
    path('reservation/requests/', PendingReservationListView.as_view(), name='reservation-requests'),
    path('reservation/<uuid:id>/', ReservationListUserProperty.as_view(), name='reservation-user-property'),
    path('reservation/<uuid:reservation_id>/approve/', ApproveReservationView.as_view(), name='reservation-approve'),
    path('reservation/<uuid:reservation_id>/decline/', DeclineReservationView.as_view(), name='reservation-decline'),
    path('likes/', UserFavoritesView.as_view(), name='user-favorites-list'),
    path('reservation/p/<uuid:id>', ApprovedReservationListProperty.as_view(), name='reservation-list-property'),
    path('<uuid:id>/toggle-favorite/', ToggleFavoriteView.as_view(), name='toggle-favorite'),
]