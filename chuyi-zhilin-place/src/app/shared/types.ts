export interface RecurringEvent {
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
