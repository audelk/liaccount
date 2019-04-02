import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {OurCommonModule} from '../../modules/common.module';
@NgModule({
  imports: [
    CommonModule,OurCommonModule,FlexLayoutModule,
    SettingsRoutingModule
  ],
  declarations: [SettingsComponent]
})

export class SettingsModule { }
