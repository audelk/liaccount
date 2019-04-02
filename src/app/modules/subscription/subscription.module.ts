import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionComponent } from './subscription.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent, pathMatch: 'full',
    data: {
      title: 'Subscription'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule
  ],
  declarations: [SubscriptionComponent]
})
export class SubscriptionModule { }
