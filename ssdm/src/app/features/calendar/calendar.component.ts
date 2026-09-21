import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AssignmentService } from '../../core/services/api.services';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: true,
    selectable: true,
    dayMaxEvents: true,
    events: [],
    eventClick: (info: any) => {
      alert(
        `${info.event.title}\nDue: ${info.event.start?.toLocaleDateString()}\nSubject: ${info.event.extendedProps['subject']}`,
      );
    },
    eventDrop: (info: any) => {
      console.log('Assignment rescheduled:', info.event.title);
    },
  });

  constructor(private assignSvc: AssignmentService) {}

  ngOnInit() {
    this.assignSvc.getAll().subscribe((assignments) => {
      const events: EventInput[] = assignments.map((a) => ({
        id: String(a.id),
        title: a.title,
        date: a.dueDate.split('T')[0],
        backgroundColor: a.subjectColor,
        borderColor: a.subjectColor,
        extendedProps: {
          priority: a.priority,
          subject: a.subjectName,
          status: a.status,
        },
      }));
      this.calendarOptions.update((opts) => ({ ...opts, events }));
    });
  }
}
