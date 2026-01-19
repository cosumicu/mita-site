from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Count
from django.db.models import Sum
from django.db.models.functions import TruncDate, Coalesce
from django.utils import timezone

from apps.properties.models import (
    Property,
    Reservation,
    PropertyView,
    PropertyLike,
    ReservationStatus,
    PropertyStatus,
)

# statuses that can "occupy" a night
OCCUPANCY_STATUSES = [
    ReservationStatus.APPROVED,
    ReservationStatus.ONGOING,
    ReservationStatus.COMPLETED,
]

# statuses you count as "income" in stats allocation
INCOME_STATUSES = [
    ReservationStatus.APPROVED,
    ReservationStatus.ONGOING,
    ReservationStatus.COMPLETED,
]


# ----------------------------
# Date helpers
# ----------------------------
def _window_end_exclusive(end_inclusive: date) -> date:
    # end is inclusive (Jan 20 includes Jan 20), so exclusive end is Jan 21
    return end_inclusive + timedelta(days=1)


def get_date_range(range: str):
    today = timezone.localdate()

    if range == "week":
        start = today - timedelta(days=6)
        end = today
    elif range == "month":
        start = today - timedelta(days=29)
        end = today
    elif range == "year":
        start = date(today.year, 1, 1)
        end = today
    else:
        start = today - timedelta(days=29)
        end = today

    return start, end


def get_previous_date_range(start: date, end: date):
    days = (end - start).days + 1
    prev_end = start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=days - 1)
    return prev_start, prev_end


def pct_change(current, previous):
    current = Decimal(current)
    previous = Decimal(previous)

    if previous == 0:
        return Decimal("0") if current == 0 else Decimal("100")

    return ((current - previous) / previous) * Decimal("100")


# ----------------------------
# Core overlap logic (nights clipped to window)
# ----------------------------
def _overlap_nights(res_start: date, res_end: date, start: date, end_inclusive: date) -> int:
    """
    Reservation range: [res_start, res_end)  (end_date = checkout date, exclusive)
    Window range:      [start, end+1)        (end is inclusive in UI)
    """
    window_end = _window_end_exclusive(end_inclusive)

    overlap_start = max(res_start, start)
    overlap_end = min(res_end, window_end)

    return max((overlap_end - overlap_start).days, 0)


@dataclass
class PeriodStats:
    total_income: Decimal
    occupied_nights: int
    adr: Decimal
    occupancy_rate: Decimal  # percent 0..100
    revpar: Decimal


def _compute_period_stats(user, start: date, end: date, active_properties: int) -> PeriodStats:
    """
    Income/ADR/Occ/RevPAR computed using overlap nights inside the window.

    host_pay is allocated proportionally:
      revenue_in_window = host_pay * (overlap_nights / number_of_nights)
    """
    reservations = Reservation.objects.filter(
        property__user=user,
        status__in=OCCUPANCY_STATUSES,
        start_date__lt=_window_end_exclusive(end),  # overlaps
        end_date__gt=start,
    ).only("status", "start_date", "end_date", "number_of_nights", "host_pay")

    occupied_nights = 0
    income = Decimal("0.00")

    for r in reservations:
        on = _overlap_nights(r.start_date, r.end_date, start, end)
        if on <= 0:
            continue

        occupied_nights += on

        if r.status in INCOME_STATUSES:
            nights_total = int(r.number_of_nights or 0)
            if nights_total > 0:
                per_night = Decimal(r.host_pay or 0) / Decimal(nights_total)
                income += per_night * Decimal(on)

    days_in_range = (end - start).days + 1
    available_nights = (active_properties * days_in_range) if active_properties and days_in_range > 0 else 0

    occupancy_rate = (
        (Decimal(occupied_nights) / Decimal(available_nights)) * Decimal("100")
        if available_nights > 0
        else Decimal("0.00")
    )

    adr = (income / Decimal(occupied_nights)) if occupied_nights > 0 else Decimal("0.00")

    # RevPAR = revenue / available nights (cleanest)
    revpar = (income / Decimal(available_nights)) if available_nights > 0 else Decimal("0.00")

    return PeriodStats(
        total_income=income,
        occupied_nights=occupied_nights,
        adr=adr,
        occupancy_rate=occupancy_rate,
        revpar=revpar,
    )


