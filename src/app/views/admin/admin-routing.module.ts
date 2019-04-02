import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OurCommonModule } from '../../modules/common.module';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container.component';
import { AdminComponent } from './admin.component';
import { AdminProfileComponent } from './adminprofile.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    data: {
      title: 'Admins'
    },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full', data: { title: 'List', breadcrumb: 'List' } },
      { path: 'list', component: AdminComponent, pathMatch: 'full' },
      {
        path: ':id', component: AdminProfileComponent,
        data: { title: 'Loan ', breadcrumb: 'Profile', pathMatch: 'full' },
        children: [
          {
            path: '',
            data: { type: 'admin' },
            loadChildren: '../../modules/gaccount/gaccount.module#GaccountModule',

          }
        ]
      },

      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
