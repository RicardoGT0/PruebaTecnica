import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page/dashboardPage.component';
import { FormPrividerPageComponent } from './pages/formProvider/formPrivider-page/formPrividerPage.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  {
    path: 'formProvider/:id',
    component: FormPrividerPageComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
];
