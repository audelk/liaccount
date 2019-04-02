import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TaskmanagerComponent } from './taskmanager.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
const routes: Routes = [
  {
    path: '',
    component: TaskmanagerComponent, pathMatch: 'full',
    data: {
      title: 'Tasks Manager',breadcrumb: 'Tasks Manager'
    },
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }

];
@NgModule({
  imports: [
       CommonModule,RouterModule.forChild(routes),FlexLayoutModule,MatSlideToggleModule,OurCommonModule

  ],
  declarations: [TaskmanagerComponent]
})
export class TaskmanagerModule { }
