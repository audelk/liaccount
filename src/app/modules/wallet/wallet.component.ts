import { Component, OnInit } from '@angular/core';
import { FormDirective } from '../../directives/form/form.directive';
import { Response, DataService } from '../../providers/data.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styles: []
})
export class WalletComponent implements OnInit {
  public res = new Response();
  formFields: any;
  formFieldsEdit: any;
  formResult: any;
  fieldsEdit = ['credits', 'credits_auto_fill', 'date_auto_fill','auto_fill'];
  record: any = {};
  formOptions: any;
  opts: any = { title: 'New Record', buttonText: 'Submit' };
  uID;
  type = '';
  loaded = false;
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public userSvc: UserService,
    public dataSvc: DataService,
    public composeDialog: MatDialog,
    private snack: MatSnackBar,
  ) {

    this.uID =  this.uID= this.userSvc.user.user_id;  
    this.type = this.route.snapshot.data['type'];
    this.formOptions = {
      iconLabel: true
    };
  }

  ngOnInit() {
    this.get();
  }
  get() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.UserGetWallet, { user_id: this.uID }).subscribe(res => {
      that.res = res;
      if(that.res.status){
             that.record = that.res.data.record;
      this.userSvc.user.wallet=that.record;  
      that.formFieldsEdit = this.createFormFieldsEdit(JSON.parse(JSON.stringify(that.res.data.model)), this.fieldsEdit);
      that.loaded = true;
      }
   
    });
  }
  createFormFieldsEdit(model, fieldsEdit) {
    let fields = [];
    let that = this;
    let rec = that.res.data.record;
    for (var i = 0; i < fieldsEdit.length; i++) {

      let f = fieldsEdit[i];

      model[f].attr.value = rec[f];
      model[f].value = rec[f];
      fields.push(this.userSvc.createFormField(model[f]));
    }
    return fields;
  }

}
