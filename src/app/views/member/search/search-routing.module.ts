import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import {SearchComponent} from './search.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent, pathMatch: 'full',
    data: {
      title: 'Search Fields'
    },    
  },  
  { path: '**', redirectTo: '', pathMatch: 'full' }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
