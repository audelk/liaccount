import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { OurCommonModule } from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { ChartModule } from 'angular2-highcharts';
//import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
const routes: Routes = [
  {
    path: '',
    component: AccountComponent, pathMatch: 'full',
    data: {
      title: 'Accounts', breadcrumb: 'Accounts'
    },
  },
  {
    path: 'setup/:id', pathMatch: 'full',
    data: { type: 'member', breadcrumb: 'Settings', title: 'Settings' },
    loadChildren: '../../modules/account/setup/setup.module#SetupModule',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
export function highchartsFactory() {
  //let temp=require('highcharts/highstock');
  //return temp;
}
@NgModule({
  imports: [
    CommonModule,
    //ChartModule,
    RouterModule.forChild(routes), FlexLayoutModule, OurCommonModule
  ],
  declarations: [AccountComponent],
  // providers: [
  // {
  // provide: HighchartsStatic,
  // useFactory: highchartsFactory
  // }
  //]
})


export class AccountModule { }
