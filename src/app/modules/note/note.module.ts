import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteRoutingModule } from './/note-routing.module';
import { NoteComponent } from './note.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    CommonModule,
    NoteRoutingModule,FlexLayoutModule,OurCommonModule
  ],
  declarations: [NoteComponent]
})
export class NoteModule { }
