import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentmethodComponent } from './paymentmethod.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxStripeModule } from 'ngx-stripe';
const routes: Routes = [
  {
    path: '',
    component: PaymentmethodComponent, pathMatch: 'full',
    data: {
      title: 'Payment Method'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule,
    //NgxStripeModule.forRoot('pk_test_i2yFtgfrWLS7smZCDynZaU2T'),
    NgxStripeModule.forRoot('pk_live_YTpuxJ8oNxEgfjCdqZ0SWNuQ'),
    

  ],
  declarations: [PaymentmethodComponent]
})

export class PaymentmethodModule { }
