import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatStepperModule} from '@angular/material/stepper';
import { RegisterClientLinkComponent } from './register-client-link.component';
import { QuestionaireComponent } from './questionaire.component';
import { NgxStripeModule } from 'ngx-stripe';
import { FormsModule } from '@angular/forms';
import {VippaymentmethodComponent } from '../../modules/vippaymentmethod/vippaymentmethod.component';
const routes: Routes = [
  {
    path: '',
    component: RegisterClientLinkComponent, pathMatch: 'full',
    data: {
      title: 'Complete Registration',breadcrumb:'Complete Registration'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
@NgModule({
  imports: [
    CommonModule, FormsModule ,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule,MatStepperModule,
  //  NgxStripeModule.forRoot('pk_test_083yVGQ8ng2n54fr94Rw3GXS'),
    NgxStripeModule.forRoot('pk_live_YTpuxJ8oNxEgfjCdqZ0SWNuQ'),
  ],
  declarations: [RegisterClientLinkComponent, QuestionaireComponent,VippaymentmethodComponent]
})
export class RegisterClientLinkModule { }
