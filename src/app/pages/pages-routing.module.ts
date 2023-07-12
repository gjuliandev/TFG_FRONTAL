import { PathLocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from '../guards/is-logged-in.guard';
import { BackendComponent } from './backend/backend.component';
import { HomeComponent } from './home/home.component';
import { MonitorComponent } from './monitor/monitor.component';
import { TpvComponent } from './tpv/tpv.component';


export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
        {
          path: 'home',
          component: HomeComponent
        },
        {
          path: 'tpv',
          canActivate: [IsLoggedInGuard],
          component: TpvComponent
        },
        {
          path: 'monitor',
          component: MonitorComponent
        },
        {
          path: 'backend',
          canActivate: [IsLoggedInGuard],
          component: BackendComponent
        }
    ]
  }
];