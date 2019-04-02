import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OurCommonModule } from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProspectComponent } from './prospect.component';
const routes: Routes = [
  {
    path: '',
    component: ProspectComponent, pathMatch: 'full',
    data: {
      title: 'Managed Accounts', breadcrumb: 'ProspectComponent'
    },
  },
  {
    path: 'paymentmethod/:id', pathMatch: 'full',
    data: { type: 'member', title: 'Payment Method', breadcrumb: 'Payment Method' },
    loadChildren: '../../modules/paymentmethod/paymentmethod.module#PaymentmethodModule',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes), FlexLayoutModule, OurCommonModule
  ],
  declarations: [ProspectComponent]
})
export class ProspectModule { }
