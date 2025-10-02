from django.urls import path

from .views import ProfileListView, ProfileDetailView, ProfileUpdateView

urlpatterns = [
    path('me/', ProfileDetailView.as_view(), name='get_my_profile'),
    path('me/update', ProfileUpdateView.as_view(), name='update_profile'),
    path('', ProfileListView.as_view(), name='update_profile'),
]