import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormDirective } from '../../directives/form/form.directive';
import { Response, DataService } from '../../providers/data.service';
import { UserService } from '../../services/user.service';
import {Router,ActivatedRoute} from '@angular/router';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
@Component({
  selector: 'app-gaccount',
  templateUrl: './gaccount.component.html',
  styles: []
})
export class GaccountComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: 'upload_url' });
  public hasBaseDropZoneOver: boolean = false;
  public res = new Response();
  //public borrowerNewRes = new Response();
  loans=[];
  formFields: any;
  formFieldsEdit: any;
  formFieldsEditProfile: any;
  formFieldsEditPass: any;
  formFieldsEditProfilePic: any;
  formResult: any;
  fields = ['email','first_name', 'middle_name', 'last_name', 'mobile'];
  fieldsEditPass = ['password'];
  fieldsEdit = ['email','first_name', 'middle_name', 'last_name','mobile'];
  fieldsEditProfile = ['birth_date', 'gender', 'country','province', 'city', 'address', 'zip'];
  fieldsEditPic = ['profile_pic'];
  uID;
  picture="";
  type='';
  record:any={};
  formOptions:any;
  opts:any={title:'New Record',buttonText:'Submit'};
  loaded=false;
  password='';
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public userSvc: UserService, 
    public dataSvc:DataService,
    public composeDialog: MatDialog,
    private snack: MatSnackBar,
  ) { 

    this.uID=this.userSvc.user.user_id;
    this.type=this.route.snapshot.data['type'];
    this.formOptions = {
      iconLabel: true
    };
  }

  ngOnInit() {
    this.get();
  }
  get() {
    let that = this;
    that.userSvc.userGet({type:this.type,user_id:this.uID}).subscribe(res => {
       that.res = res;
       that.record = that.res.data.record;
       that.formFieldsEdit = this.createFormFieldsEdit(JSON.parse(JSON.stringify(this.userSvc[this.type+'Model'])), this.fieldsEdit);
       that.formFieldsEditProfile = this.createFormFieldsEdit(JSON.parse(JSON.stringify(this.userSvc[this.type+'ProfileModel'])), this.fieldsEditProfile);
       that.formFieldsEditPass = this.createFormFieldsEdit(JSON.parse(JSON.stringify(this.userSvc[this.type+'Model'])), this.fieldsEditPass);
       that.formFieldsEditProfilePic = this.createFormFieldsEdit(JSON.parse(JSON.stringify(this.userSvc[this.type+'ProfileModel'])), this.fieldsEditPic);        
       that.loaded=true;
    });
  }
  createFormFieldsEdit(model, fieldsEdit) {
    let fields = [];
    let that = this;
    let rec = that.res.data.record;
    for (var i = 0; i < fieldsEdit.length; i++) {
      
      let f = fieldsEdit[i];
      f=='password'? rec[f]=this.password:'';
      model[f].attr.value = rec[f];
      model[f].value = rec[f];
      fields.push(this.userSvc.createFormField(model[f]));
    }
    return fields;
  }
  onSubmit(type,form: any) {    
    form.value.user_id = this.uID;    
    this.update(form.value, type);
  }   
  update(form, action) {
    let that = this;
    form.type=this.type;
    this.password= form.password || this.password;
    if (action == 'account')
      that.userSvc.userUpdate(form).subscribe(res => {
        that.showSnak(res);
        that.get();
      })
    else if(action=="password"){
      that.userSvc.UpdatePassword(form).subscribe(res => {
        that.showSnak(res);
        that.get();
      })
    }
    else{
        form.birth_date !=undefined ? form.birth_date=that.userSvc.dateOnly(form.birth_date):''; 
        that.userSvc.userUpdateProfile(form).subscribe(res => {
        that.showSnak(res);
        that.get();
      })
    }
     
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
