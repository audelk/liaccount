import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GlobalsearchComponent } from './globalsearch.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: '',
    component: GlobalsearchComponent, pathMatch: 'full',
    data: {
      title: 'Search',breadcrumb: 'Search'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];


@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule
  ],
  declarations: [GlobalsearchComponent]
})
export class GlobalsearchModule { }





