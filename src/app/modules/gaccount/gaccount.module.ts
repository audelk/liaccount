import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OurCommonModule} from '../common.module';
import { GaccountRoutingModule } from './gaccount-routing.module';
import { GaccountComponent } from './gaccount.component';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    CommonModule,
    GaccountRoutingModule,FlexLayoutModule,OurCommonModule
  ],
  declarations: [GaccountComponent],
  entryComponents:[]
})
export class GaccountModule { }
