from datetime import date, timedelta
from django.utils import timezone

from decimal import Decimal, ROUND_HALF_UP


def get_date_range(range: str):
    """
    week  = last 7 days (rolling, incl today)
    month = last 30 days (rolling, incl today)
    year  = year-to-date (Jan 1 -> today)
    """

    today = timezone.localdate()
    print(today)
    
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
    """
    Previous period with same number of days.
    Example: if current is 7 days, previous is the 7 days right before it.
    """
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

