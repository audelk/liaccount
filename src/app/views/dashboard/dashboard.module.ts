import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './/dasboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {OurCommonModule} from '../../modules/common.module';
import { ChartModule } from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import { FlexLayoutModule } from '@angular/flex-layout';
export function highchartsFactory() {
  let temp=require('highcharts/highstock');
  return temp;
}
@NgModule({
  imports: [
    CommonModule,ChartModule,
    DashboardRoutingModule,FlexLayoutModule,OurCommonModule
  ],
  declarations: [DashboardComponent],
    providers: [
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ]
})
export class DashboardModule { }
