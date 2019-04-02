import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule} from '@angular/router'; 
import {DownloadComponent} from './download.component';
const routes:Routes=[
  {
    path:'',component:DownloadComponent,pathMatch:'full'
  },
  {
    path :'**', redirectTo:'',pathMatch:'full'
  }

]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class DownloadRoutingModule { }
