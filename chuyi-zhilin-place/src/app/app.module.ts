// From Platform
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// From APP
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EPlannerComponent } from './e-planner/e-planner.component';
import { EAccountingComponent } from './e-accounting/e-accounting.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CalendarComponent } from './e-planner/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    EPlannerComponent,
    EAccountingComponent,
    MainPageComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
