"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useMemo } from "react";
import { HostCalendarEvent } from "@/app/lib/definitions";
import { Drawer, Spin } from "antd";
import ReservationDetailsDrawer from "../drawer/ReservationDetailsDrawer";

type Props = {
  reservations: HostCalendarEvent[];
  onDatesSet?: (start: string, end: string) => void;
};

function getEventColor(status: string) {
  return "#7289da"; // blue for default
}

export default function HostCalendar({ reservations, onDatesSet }: Props) {
  const [isReservationDetailsDrawerOpen, setIsReservationDetailsDrawerOpen] =
    useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  // Transform reservations to FullCalendar events
  const events = useMemo(
    () =>
      reservations.map((r) => ({
        id: r.id,
        title: r.title,
        start: r.start,
        end: addOneDay(r.end),
        backgroundColor: getEventColor(r.status), // <-- Add this
        borderColor: getEventColor(r.status), // Optional: same as background
        textColor: "#fff", // Optional: color of text
        extendedProps: {
          status: r.status,
          property_id: r.property_id,
          guest: r.guest,
          confirmation_code: r.confirmation_code,
          reservationData: r,
        },
      })),
    [reservations]
  );

  // Handle date range changes (month navigation)
  const handleDatesSetAlternative = (dateInfo: any) => {
    if (onDatesSet) {
      const currentDate = dateInfo.view.currentStart;
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Get the first day of the current month
      const startDate = new Date(year, month, 1);
      const start = formatDate(startDate);

      // Get the last day of the current month
      const endDate = new Date(year, month + 1, 0);
      const end = formatDate(endDate);

      onDatesSet(start, end);
    }
  };

  // Handle event click to open drawer
  const handleEventClick = (info: any) => {
    console.log("Reservation clicked:", {
      id: info.event.id,
      guest: info.event.extendedProps.guest,
      confirmation_code: info.event.extendedProps.confirmation_code,
    });

    // Set the selected reservation ID and open the drawer
    setSelectedReservationId(info.event.id);
    setIsReservationDetailsDrawerOpen(true);
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsReservationDetailsDrawerOpen(false);
    setSelectedReservationId(null);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        // Use datesSet to detect month changes
        datesSet={handleDatesSetAlternative}
        eventClick={handleEventClick}
        // Optional: Add cursor pointer to indicate clickable events
        eventDisplay="block"
        // Optional: Tooltip showing actual dates
        eventContent={(arg) => {
          return {
            html: `
              <div class="fc-event-title">
                ${arg.event.title}
              </div>
            `,
          };
        }}
      />

      <Drawer
        title="Reservation Details"
        placement="right"
        width={500}
        onClose={() => setIsReservationDetailsDrawerOpen(false)}
        open={isReservationDetailsDrawerOpen}
      >
        {selectedReservationId ? (
          <ReservationDetailsDrawer reservationId={selectedReservationId} />
        ) : (
          <Spin />
        )}
      </Drawer>
    </div>
  );
}

// Helper function to add 1 day to a date string
function addOneDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
