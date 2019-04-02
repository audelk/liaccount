import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OurCommonModule} from '../../modules/common.module';
import { MemberComponent } from './member.component';
import {MemberRoutingModule} from './member-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MemberProfileComponent} from './memberprofile.component';

@NgModule({
  imports: [
    CommonModule,MemberRoutingModule,OurCommonModule,FlexLayoutModule
  ],
  declarations: [MemberComponent,MemberProfileComponent ],
  entryComponents:[MemberProfileComponent]
})
export class MemberModule { }
