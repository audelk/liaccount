import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { GaccountComponent } from './gaccount.component';
import { ContainerComponent } from '../../views/admin/container.component';
const routes: Routes = [
  {
    path: '',
    component: GaccountComponent, pathMatch: 'full',
    data: {
      title: 'Account'
    },    
  },  
  { path: '**', redirectTo: '', pathMatch: 'full' }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaccountRoutingModule { }
