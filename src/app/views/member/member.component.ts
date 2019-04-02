import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddnewComponent } from '../admin/addnew.component';
import { FileUploadPage } from '../admin/fileupload.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class MemberComponent implements OnInit {
  public res = new Response();
  public userNewRes = new Response();
  type = 'member';
  isLoading = false;
  formFields: any;
  formFieldsEdit: any;
  formFieldsEditPass: any;
  formFieldsEditProfile: any;
  formFieldsEditProfilePic: any;
  formResult: any;
  fields = ['user_name', 'password', 'email','sign_up_stamp'];
  fieldsEdit = ['first_name', 'middle_name', 'last_name', 'email', 'mobile','sign_up_stamp'];
  fieldsEditPass = ['password'];
  fieldsEditProfile = ['birth_date', 'gender', 'country', 'province', 'city', 'address', 'zip'];
  fieldsEditPic = ['profile_pic'];
  searchText = "";
  constructor(
 
    public composeDialog: MatDialog,
    public userSvc: UserService,
    public lang: LanguageService,
    private router: Router,
    public snack: MatSnackBar,
    public dataSvc: DataService) {

  }

  ngOnInit() {
    

    this.list();

  }
  add(form) {
    let that = this;
    form.type = this.type;
    form.birth_date !=undefined ? form.birth_date=that.userSvc.dateOnly(form.birth_date):''; 
    form.sign_up_stamp !=undefined ? form.sign_up_stamp=that.userSvc.dateOnly(form.sign_up_stamp):''; 
   
    that.userSvc.userAdd(form).subscribe(res => {
      that.userNewRes = res;
      that.showSnak(res);
      that.list();
    })
  }
  createFormFields() {
    let model = this.userSvc.memberModel;
    let fields = [];
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
    }
    return fields;
  }

  createFormFieldsEdit(id, model, fieldsEdit) {
    let fields = [];
    let that = this;

    let rec = that.res.data.records.find(rec => rec.user_id === id);
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
    if (confirm('Delete member?'))
      that.userSvc.userDelete({ type: this.type, id: id }).subscribe(res => {
        that.userNewRes = res;
        that.showSnak(res);
        that.list();
      })
  }

  edit(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.userSvc.memberModel)), this.fieldsEdit);
    that.opentEditDialog(id, that.formFieldsEdit, 'account', 'Update  Account');
  }
  editPass(id) {
    let that = this;
    that.formFieldsEditPass = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.userSvc.memberModel)), this.fieldsEditPass);
    that.opentEditDialog(id, that.formFieldsEditPass, 'account', 'Update Password');
  }
  editProfile(id) {
    let that = this;
    that.formFieldsEditProfile = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.userSvc.memberProfileModel)), this.fieldsEditProfile);
    that.opentEditDialog(id, that.formFieldsEditProfile, 'profile', 'Update  Profile');
  }
  editPicture(id) {
    let that = this;
    that.formFieldsEditProfilePic = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.userSvc.memberProfileModel)), this.fieldsEditPic);
    that.opentFileUploadDialog(id, that.formFieldsEditProfilePic, 'picture', 'Update Picture');
  }
  list() {
    let that = this;
    that.userSvc.userList({ type: this.type }).subscribe(res => {
      that.res = res;
      if (that.res.status)
        if (that.formFields == undefined)
          that.formFields = that.createFormFields();

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
        result.user_id = id;
        that.update(result, action);
      }
    });
  }
  opentFileUploadDialog(id, fields, action, title) {
    let that = this;
    let res = that.dataSvc.sessionGet(that.userSvc.loginTokenKey);
    let dialogRef = this.composeDialog.open(FileUploadPage, {
      width: "720px",
      data: {
        formFields: fields, opts: {
          title: title, buttonText: 'Update',
          token: res.data.token,
          userID: id,
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.userNewRes = result;
        that.list();
      }
    });
  }
  openNewDialog() {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFields, opts: { title: 'Add Member', buttonText: 'Add' } }
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
    if (action == 'account'){
       form.sign_up_stamp !=undefined ? form.sign_up_stamp=that.userSvc.dateOnly(form.sign_up_stamp):''; 
  
      that.userSvc.userUpdate(form).subscribe(res => {
        that.userNewRes = res;
        that.showSnak(res);
        that.list();
      })}
    else{
       form.birth_date !=undefined ? form.birth_date=that.userSvc.dateOnly(form.birth_date):''; 
      that.userSvc.userUpdateProfile(form).subscribe(res => {
        that.userNewRes = res;
        that.showSnak(res);
        that.list();
      })
    }
      
  }
  showSnak(res) {
    if (res.status) {
      if (res.successes.length > 0)
        this.snack.open(res.successes[0], 'OK', { verticalPosition: 'top', duration: 4000 })
    }
    else {
      if (res.errors.length > 0)
        this.snack.open(res.errors[0], 'OK', { verticalPosition: 'top', duration: 4000 });
    }
  }
}
