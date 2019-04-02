import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OurCommonModule} from '../../modules/common.module';
import { ResourceComponent } from './resource.component';
import {ResourceRoutingModule} from './resource-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,ResourceRoutingModule,OurCommonModule,FlexLayoutModule
  ],
  declarations: [ResourceComponent ],
})
export class ResourceModule { }
