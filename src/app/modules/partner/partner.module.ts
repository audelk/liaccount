import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PartnerComponent } from './partner.component';
const routes: Routes = [
  {
    path: '',
    component: PartnerComponent, pathMatch: 'full',
    data: {
      title: 'Partners',breadcrumb:'Partners'
    },
  },
  {
    path: ':id', pathMatch: 'full',
    data: { type: 'member', breadcrumb: 'Settings', title: 'Settings' },
    loadChildren: '../../modules/affiliate/affiliate.module#AffiliateModule',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
@NgModule({
  imports: [
    CommonModule,
     RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule
  ],
  declarations: [PartnerComponent]
})
export class PartnerModule { }
