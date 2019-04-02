import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormDirective } from '../../../directives/form/form.directive';
import { Response, DataService } from '../../../providers/data.service';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styles: []
})
export class SmtpComponent implements OnInit {
  public res = new Response();
  formFields: any;
  formFieldsEdit: any;
  uID;
  loaded = false;
  accountID;
  fieldsEdit = ['smtp_email', 'smtp_password', 'from_name','reply_to',"type",'signature'];
  model = {
    "smtp_email": {
      "attr": {
        "label": "Username",
        "type": "text",
        "value": "",
        "placeholder": "Username"
      },
      "validators": { "required": true }, "editable": true, "value": "",
      "key": "smtp_email"
    },
    "smtp_password": {
      "attr": {
        "label": "Password",
        "type": "text",
        "value": "",
        "placeholder": "Password"
      },
      "validators": { "required": true }, "editable": true, "value": "",
      "key": "smtp_password"
    },
    "from_name": {
      "attr": {
        "label": "From Name",
        "type": "text",
        "value": "",
        "placeholder": "From Name"
      },
      "validators": { "required": true }, "editable": true, "value": "",
      "key": "from_name"
    },
    "reply_to": {
      "attr": {
        "label": "Reply to",
        "type": "text",
        "value": "",
        "placeholder": "Reply to"
      },
      "validators": { "required": true }, "editable": true, "value": "",
      "key": "reply_to"
    },
    "type": {
      "attr": {
        "label": "Account Type",
        "type": "enum",
        "value": "",
        "placeholder": "Account Type",
        "values":{"Lender":"Lender","Realtor":"Realtor"}
      },
      "validators": { "required": false }, "editable": true, "value": "",
      "key": "type"
    },
    "signature": {
      "attr": {
        "label": "Signature",
        "type": "textarea",
        "value": "",
        "placeholder": "Signature",       
      },
      "validators": { "required": false }, "editable": true, "value": "",
      "key": "signature"
    },
  }
  formOptions: any;
  opts: any = { title: 'Settings', buttonText: 'Submit' };
  constructor(private route: ActivatedRoute,
    public router: Router,
    public userSvc: UserService,
    public dataSvc: DataService,
    public composeDialog: MatDialog,
    private snack: MatSnackBar) {
    this.uID = this.userSvc.user.user_id;
  }

  ngOnInit() {
    this.formOptions = {
      iconLabel: true
    };
    this.accountID = this.route.snapshot.paramMap.get('id');
    this.getSettings();
  }
  getSettings() {
    let that = this;
    that.loaded = false;
    that.userSvc.appiCall(UserService.actions.AccountSettings, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.loaded = true;
        that.userSvc.inAccountSettings = res.data;
        that.formFieldsEdit = that.createFormFieldsEdit(that.model, that.fieldsEdit)
      }
    })
  }
  createFormFieldsEdit(model, fieldsEdit) {
    let fields = [];
    let that = this;
    let rec = that.userSvc.inAccountSettings.data;
    for (var i = 0; i < fieldsEdit.length; i++) {
      let f = fieldsEdit[i];

      model[f].attr.value = rec[f];
      model[f].value = rec[f];
      fields.push(this.userSvc.createFormField(model[f]));
    }
    return fields;
  }

  onSubmit(form: any) {
    this.updateSettings(form.value)
  }

  updateSettings(smtp) {
    let that = this;
    let form = { accountID: this.accountID };
    this.userSvc.inAccountSettings.data = Object.assign({}, this.userSvc.inAccountSettings.data, smtp);
    form = Object.assign({}, this.userSvc.inAccountSettings, form);
    that.userSvc.appiCall(UserService.actions.AccountSettingsUpdate, form).subscribe(res => {
      if (res.status) {
        that.userSvc.showSnak(res);
      }
    });

  }
}
