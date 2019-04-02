import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
@Component({
  selector: 'app-botconnector',
  templateUrl: './botconnector.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class BotconnectorComponent implements OnInit {

  public res = new Response();
  public resT = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "BotConnector"
  isLoading = false;
  record: any = {};
  formOptions: any;
  accountID;
  currentCon;
  formFields: any;
  fields = ['name', 'status','enable_link_click_check'];
  fieldsEdit = ['name', 'status','enable_link_click_check'];
  formFieldsEdit: any;
  public items: any[];
  public templates:any[];
  model: any;
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
    this.templates=[];
  }

  ngOnInit() {
    this.accountID = this.route.snapshot.paramMap.get('id');
    
    this.templates=[];
    this.listTemplate();
    this.list();
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
    this.getNotifications();
  }
  getNotifications() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.GetInNotifications, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.userSvc.notifications = res.data;
      }
    });
  }
add(form) {
    let that = this;
    form.accountID = this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Add"], form).subscribe(res => {
      if (res.status) {
        that.res = res;
        that.userSvc.showSnak(res);
        this.list();
        
      }
    })
  }
  createFormFields() {
    let model = this.res.data.model;
    let fields = [];
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
    }
    return fields;
  }

  createFormFieldsEdit(id, model, fieldsEdit) {
    let fields = [];
    let that = this;

    let rec = that.res.data.records.find(rec => rec.id === id);
    for (var i = 0; i < fieldsEdit.length; i++) {
      let f = fieldsEdit[i];
      model[f].attr.value = rec[f].toString();
      model[f].value = rec[f].toString();
      fields.push(this.userSvc.createFormField(model[f]));
    }
    return fields;
  }
  createFormFieldsEditTemplate(id, model, fieldsEdit) {
    let fields = [];
    let that = this;

    let rec = that.resT.data.records.find(rec => rec.id === id);
    for (var i = 0; i < fieldsEdit.length; i++) {
      let f = fieldsEdit[i];
      model[f].attr.value = rec[f].toString();
      model[f].value = rec[f].toString();
      fields.push(this.userSvc.createFormField(model[f]));
    }
    return fields;
  }

  delete(id) {
    let that = this;
    if (confirm('Delete Campaign?'))
      that.userSvc.appiCall(UserService.actions[that.objectName + "Delete"], { accountID: this.accountID, id: id }).subscribe(res => {
        that.userSvc.showSnak(res);
        that.list();
      })
  }
  edit(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.opentEditDialog(id, that.formFieldsEdit, that.objectName, 'Update Campaign');
  }
  duplicate(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.openDuplicateDialog(id, that.formFieldsEdit, that.objectName, 'Duplicate Campaign');
  }

  deleteTemplate(id) {
    let that = this;
    if (confirm('Delete Template?'))
      that.userSvc.appiCall(UserService.actions[that.objectName + "DeleteTemplate"], { accountID: this.accountID, id: id }).subscribe(res => {
        that.userSvc.showSnak(res);
        that.listTemplate();
      })
  }

  editTemplate(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEditTemplate(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.opentEditDialogTemplate(id, that.formFieldsEdit, that.objectName, 'Update Template');
  }
  duplicateTemplate(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEditTemplate(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.openDuplicateDialogTemplate(id, that.formFieldsEdit, that.objectName, 'Add Template As Campaign');
  }

  saveAsTemplate(id){
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.openSaveAsTemplateDialog(id, that.formFieldsEdit, that.objectName, 'Save as Template');

  }
  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"], { accountID: this.accountID }).subscribe(res => {
      that.res = res;
      that.model = res.data.model;
      if (that.res.status) {
        that.items = res.data.records;
        if (that.formFields == undefined)
          that.formFields = that.createFormFields();
      }
    });
  }
  listTemplate() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "ListTemplate"], { accountID: this.accountID }).subscribe(res => {
      that.resT=res;
      if (that.resT.status) {
        that.templates = res.data.records;
 
      }
    });
  }
  openDuplicateDialog(id, fields, action, title) {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: fields, opts: { title: title, buttonText: 'Duplicate' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        result.id = id;
        that.addDuplicate(result, action);
      }
    });
  }
  openDuplicateDialogTemplate(id, fields, action, title) {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: fields, opts: { title: title, buttonText: 'Add as Campaign' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        result.id = id;
        that.addDuplicate(result, action);
      }
    });
  }
openSaveAsTemplateDialog(id, fields, action, title) {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: fields, opts: { title: title, buttonText: 'Save as template' } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        result.id = id;
        that.addAsTemplate(result, action);
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

  opentEditDialogTemplate(id, fields, action, title) {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: fields, opts: { title: title, buttonText: 'Update' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        result.id = id;
        that.updateTemplate(result, action);
      }
    });
  }

  openNewDialog() {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFields, opts: { title: 'Add Campaign', buttonText: 'Add' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.add(result);
      }
    });
  }

  update(form, action) {
    let that = this;
    form.accountID=this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Update"], form).subscribe(res => {
      that.userSvc.showSnak(res);
      that.list();
    });
  }
  updateTemplate(form, action) {
    let that = this;
    form.accountID=this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "UpdateTemplate"], form).subscribe(res => {
      that.userSvc.showSnak(res);
      that.listTemplate();
    });
  }
  addDuplicate(form, action) { 
    let that = this;

    form.accountID=this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Duplicate"], form).subscribe(res => {
      that.userSvc.showSnak(res);
      that.list();
    });
  }
  addDuplicateTemplate(form, action) {
    let that = this;
    form.accountID=this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "DuplicateTemplate"], form).subscribe(res => {
      that.userSvc.showSnak(res);
      that.listTemplate();
    });
  }
  addAsTemplate(form, action) {
    let that = this;
    form.accountID=this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "SaveAsTemplate"], form).subscribe(res => {
      that.userSvc.showSnak(res);
      that.listTemplate();
    })


  }
}
