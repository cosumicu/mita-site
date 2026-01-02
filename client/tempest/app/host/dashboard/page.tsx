"use client";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { Button, Segmented } from "antd";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Range = "week" | "month" | "year";

const bookingsData = [
  { date: "Jan", count: 12 },
  { date: "Feb", count: 18 },
  { date: "Mar", count: 9 },
  { date: "Apr", count: 22 },
];

const revenueData = [
  { date: "Jan", revenue: 45000 },
  { date: "Feb", revenue: 62000 },
  { date: "Mar", revenue: 38000 },
  { date: "Apr", revenue: 71000 },
];

const DashboardPage = () => {
  const dispatch = useAppDispatch();

  const [range, setRange] = useState<"week" | "month" | "year">("month");

  return (
    <div className="m-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-xl sm:text-3xl">Dashboard</p>
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
        <div className="flex justify-end">
          <Segmented<Range>
            options={[
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
              { label: "This Year", value: "year" },
            ]}
            value={range}
            onChange={(value) => setRange(value)}
          />
        </div>

        {/* Stats cards */}
        <div className="flex justify-between gap-4 p-6 border border-gray-200 rounded-lg">
          <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
            <p>Total Monies</p>
            <p>Admin</p>
            <p>Admin</p>
            <p>Admin</p>
          </div>
          <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
            <p>Occupancy Rate</p>
            <p className="text-3xl font-semibold my-2">67%</p>
          </div>
          <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
            <p>Total Income</p>
            <p className="text-3xl font-semibold my-2">PHP 12,300</p>
            <p className="font-semibold text-green-600">+12%</p>
          </div>
          <div className="flex-1 bg-white rounded-xl p-4 border-l-4 border-l-primary shadow-lg">
            <p>{"ADR (PHP)"}</p>
            <p className="text-3xl font-semibold my-2">PHP 1,300</p>
            <p className="font-semibold text-red-600">-5%</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {" "}
            <h3 className="text-lg font-semibold mb-1">Bookings Over Time</h3>
            <p className="text-sm text-gray-500 mb-3">Confirmed reservations</p>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
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
            {" "}
            <h3 className="text-lg font-semibold mb-1">Revenue Over Time</h3>
            <p className="text-sm text-gray-500 mb-3">PHP (₱)</p>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `₱${Number(value).toLocaleString()}`}
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
    </div>
  );
};

export default DashboardPage;