# ----------------------------
# Public API
# ----------------------------
def get_host_dashboard(user, range: str):
    start, end = get_date_range(range)
    prev_start, prev_end = get_previous_date_range(start, end)

    properties = Property.objects.filter(user=user, status=PropertyStatus.ACTIVE)
    active_properties = properties.count()

    cur = _compute_period_stats(user, start, end, active_properties)
    prev = _compute_period_stats(user, prev_start, prev_end, active_properties)

    total_views = PropertyView.objects.filter(
        property__user=user,
        created_at__date__range=(start, end),
    ).count()

    total_likes = PropertyLike.objects.filter(
        property__user=user,
        created_at__date__range=(start, end),
    ).count()

    reservations_created = Reservation.objects.filter(
        property__user=user,
        created_at__date__range=(start, end),
    ).count()

    # ----- Today cards -----
    today = timezone.localdate()

    checkins = Reservation.objects.filter(
        property__user=user,
        start_date=today,
        status__in=[ReservationStatus.APPROVED, ReservationStatus.ONGOING],
    ).count()

    checkouts = Reservation.objects.filter(
        property__user=user,
        end_date=today,
        status__in=[ReservationStatus.ONGOING, ReservationStatus.COMPLETED],
    ).count()

    ongoing_stays = Reservation.objects.filter(
        property__user=user,
        start_date__lte=today,
        end_date__gt=today,
        status=ReservationStatus.ONGOING,
    ).count()

    occupancy_today = (
        (Decimal(ongoing_stays) / Decimal(active_properties)) * Decimal("100")
        if active_properties
        else Decimal("0.00")
    )

    # ----- Charts -----
    bookings_chart = (
        Reservation.objects.filter(
            property__user=user,
            created_at__date__range=(start, end),
        )
        .annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )

    # Revenue chart: point only on completion day (end_date)
    revenue_chart = (
        Reservation.objects.filter(
            property__user=user,
            status=ReservationStatus.COMPLETED,
            end_date__gte=start,
            end_date__lt=_window_end_exclusive(end),
        )
        .annotate(date=TruncDate("end_date"))
        .values("date")
        .annotate(revenue=Coalesce(Sum("host_pay"), Decimal("0.00")))
        .order_by("date")
    )

    return {
        "meta": {
            "range": range,
            "start": start,
            "end": end,
            "prev_start": prev_start,
            "prev_end": prev_end,
        },
        "today": {
            "checkins": checkins,
            "checkouts": checkouts,
            "ongoing_stays": ongoing_stays,
            "occupancy_rate_today": float(occupancy_today.quantize(Decimal("0.01"))),
        },
        "stats": {
            "total_income": cur.total_income.quantize(Decimal("0.01")),
            "total_income_change_pct": pct_change(cur.total_income, prev.total_income).quantize(Decimal("0.01")),

            "occupancy_rate": cur.occupancy_rate.quantize(Decimal("0.01")),
            "occupancy_rate_change_pct": pct_change(cur.occupancy_rate, prev.occupancy_rate).quantize(Decimal("0.01")),

            "adr": cur.adr.quantize(Decimal("0.01")),
            "adr_change_pct": pct_change(cur.adr, prev.adr).quantize(Decimal("0.01")),

            "revpar": cur.revpar.quantize(Decimal("0.01")),
            "revpar_change_pct": pct_change(cur.revpar, prev.revpar).quantize(Decimal("0.01")),

            "views": total_views,
            "likes": total_likes,
            "reservations": reservations_created,
            "active_properties": active_properties,
            "occupancy_nights": cur.occupied_nights,
        },
        "charts": {
            "bookings": list(bookings_chart),
            "revenue": list(revenue_chart),
        },
    }
