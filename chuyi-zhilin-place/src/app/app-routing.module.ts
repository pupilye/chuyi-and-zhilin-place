import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// From the app
import { MainPageComponent } from './main-page/main-page.component';
import { EPlannerComponent } from './e-planner/e-planner.component';
import { EAccountingComponent } from './e-accounting/e-accounting.component';

const routes: Routes = [
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: 'mainpage', component: MainPageComponent },
  { path: 'eplanner', component: EPlannerComponent },
  { path: 'eaccounting', component: EAccountingComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ],
  declarations: []
})
export class AppRoutingModule { }
