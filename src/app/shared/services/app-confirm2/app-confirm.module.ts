import { AppConfirmService2 } from './app-confirm.service';
import { 
  MatDialogModule,
  MatButtonModule
 } from '@angular/material';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComfirmComponent } from './app-confirm.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [AppComfirmComponent],
  declarations: [AppComfirmComponent],
  providers: [AppConfirmService2],
  entryComponents: [AppComfirmComponent]
})
export class AppConfirmModule2 { }