import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OurCommonModule } from '../../modules/common.module';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../admin/container.component';
import { MemberComponent } from './member.component';
import { MemberProfileComponent } from './memberprofile.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    data: { title: 'Home', breadcrumb: 'Home', },
    children: [

      {
        path: '', component: MemberProfileComponent,

        children: [

          {
            path: 'accounts',
            data: { type: 'member', title: 'Accounts', breadcrumb: 'Accounts' },
            loadChildren: '../../modules/account/account.module#AccountModule',
          },      
       

          { path: '**', redirectTo: 'accounts', pathMatch: 'full' }
        ]
      },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
