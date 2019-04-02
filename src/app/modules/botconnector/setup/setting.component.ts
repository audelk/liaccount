import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Response, DataService } from '../../../providers/data.service';
import { LanguageService } from '../../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../../shared/services/navigation.service';
import { AddnewComponent } from '../../../views/admin/addnew.component';

@Component({
  selector: 'setup-app-setting>',
  templateUrl: './setting.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class SettingComponent implements OnInit {

  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "BotConnectorMessage"
  isLoading = false;
  record: any = {};
  formOptions: any;
  accountID;
  currentCon;
  formFields: any;
  fields = ['message', 'countdown_to_send','always_send'];
  fieldsEdit = ['message', 'countdown_to_send','always_send'];
  formFieldsEdit: any;
  public items: any;
  model: any;
  connectorID;
  settings: any = {
    data:{
    auto_reply_enabled: true,
    auto_reply_id: 0, first_message_id: 0, on_vacation_enabled: false, on_vacation_id: 0
    }
  };
  constructor(
    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,
    private navSvc: NavigationService,
    public dataSvc: DataService) {

    this.formOptions = {
      iconLabel: true
    };

  }
  ngOnInit() {
    this.accountID = this.route.snapshot.paramMap.get('id');
    this.connectorID = this.route.snapshot.paramMap.get('sid');
    this.list();
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
  }
  createFormFields() {
    let model = this.res.data.model;
    let fields = [];
 debugger
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
    }
    return fields;
  }

  createFormFieldsEdit(id, model, fieldsEdit, type) {
    let fields = [];
    let that = this;
    debugger
    let rec = that.res.data.records[type].find(rec => rec.id === id);
    for (var i = 0; i < fieldsEdit.length; i++) {
      let f = fieldsEdit[i];
      model[f].attr.value = rec[f];
      model[f].value = rec[f];
      fields.push(this.userSvc.createFormField(model[f]));
    }

    return fields;
  }
  delete(id) {
    let that = this;
    if (confirm('Delete ' + that.objectName + '?'))
      that.userSvc.appiCall(UserService.actions[that.objectName + "Delete"], { accountID: this.accountID, id: id }).subscribe(res => {
        that.userSvc.showSnak(res);
        that.list();
      })
  }
  edit(id, type) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit, type);
    that.opentEditDialog(id, that.formFieldsEdit, that.objectName, 'Update ' + that.objectName);
  }
  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"], { accountID: this.accountID, connectorID: this.connectorID }).subscribe(res => {
      that.res = res;
      that.model = res.data.model;
      if (that.res.status) {
        that.items = res.data.records;
        that.getSettings();
        if (that.formFields == undefined)
          that.formFields = that.createFormFields();
      }
    });
  }
  getSettings() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[ "BotConnectorSettings"], { accountID: this.accountID, connectorID: this.connectorID }).subscribe(res => {
      if (that.res.status) {
        that.settings = res.data;
      }
    });
  }
  opentEditDialog(id, fields, action, title) {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: fields, opts: { title: title, buttonText: 'Update' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        result.id = id;
        that.update(result, action);
      }
    });
  }

  updateMsgStatus(event,type){
    let that=this;
    let form={ accountID: this.accountID, connectorID: this.connectorID };
    this.settings.data[type]=event.checked;
    form= Object.assign({},  this.settings,form);
    that.userSvc.appiCall(UserService.actions[ "BotConnectorSettingsUpdate"], form).subscribe(res => {
      if (res.status) {
         that.userSvc.showSnak(res);
      }
    });
  }

  update(form, action) {
    let that = this;
    form.accountID = this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Update"], form).subscribe(res => {
      that.userSvc.showSnak(res);
      that.list();
    })


  }
}
