import { Component, OnInit,ViewEncapsulation,Inject } from '@angular/core';
import { FormDirective } from '../../directives/form/form.directive';
import { UserService } from '../../services/user.service';
import {DataService} from '../../providers/data.service';
import { FormFieldBase, TextboxField } from '../../helpers/dynamicform/formmodels';
import { MAT_DIALOG_DATA,MatDialog,MatDialogRef} from '@angular/material';
@Component({
  selector: 'file-upload-page',
  templateUrl: './fileupload.html',
  styles: [],
  encapsulation:ViewEncapsulation.None
})
export class FileUploadPage implements OnInit {
  formFields:any;
  formOptions:any;
  opts:any={title:'New Record',buttonText:'Submit'}
  additionalParameter={user_id:0, 'action': "UploadProfilePicuser" };
  authToken:any;
  isHTML5=true;
  queueLimit=10;
  url='';
  isLoading=false;
  picture='';
  constructor(
    public dataSvc:DataService,
    public userSvc: UserService, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileUploadPage>
  ) { 
    this.formOptions = {
      iconLabel: true
    };
    
    this.formFields=data.formFields;
    this.picture=data.formFields[0].value;
    this.opts =data.opts!=undefined?data.opts:this.opts;
    this.authToken="Bearer " + this.opts.token;
    this.url=this.dataSvc.url;
    this.additionalParameter.user_id=this.opts.userID;
  }

  ngOnInit() {
    
  }

  onSubmit(form: any) {   
    
     this.picture=form.data.thumb_medium;
    
     this.dialogRef.close(form);
    //this.doLogin(event);
  }

}
