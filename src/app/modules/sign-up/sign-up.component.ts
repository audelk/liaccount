import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {
  public res = new Response();public res1 = new Response();
  public resn = new Response();
  formFields: any;model: any;
  fields = ['email', 'first_name','last_name'];
  public objectName = "Prospect"
  isLoading = false;
  loaded=false;
  formOptions:any;
  accountLoaded=false;
  constructor(  public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,

    public dataSvc: DataService) {
         this.formOptions = {
      iconLabel: true
    };
     }

  ngOnInit() {
    this.loaded=false;
    this.isLoading=false;
    this.accountLoaded=false;
    this.list();
  }
   createFormFields() {
    let model = this.res1.data.model;
    let fields = [];
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
    }
    return fields;
  }
  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Model"],{},"public").subscribe(res => {
      that.res1 = res;
      that.model = res.data.model;     
      if (that.res1.status) {      
        this.loaded=true;
        if (that.formFields == undefined)
          that.formFields = that.createFormFields();
      }
    });
  }
  onSubmit(form){
    this.add(form.value);
  }
  add(form) {
    let that = this;
    that.isLoading=true;
    that.accountLoaded=false;
    that.userSvc.appiCall(UserService.actions[that.objectName + "AddPublic"], form,'public').subscribe(res => {
      that.res = res;that.isLoading=false;
      if(that.res.status)
        that.accountLoaded=true;
    })
    
  }
}
