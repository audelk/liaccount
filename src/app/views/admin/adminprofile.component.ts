import { Component, OnInit,ViewEncapsulation,Inject } from '@angular/core';
import { FormDirective } from '../../directives/form/form.directive';
import { Response, DataService } from '../../providers/data.service';
import { UserService } from '../../services/user.service';
import {Router,ActivatedRoute} from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AddnewComponent } from '../admin/addnew.component';
import { FileUploadPage } from '../admin/fileupload.component';
@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.component.html',
  styles: [],
  encapsulation:ViewEncapsulation.None
})
export class AdminProfileComponent implements OnInit {
  public res = new Response();
  public borrowerNewRes = new Response();
  loans=[];
  formFields: any;
  formFieldsEdit: any;
  formFieldsEditProfile: any;
  formFieldsEditProfilePic: any;
  formResult: any;
  fields = ['first_name', 'middle_name', 'last_name', 'mobile'];
  fieldsEdit = ['first_name', 'middle_name', 'last_name', 'mobile'];
  fieldsEditProfile = ['birth_date', 'gender', 'country','province', 'city', 'address', 'zip'];
  fieldsEditPic = ['profile_pic'];
  uID;
  picture="";
  type='admin';
  routeUrl='/admins/adminprofile/';
  record:any={};
  constructor(
     private route: ActivatedRoute,
    public router: Router,
    public userSvc: UserService, 
    public dataSvc:DataService,
    public composeDialog: MatDialog,
    private snack: MatSnackBar,
  ) { 
    let id=this.uID=this.route.snapshot.paramMap.get('id');  
    this.userSvc.editingUserID=this.uID; 
    this.routeUrl+=this.uID;
  }

  ngOnInit() {

    this.get();
   /* this.route.url.subscribe(url =>{
       this.router.navigateByUrl('admin/adminprofile/'+id+'/acc/'+id);
    });*/
  }
 
   get() {
    let that = this;
    that.userSvc.userGet({type:this.type,user_id:this.uID}).subscribe(res => {
      that.res = res;
      if (that.formFields == undefined)
        that.formFields = that.createFormFields();
       // that.record = that.res.data.records.find(rec => rec.user_id === that.uID);
  
       that.record = that.res.data.record;
    });
  }
   createFormFields() {
    let model = this.userSvc.adminModel;
    let fields = [];
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
    }
    return fields;
  }
  createFormFieldsEdit(id, model, fieldsEdit) {
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
  update(form, action) {
    let that = this;
    form.type=this.type;
    if (action == 'account')
      that.userSvc.userUpdate(form).subscribe(res => {
        that.showSnak(res);
        that.borrowerNewRes = res;
        that.get();
      })
    else
      that.userSvc.userUpdateProfile(form).subscribe(res => {
        that.borrowerNewRes = res;
        that.showSnak(res);
        that.get();
      })
  }
 
 
  delete(id) {
    let that = this;
    
    if (confirm('Delete Admin?'))
      that.userSvc.userDelete({ id: id,type:this.type }).subscribe(res => {
        that.showSnak(res);
        that.router.navigateByUrl('admins/list');
      })
  }
  edit(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.userSvc.adminModel)), this.fieldsEdit);
    that.opentEditDialog(id, that.formFieldsEdit, 'account', 'Update Admin Account');
  }
  editProfile(id) {
    let that = this;
    that.formFieldsEditProfile = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.userSvc.adminProfileModel)), this.fieldsEditProfile);
    that.opentEditDialog(id, that.formFieldsEditProfile, 'profile', 'Update Admin Profile');
  }
  editPicture(id) {
    let that = this;
    that.formFieldsEditProfilePic = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.userSvc.adminProfileModel)), this.fieldsEditPic);
    that.opentFileUploadDialog(id, that.formFieldsEditProfilePic, 'picture', 'Update Admin Profile');
  }
  goTo(type){
    if(type=='profile'){
      this.editProfile(this.uID);
    }
    else if(type=='settings'){
      this.edit(this.uID);
    }
    else if(type=='picture'){
      this.editPicture(this.uID);
    }
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
        that.borrowerNewRes = result;
        that.get();
      }
    });
  }
   showSnak(res){
    if(res.status){
          if(res.successes.length>0)
            this.snack.open(res.successes[0], 'OK', { verticalPosition:'top', duration: 4000 })
        }
        else{
          if(res.errors.length>0)
          this.snack.open(res.errors[0], 'OK', {  verticalPosition:'top',duration: 4000 });
        }
  }

}
