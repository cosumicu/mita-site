"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMemo } from "react";
import { HostCalendarEvent } from "@/app/lib/definitions";

type Props = {
  reservations: HostCalendarEvent[];
};

export default function HostCalendar({ reservations }: Props) {
  const events = useMemo(() => {
    return reservations.map((r) => ({
      id: r.id,
      title: r.title,
      start: r.start,
      end: r.end,
      extendedProps: {
        status: r.status,
        property_id: r.property_id,
        guest: r.guest,
        confirmation_code: r.confirmation_code,
      },
    }));
  }, [reservations]);

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps.status;

          switch (status) {
            case "APPROVED":
              return ["bg-green-500", "border-green-600", "text-white"];
            case "COMPLETED":
              return ["bg-blue-500", "border-blue-600", "text-white"];
            case "PENDING":
              return ["bg-yellow-500", "border-yellow-600", "text-black"];
            case "CANCELLED":
              return ["bg-red-500", "border-red-600", "text-white"];
            default:
              return ["bg-gray-400", "border-gray-500", "text-white"];
          }
        }}
        eventClick={(info) => {
          console.log("Reservation:", {
            id: info.event.id,
            guest: info.event.extendedProps.guest,
            confirmation_code: info.event.extendedProps.confirmation_code,
          });
        }}
      />
    </div>
  );
}
