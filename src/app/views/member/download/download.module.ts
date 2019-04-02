import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OurCommonModule} from '../../../modules/common.module';
import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from './download.component';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    CommonModule,
    DownloadRoutingModule,   FlexLayoutModule,OurCommonModule
  ],
  declarations: [DownloadComponent],
})


export class DownloadModule { }
