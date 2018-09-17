import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';

import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  }
};

interface RecurringEvent {
  title: string;
  start: Date;
  end?: Date;
  recurringTimes: number;
  color: {
    primary: string,
    secondary: string,
  };
  byMonth?: boolean;
  byWeek?: boolean;
  byDay?: boolean;
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  currentViewEvents: CalendarEvent[] = [];
  recurringEvents: RecurringEvent[];
  eventsFromNormal: CalendarEvent[] = [];
  eventsFromRecurring: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(private modal: NgbModal) { }

  ngOnInit() {
  }

  dayClicked({ date, events }: {date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event, newStart, newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: {
        primary: '#000000',
        secondary: '#555555',
      },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    });
    this.refresh.next();
  }

  addRecurringEvent(): void {
    this.recurringEvents.push({
      title: 'New Recurring Event',
      start: startOfDay(new Date()),
      recurringTimes: 10,
      color: {
        primary: '#000000',
        secondary: '#555555',
      },
      byWeek: true,
      byMonth: false,
      byDay: false,
    });
  }

  changeEventList(): void {

  }

  reCalRecurringEvents(): void {
    for (const recurringEvent of this.recurringEvents) {
      if (!recurringEvent.byWeek && !recurringEvent.byDay) {alert(`Something wrong for ${recurringEvent.title}`); }
      const dayGap = recurringEvent.byWeek ? 7 : ( recurringEvent.byDay ? 1 : 30 );
      for (const index of Array.from(Array(recurringEvent.recurringTimes).keys())) { // Start from 0
        this.eventsFromRecurring.push({
          title: `Event ${index} for ${recurringEvent.title}`,
          start: addDays(recurringEvent.start, dayGap * index),
          end: recurringEvent.end ? addDays(recurringEvent.end, dayGap * index) : undefined,
          color: recurringEvent.color,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          }
        });
      }
    }
  }

}
