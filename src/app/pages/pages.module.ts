import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesRoutes } from './pages-routing.module';
import { TpvComponent } from './tpv/tpv.component';
import { BackendComponent } from './backend/backend.component';
import { NgxPrintModule } from 'ngx-print';



@NgModule({
  declarations: [TpvComponent, BackendComponent],
  imports: [
    CommonModule,
    NgxPrintModule,
    RouterModule.forChild(PagesRoutes)
  ]
})
export class PagesModule { }
