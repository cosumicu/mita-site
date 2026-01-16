"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { Button, Segmented, Spin, Alert } from "antd";
import type { DashboardRange } from "@/app/lib/definitions";
import {
  getHostDashboard,
  setHostDashboardRange,
} from "@/app/lib/features/analytics/analyticsSlice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatPesoShort } from "@/app/lib/utils/format";

function peso(n: number) {
  return `₱${Number(n || 0).toLocaleString()}`;
}

function fmtPct(n: number) {
  const v = Number(n || 0);
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
}

function Delta({ value }: { value?: number }) {
  const v = Number(value || 0);
  const cls = v >= 0 ? "text-green-600" : "text-red-600";
  return <p className={`font-semibold ${cls}`}>{fmtPct(v)}</p>;
}

const DashboardPage = () => {
  const dispatch = useAppDispatch();

  const range = useAppSelector((s) => s.analytics.hostDashboardRange);
  const dashboard = useAppSelector((s) => s.analytics.hostDashboard);

  useEffect(() => {
    dispatch(getHostDashboard({ range }));
  }, [dispatch, range]);

  const bookingsData = useMemo(
    () => dashboard.data?.charts?.bookings ?? [],
    [dashboard.data]
  );

  const revenueData = useMemo(
    () => dashboard.data?.charts?.revenue ?? [],
    [dashboard.data]
  );

  if (dashboard.loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="ui-container">
      <div className="ui-main-content">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-xl sm:text-2xl">Dashboard</p>
          <Button color="default" variant="filled" size="small">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="gray"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-download"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 11l5 5l5 -5" />
              <path d="M12 4l0 12" />
            </svg>
          </Button>
        </div>

        {/* Loading / Error */}
        {dashboard.loading && (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        )}

        {dashboard.error && (
          <Alert
            type="error"
            showIcon
            message="Failed to load dashboard"
            description={dashboard.message || "Something went wrong."}
          />
        )}

        {!dashboard.loading && !dashboard.error && dashboard.data && (
          <>
            {/* TODAY */}
            <div className="p-6 border border-gray-200 rounded-lg space-y-6">
              <p className="font-semibold text-xl sm:text-2xl">
                What&apos;s happening today
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>Check-ins</p>
                  <p className="text-3xl font-semibold my-2">
                    {dashboard.data.today?.checkins ?? 0}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>Checkouts</p>
                  <p className="text-3xl font-semibold my-2">
                    {dashboard.data.today?.checkouts ?? 0}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>Ongoing Stays</p>
                  <p className="text-3xl font-semibold my-2">
                    {dashboard.data.today?.ongoing_stays ?? 0}
                  </p>
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-xs text-primary">
                      go to reservations ›
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>Occupancy Rate (Today)</p>
                  <p className="text-3xl font-semibold my-2">
                    {(dashboard.data.today?.occupancy_rate_today ?? 0).toFixed(
                      2
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* PERFORMANCE */}
            <div className="p-6 border border-gray-200 rounded-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="font-semibold text-xl sm:text-2xl">Performance</p>

                <div className="overflow-x-auto">
                  <Segmented<DashboardRange>
                    options={[
                      { label: "Last 7 Days", value: "week" },
                      { label: "Last 30 Days", value: "month" },
                      { label: "Year-to-Date", value: "year" },
                    ]}
                    value={range}
                    onChange={(value) => dispatch(setHostDashboardRange(value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>Total Revenue</p>
                  <p className="text-3xl font-semibold my-2">
                    {peso(dashboard.data.stats.total_income)}
                  </p>
                  <Delta value={dashboard.data.stats.total_income_change_pct} />
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>Occupancy Rate</p>
                  <p className="text-3xl font-semibold my-2">
                    {dashboard.data.stats.occupancy_rate.toFixed(2)}%
                  </p>
                  <Delta
                    value={dashboard.data.stats.occupancy_rate_change_pct}
                  />
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>ADR (PHP)</p>
                  <p className="text-3xl font-semibold my-2">
                    {peso(dashboard.data.stats.adr)}
                  </p>
                  <Delta value={dashboard.data.stats.adr_change_pct} />
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-primary shadow-lg">
                  <p>RevPAR (PHP)</p>
                  <p className="text-3xl font-semibold my-2">
                    {peso(dashboard.data.stats.revpar ?? 0)}
                  </p>
                  <Delta value={dashboard.data.stats.revpar_change_pct} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Bookings Over Time
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Reservations created
                  </p>

                  <div className="w-full h-[300px] bg-secondary p-4 rounded-xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bookingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => {
                            const d = new Date(date + "T00:00:00");
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                          }}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                          labelFormatter={(date) => {
                            const d = new Date(date + "T00:00:00");
                            return d.toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#4f46e5"
                          fill="#c7d2fe"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Revenue Over Time
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">PHP (₱)</p>

                  <div className="w-full h-[300px] bg-secondary p-4 rounded-xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => {
                            const d = new Date(date + "T00:00:00");
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                          }}
                        />
                        <YAxis tickFormatter={formatPesoShort} />
                        <Tooltip
                          formatter={(value) => {
                            return `₱${formatCurrency(Number(value))}`;
                          }}
                          labelFormatter={(date) => {
                            const d = new Date(date + "T00:00:00");
                            return d.toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#4f46e5"
                          fill="#c7d2fe"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
