"use client";

import { useCallback, useEffect, useState } from "react";
import HostCalendar from "@/app/components/calendar/HostCalendar";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getHostCalendarData } from "@/app/lib/features/analytics/analyticsSlice";

const HostCalendarPage = () => {
  const dispatch = useAppDispatch();
  const { data: hostCalendarData } = useAppSelector(
    (state) => state.analytics.hostCalendarData
  );
  const [currentRange, setCurrentRange] = useState<{
    start: string;
    end: string;
  }>({ start: "", end: "" });

  // Function to handle date range changes from calendar
  const handleDatesSet = useCallback(
    (start: string, end: string) => {
      setCurrentRange({ start, end });
      dispatch(getHostCalendarData({ start, end }));
    },
    [dispatch]
  );

  // Initial load - get current month
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    setCurrentRange({
      start: formatDate(start),
      end: formatDate(end),
    });

    dispatch(
      getHostCalendarData({
        start: formatDate(start),
        end: formatDate(end),
      })
    );
  }, [dispatch]);

  return (
    <div className="px-4 sm:px-10 space-y-6">
      <p className="font-semibold text-xl sm:text-3xl">Host Calendar</p>
      <HostCalendar
        reservations={hostCalendarData}
        onDatesSet={handleDatesSet}
      />
    </div>
  );
};

export default HostCalendarPage;
