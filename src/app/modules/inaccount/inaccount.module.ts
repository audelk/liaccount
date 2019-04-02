import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InaccountComponent } from './inaccount.component';
import { OurCommonModule } from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: '',
    component: InaccountComponent,
    data: {
      title: 'InAccount',breadcrumb: 'InAccount',
    },
    children: [
   
      {
        path: 'downloads', pathMatch: 'full',
        data: { type: 'member',title: 'Downloads', breadcrumb: 'Downloads',},
        loadChildren: '../../modules/connection/connection.module#ConnectionModule',
      },  

      
      
      {
        path: 'inbox', 
        data: { type: 'member', breadcrumb: 'Inbox',title:'Inbox' },
        loadChildren: '../../modules/inbox/inbox.module#InboxModule',
      },
       {
        path: 'training',
        loadChildren: '../../modules/support/support.module#SupportModule',
        data: { title: 'Training Videos', breadcrumb: 'Training Videos'}
      },
  
    ]
  },
  { path: '**', redirectTo: '/inbox', pathMatch: 'full' }

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes), FlexLayoutModule, OurCommonModule

  ],
  declarations: [InaccountComponent]
})
export class InaccountModule { }
