import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

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

import { Colors } from '../shared/constants';
import { RecurringEvent } from '../shared/types';


@Injectable({
  providedIn: 'root'
})
export class PlannerService {

  public normalEvents: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: Colors.red,
      // actions: this.actions,
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
      color: Colors.yellow,
      // actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: Colors.blue,
      allDay: true,
      meta: {
        id: this.dayToString(new Date()),
      }
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: Colors.yellow,
      // actions: this.actions,
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

  public recurringEvents: RecurringEvent[] = [{
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
  }];

  constructor() { }

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
