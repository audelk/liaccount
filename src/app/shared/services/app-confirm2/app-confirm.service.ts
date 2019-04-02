import { Observable } from 'rxjs/Observable';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

import { AppComfirmComponent } from './app-confirm.component';

interface confirmData {
  title?: string,
  message?: string,
  disableClose?:boolean
}

@Injectable()
export class AppConfirmService2 {

  constructor(private dialog: MatDialog) { }

  public confirm(data:confirmData = {}): Observable<boolean> {
    data.title = data.title || 'Confirm';
    data.message = data.message || 'Are you sure?';
    let dialogRef: MatDialogRef<AppComfirmComponent>;
    dialogRef = this.dialog.open(AppComfirmComponent, {
      width: '380px',
      disableClose: data.disableClose,
      data: {title: data.title, message: data.message}
    });
    return dialogRef.afterClosed();
  }
}