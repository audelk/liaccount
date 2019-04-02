import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
import {UserService} from '../../../services/user.service';
@Component({
  selector: 'app-confirm',
  template: `<h1 matDialogTitle>{{ data.title }}</h1>
    <div mat-dialog-content>{{ userSvc.autoLogOutMessage }}</div>
    <div mat-dialog-actions>
    <button 
    type="button" 
    mat-raised-button
    color="primary" 
    (click)="dialogRef.close(true)">Continu working</button>
    &nbsp;
    <span fxFlex></span>
    <button 
    type="button"
    color="accent"
    mat-raised-button 
    (click)="dialogRef.close(false)">Logout</button>
    </div>`,
})
export class AppComfirmComponent {
      public test;
  constructor(
    public dialogRef: MatDialogRef<AppComfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,

    public userSvc:UserService
  ) {}
}