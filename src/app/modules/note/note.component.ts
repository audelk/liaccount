import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddnewComponent } from '../../views/admin/addnew.component';
@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class NoteComponent implements OnInit {
  public res = new Response();
  isLoading = false;
  formFields: any;
  fields = ['note'];
  fieldsEdit = ['note'];
  formFieldsEdit: any;
  type = ''; uID;
  record: any = {};
  formOptions: any;
  model:any;
  opts: any = { title: 'New Record', buttonText: 'Submit' };
  constructor(
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    public lang: LanguageService,
    private router: Router,
    public snack: MatSnackBar,
    public dataSvc: DataService) {
    this.uID = this.userSvc.editingUserID;
    this.type = this.route.snapshot.data['type'];
    this.formOptions = {
      iconLabel: true
    };
  }

  ngOnInit() {
    this.list();
  }
  add(form) {
    let that = this;
    form.type = this.type;
    form.user_id=this.uID;
    that.userSvc.appiCall(UserService.actions.UserAddNote,form).subscribe(res => {
      
      that.userSvc.showSnak(res);
      that.list();
    })
  }
  delete(id) {
    let that = this;
    if (confirm('Delete note?'))
      that.userSvc.appiCall(UserService.actions.UserDeleteNote,{ type: this.type, id: id }).subscribe(res => {

        that.userSvc.showSnak(res);
        that.list();
      })
  }
  edit(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.opentEditDialog(id, that.formFieldsEdit, 'note', 'Update  Note');
  }
  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.UserGetNotes, { type: this.type, user_id: this.uID }).subscribe(res => {
      that.res = res;
      that.model=res.data.model;
      if (that.res.status)
        if (that.formFields == undefined)
           that.formFields = that.createFormFields();

    });
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
      model[f].attr.value = rec[f];
      model[f].value = rec[f];
      fields.push(this.userSvc.createFormField(model[f]));
    }
    return fields;
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
  openNewDialog() {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFields, opts: { title: 'Add Note', buttonText: 'Add' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.add(result);
      }
    });
  }
  update(form, action) {
    let that = this;
    form.type = this.type;

    that.userSvc.appiCall(UserService.actions.UserUpdateNote,form).subscribe(res => {

        that.userSvc.showSnak(res);
        that.list();
      })
   
      
  }
}

