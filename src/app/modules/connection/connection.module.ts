import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConnectionComponent } from './connection.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: '',
    component: ConnectionComponent,
    data: {
      title: 'Downloads',breadcrumb: 'Downloads'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];


@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule
  ],
  declarations: [ConnectionComponent]
})
export class ConnectionModule { }





