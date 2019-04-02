import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DataService, Response, ServerResponse } from '../../providers/data.service';
import { CustomValidation } from '../../helpers/formhelpers';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormFieldBase, TextboxField } from '../../helpers/dynamicform/formmodels';

@Component({
  selector: 'app-reset-link',
  templateUrl: './reset-link.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class ResetLinkComponent implements OnInit {

  private formModels: any;
  data = new Response();
  loading: any;
  success = true;
  isLoading = false;
  tk:any;
  public passwordUpdated=false;
  formOptions: any;
  tokenExpired:boolean=false;
  private resetType;
  private resetTypeValue;
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public userSvc: UserService,
    public lang: LanguageService,
    public dataSvc:DataService
  ) {
    this.tk=this.route.snapshot.paramMap.get('tk');
    let temp=this.dataSvc.decodeToken(this.tk);  
    
    if(this.tk!=false){
    this.dataSvc.sessionSave(this.tk,'resetCodeToken');
    this.formModels = {
      newPassword: {
        submitText: 'Update Password', title: 'Password', fields: [], onSubmit: this.onSubmit, success: false
      }
      
    }
    this.formOptions = {
      iconLabel: true
    }
    }

  }
  validateToken(tk){
    this.dataSvc.decodeToken(tk)
  }
  ngOnInit() {
    this.fillFormFields();
  }

  fillFormFields() {


    //field settings
    let passwordOpts = {
      key: 'password',
      attr: {
        placeholder: 'Password',
        label: 'Input new password',
        type: 'text',
        value: '', icon: 'fa fa-lock'
      },

      validators: {
        maxLength: 50, minLength: 8, required: true
      }
    };
    this.formModels.newPassword.fields.push(new TextboxField(passwordOpts));


  }


  /**
   * Submit new password
   * @param form
   */
  doNewPassword(form) {
    let that = this;
    that.isLoading = true;
    form.value.resetType = that.resetType;
    form.value.resetTypeValue = that.resetTypeValue;
    that.userSvc.resetCodeUpdatePassword(form.value).subscribe(data => {
      that.isLoading = false;
      that.data = data;
      that.passwordUpdated=data.status;



    })

  }

  gotoLogin() {

  }
  onSubmit(form: any) {
    let that = this;

    that.doNewPassword(form);

  }
  onSubmitEmail(form: any) {
    let that = this;
    debugger
    that.isLoading = true;
    form.value.action = UserService.actions.RequestResetLink;
    that.userSvc.resetCodeRequest(form.value).subscribe(
      data => {
        that.isLoading = false;
        that.data = data;

      }
    );

  }

}
