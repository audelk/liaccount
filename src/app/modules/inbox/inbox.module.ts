import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InboxComponent } from './inbox.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
const routes: Routes = [
  {
    path: '',
    component: InboxComponent, pathMatch: 'full',
    data: {
      title: 'Inbox',breadcrumb: 'Inbox'
    },
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [
      CommonModule,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule

  ],
  declarations: [InboxComponent]
})
export class InboxModule { }
