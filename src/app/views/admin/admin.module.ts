import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OurCommonModule} from '../../modules/common.module';
import { AdminComponent } from './admin.component';
import {AdminRoutingModule} from './admin-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {AdminProfileComponent} from './adminprofile.component';

@NgModule({
  imports: [
    CommonModule,AdminRoutingModule,OurCommonModule,FlexLayoutModule
  ],
  declarations: [AdminComponent,AdminProfileComponent ],
   entryComponents:[AdminProfileComponent]
})
export class AdminModule { }
