import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VippaymentmethodextComponent } from './vippaymentmethodext.component';
import { Routes, RouterModule } from '@angular/router';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxStripeModule } from 'ngx-stripe';
const routes: Routes = [
  {
    path: '',
    component: VippaymentmethodextComponent, pathMatch: 'full',
    data: {
      title: 'Payment Method',breadcrumb:'Payment Method'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule,
     NgxStripeModule.forRoot('pk_live_YTpuxJ8oNxEgfjCdqZ0SWNuQ'),
  
  ],
  declarations: [VippaymentmethodextComponent]
})
export class VippaymentmethodextModule { }
