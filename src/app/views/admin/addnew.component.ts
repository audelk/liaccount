import { Component, OnInit,ViewEncapsulation,Inject } from '@angular/core';
import { FormDirective } from '../../directives/form/form.directive';
import { UserService } from '../../services/user.service';
import { FormFieldBase, TextboxField } from '../../helpers/dynamicform/formmodels';
import { MAT_DIALOG_DATA,MatDialog,MatDialogRef} from '@angular/material';
@Component({
  selector: 'app-addnew',
  templateUrl: './addnew.component.html',
  styles: [],
  encapsulation:ViewEncapsulation.None
})
export class AddnewComponent implements OnInit {
  formFields:any;
  formOptions:any;
  opts:any={title:'New Record',buttonText:'Submit'}
  constructor(
    public userSvc: UserService, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddnewComponent>
  ) { 
    this.formOptions = {
      iconLabel: true
    };

    this.formFields=data.formFields;
    this.opts =data.opts!=undefined?data.opts:this.opts;
  }

  ngOnInit() {
    
  }

  onSubmit(form: any) {       
     
     this.dialogRef.close(form.value);

  }

}
