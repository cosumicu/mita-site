import api from "../axiosInstance";
import type { DashboardRange, HostDashboardResponse } from "../../definitions";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_HOST}/analytics`;

const getHostCalendarData = async (start: string, end: string) => {
  const response = await api.get(`${BASE_URL}/host-calendar/`, {
    params: { start, end },
  });
  return response.data;
};

const getHostDashboard = async (range: DashboardRange) => {
  const response = await api.get<HostDashboardResponse>(
    `${BASE_URL}/host-dashboard/`,
    {
      params: { range },
    }
  );
  return response.data;
};

const analyticsService = {
  getHostCalendarData,
  getHostDashboard,
};

export default analyticsService;
