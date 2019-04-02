import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from '../admin/container.component';
import { ResourceComponent } from './resource.component';
const routes: Routes = [
  {
    path: '',
    component: ResourceComponent,
    data: {
      title: 'Resource'
    },
    
  },
   { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
