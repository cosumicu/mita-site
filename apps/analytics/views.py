from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.dateparse import parse_date

from .services import get_host_dashboard

from apps.properties.models import Reservation

class HostCalendarAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start = parse_date(request.query_params.get("start"))
        end = parse_date(request.query_params.get("end"))

        if not start or not end:
            return Response(
                {"detail": "start and end query params are required"},
                status=400
            )

        reservations = (
            Reservation.objects
            .filter(
                property__user=request.user,
                start_date__lte=end,
                end_date__gte=start,
            )
            .select_related("property", "user")
        )

        return Response([
            {
                "id": r.id,
                "title": f"{r.property.title}",
                "start": r.start_date,
                "end": r.end_date,
                "status": r.status,
                "property_id": r.property.id,
                "guest": r.user.get_full_name(),
                "confirmation_code": r.confirmation_code,
            }
            for r in reservations
        ])

class HostDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        range = request.query_params.get("range", "month")
        if range not in ["week", "month", "year"]:
            range = "month"

        return Response(get_host_dashboard(user=request.user, range=range))
