from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from .models import Property
from .serializers import PropertyListSerializer, PropertyDetailSerializer

class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertyListSerializer
    permission_classes = [permissions.AllowAny]

class PropertyDetailView(generics.RetrieveAPIView):
    serializer_class = PropertyDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_url_kwarg = "id"

    def get_object(self):
        property_id = self.kwargs.get(self.lookup_url_kwargs)
        return get_object_or_404(Property, id=property_id)