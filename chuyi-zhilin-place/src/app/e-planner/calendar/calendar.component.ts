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

import { RecurringEvent } from '../../shared/types';
import { PlannerService } from '../../services/planner.service';


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

  eventsFromNormal: CalendarEvent[];
  eventsFromRecurring: CalendarEvent[] = [];
  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(
    private modal: NgbModal,
    private plannerService: PlannerService) { }

  ngOnInit() {
    this.initNormalEvents();
    this.reCalRecurringEvents();
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
    this.plannerService.normalEvents.push({
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
    this.eventsFromNormal.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      actions: this.actions,
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
    this.plannerService.recurringEvents.push({
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
    for (const recurringEvent of this.plannerService.recurringEvents) {
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
          actions: this.actions,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          meta: {
            id: recurringEvent.id,
          }
        });
      }
    }
    this.eventUpdate();
  }

  initNormalEvents(): void {
    this.eventsFromNormal = [];
    for (const normalEvent of this.plannerService.normalEvents) {
      this.eventsFromNormal.push({
          title: normalEvent.title,
          start: normalEvent.start,
          end: normalEvent.end,
          color: normalEvent.color,
          actions: this.actions,
          draggable: normalEvent.draggable,
          resizable: normalEvent.resizable,
          meta: normalEvent.meta,
      });
    }
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
