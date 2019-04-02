import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AffiliateComponent } from './affiliate.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: '',
    component: AffiliateComponent, pathMatch: 'full',
    data: {
      title: 'Affiliates'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule
  ],
  declarations: [AffiliateComponent]
})
export class AffiliateModule { }
