"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/features/axiosInstance";
import HostCalendar from "@/app/components/dashboard/HostCalendar";
import { HostCalendarEvent } from "@/app/lib/definitions";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getHostCalendarData } from "@/app/lib/features/analytics/analyticsSlice";

const HostDashboard = () => {
  const dispatch = useAppDispatch();
  const { data: hostCalendarData } = useAppSelector(
    (state) => state.analytics.hostCalendarData
  );

  useEffect(() => {
    dispatch(getHostCalendarData({ start: "2025-12-01", end: "2026-01-31" }));
  }, []);

  return (
    <div className="m-4 space-y-6">
      {/* Stats cards */}
      <div className="flex justify-between gap-4 p-4 border border-gray-200 rounded-lg">
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Total Monies</p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Upcoming Reservations</p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Pending Requests</p>
        </div>
        <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
          <p>Ave. Nightly Rate</p>
        </div>
      </div>

      <HostCalendar reservations={hostCalendarData} />
    </div>
  );
};

export default HostDashboard;
