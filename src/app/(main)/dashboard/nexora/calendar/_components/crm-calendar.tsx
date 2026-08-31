"use client";

import * as React from "react";

import { useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import listPlugin from "@fullcalendar/react/list";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { differenceInCalendarDays, format } from "date-fns";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";

import { RecordFormDialog } from "@/app/(main)/dashboard/nexora/_components/record-form-dialog";
import { EventCalendarViews } from "@/components/calendar/event-calendar-views";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const views = [
  { key: "dayGridMonth", label: "Month" },
  { key: "timeGridWeek", label: "Week" },
  { key: "timeGridDay", label: "Day" },
  { key: "listWeek", label: "Agenda" },
];

const plugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

export interface CalendarEventInput {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay: boolean;
}

export function CrmCalendar({ events }: { events: CalendarEventInput[] }) {
  const controller = useCalendarController();
  const [eventCount, setEventCount] = React.useState(events.length);
  const [title, setTitle] = React.useState(() => format(new Date(), "MMMM yyyy"));
  const [days, setDays] = React.useState(30);

  return (
    <div className="flex flex-col overflow-hidden rounded-md border">
      <div className="flex flex-col gap-4 border-b bg-sidebar p-4 text-sidebar-foreground lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 shrink-0 flex-col gap-1">
          <div className="font-medium text-lg leading-none">{title}</div>
          <p className="text-muted-foreground text-sm">
            {days} days · {eventCount} scheduled items
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ButtonGroup>
            <Button size="icon" variant="outline" onClick={() => controller.prev()} aria-label="Previous period">
              <ChevronLeft />
            </Button>
            <Button variant="outline" onClick={() => controller.today()}>
              Today
            </Button>
            <Button size="icon" variant="outline" onClick={() => controller.next()} aria-label="Next period">
              <ChevronRight />
            </Button>
          </ButtonGroup>
          <Select value={controller.view?.type ?? views[0].key} onValueChange={(value) => controller.changeView(value)}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                {views.map((view) => (
                  <SelectItem key={view.key} value={view.key}>
                    {view.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <RecordFormDialog
            triggerLabel="New event"
            title="Schedule event"
            description="Book a meeting, demo, or internal review on the shared CRM calendar."
            successMessage="Event scheduled"
            fields={[
              { name: "title", label: "Title", required: true, colSpan: 2 },
              { name: "type", label: "Type", type: "select", options: ["Meeting", "Demo", "Call", "Internal review"] },
              { name: "account", label: "Account" },
              { name: "start", label: "Start", type: "date" },
              { name: "end", label: "End", type: "date" },
              { name: "notes", label: "Agenda", type: "textarea", colSpan: 2 },
            ]}
          />
        </div>
      </div>

      <EventCalendarViews
        controller={controller}
        initialView={views[0].key}
        plugins={[...plugins]}
        popoverCloseContent={() => <XIcon className="size-5 text-muted-foreground group-hover:text-foreground" />}
        events={events}
        nowIndicator
        datesSet={(info) => {
          setTitle(info.view.title);
          setDays(differenceInCalendarDays(info.view.currentEnd, info.view.currentStart));
          setEventCount(
            events.filter((event) => {
              const start = new Date(event.start);

              return start >= info.start && start < info.end;
            }).length,
          );
        }}
      />
    </div>
  );
}
