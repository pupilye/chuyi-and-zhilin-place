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
  by: string;
  id: string;
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

  currentViewEvents: CalendarEvent[] = [];
  recurringEvents: RecurringEvent[] = [{
    title: 'Monday Lesson',
    start: new Date('2018-09-24T18:30:00'),
    end: new Date('2018-09-24T21:00:00'),
    recurringTimes: 10,
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
    by: 'Week',
    id: this.dayToString(new Date()),
  },
  {
    title: 'Wednesday Lesson',
    start: new Date('2018-09-26T18:30:00'),
    end: new Date('2018-09-26T21:00:00'),
    recurringTimes: 10,
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
    by: 'Week',
    id: this.dayToString(new Date()),
  },
  {
    title: 'Thursday Lesson',
    start: new Date('2018-09-27T18:30:00'),
    end: new Date('2018-09-27T21:00:00'),
    recurringTimes: 10,
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
    by: 'Week',
    id: this.dayToString(new Date()),
  },
  {
    title: 'Friday Lesson',
    start: new Date('2018-09-28T16:30:00'),
    end: new Date('2018-09-28T17:30:00'),
    recurringTimes: 10,
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
    by: 'Week',
    id: this.dayToString(new Date()),
  }
];

  eventsFromNormal: CalendarEvent[] = [
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
      meta: {
        id: this.dayToString(new Date()),
      }
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
      allDay: true,
      meta: {
        id: this.dayToString(new Date()),
      }
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
      draggable: true,
      meta: {
        id: this.dayToString(new Date()),
      }
    }
  ];
  eventsFromRecurring: CalendarEvent[] = [];
  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(private modal: NgbModal) { }

  ngOnInit() {
    this.events = this.eventsFromNormal.concat(this.eventsFromRecurring);
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

  addNormalEvent(): void {
    this.eventsFromNormal.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: {
        id: this.dayToString(new Date()),
      }
    });
    this.eventUpdate();
    this.refresh.next();
  }

  addRecurringEvent(): void {
    this.recurringEvents.push({
      title: 'New Recurring Event',
      start: startOfDay(new Date()),
      recurringTimes: 10,
      color: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      },
      by: 'Week',
      id: this.dayToString(new Date()),
    });
  }

  eventUpdate(): void {
    this.events = this.eventsFromNormal.concat(this.eventsFromRecurring);
  }

  reCalRecurringEvents(): void {
    this.eventsFromRecurring = [];
    for (const recurringEvent of this.recurringEvents) {
      if (!(recurringEvent.by === 'Week' || recurringEvent.by === 'Day' || recurringEvent.by === 'Month')) {
        alert(`Something wrong for ${recurringEvent.title}`);
      }
      const dayGap = recurringEvent.by === 'Week' ? 7 : ( recurringEvent.by === 'Day' ? 1 : 30 );
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
          },
          meta: {
            id: this.dayToString(new Date()),
          }
        });
      }
    }
    this.eventUpdate();
  }

  dayToString(date: Date): string { // 'yyyymmddhhmmss'
    const year = String(date.getUTCFullYear());
    const month = date.getUTCMonth() < 10 ? String(date.getUTCMonth()) : String(date.getUTCMonth());
    const day = date.getUTCDate() < 10 ? String(date.getUTCDay()) : String(date.getUTCDay());
    const hour = date.getUTCHours() < 10 ? String(date.getUTCHours()) : String(date.getUTCHours());
    const minute = date.getUTCMinutes() < 10 ? String(date.getUTCMinutes()) : String(date.getUTCMinutes());
    const second = date.getUTCSeconds() < 10 ? String(date.getUTCSeconds()) : String(date.getUTCSeconds());
    return year + month + day + hour + minute + second;
  }

}
