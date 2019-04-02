import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DataService, Response, ServerResponse } from '../../providers/data.service';
import { CustomValidation } from '../../helpers/formhelpers';
import { LanguageService } from '../../services/language.service';
import { FormFieldBase, TextboxField } from '../../helpers/dynamicform/formmodels';
//Our 3 steps proccess
enum ProgressTypes {
  request_reset_code = 1,
  submit_reset_code = 2,
  new_password = 3,
  done = 4
};

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  private formModels: any;
  data = new Response();
  loading: any;
  success = true;
  isLoading = false;
  stepText='';
  stepTexts=['1. We need your email used in your account.','2. Please input your reset code.',
      '3. Input your new password'
  ];
  formOptions: any;
  progressTypes = ProgressTypes;
  progress = ProgressTypes.request_reset_code;
  private resetType;
  private resetTypeValue;
  constructor(
    public userSvc: UserService,
    public lang: LanguageService
  ) {

    this.formModels = {
      requestResetCode: {
        submitText: 'Request Reset Email', title: 'Email', fields: [], onSubmit: this.onSubmit, success: false
      },
      submitResetCode: {
        submitText: 'Submit Reset Code', title: 'Mobile', fields: [], onSubmit: this.onSubmit, success: false
      },
      newPassword: {
        submitText: 'Update Password', title: 'Password', fields: [], onSubmit: this.onSubmit, success: false
      }
    }
    this.formOptions = {
      iconLabel: true
    }
  }

  ngOnInit() {
    this.fillFormFields();
  }

  fillFormFields() {
    //field settings
    let emailOpts = {
      key: 'email',
      controlType: "textbox",
      attr: {
        placeholder: 'Email',
        label: 'Enter email',
        type: 'email',
        value: '', icon: 'fa fa-envelope'
      },
      validators: {
        maxLength: 50, minLength: 5, required: true, email: true
      }
    }
    //create textbox field and add to form
    this.formModels.requestResetCode.fields.push(new TextboxField(emailOpts));

    //field settings
    let resetCodeOpts = {
      key: 'resetcode',
      controlType: "textbox",
      attr: {
        placeholder: '00000',
        label: 'Input reset code you recieved.',
        type: 'text',
        value: '',icon:'fa fa-barcode'
      },
      validators: {
        maxLength: 50, minLength: 4, required: true
      }
    }
    //create textbox field and add to form
    this.formModels.submitResetCode.fields.push(new TextboxField(resetCodeOpts));


    //field settings
    let passwordOpts = {
      key: 'password',
      attr: {
        placeholder: 'Password',
        label: 'Input new password',
        type: 'password',
        value: '',icon:'fa fa-lock'
      },

      validators: {
        maxLength: 50, minLength: 8, required: true
      }
    };
    this.formModels.newPassword.fields.push(new TextboxField(passwordOpts));
    let cpasswordOpts = {
      key: 'confirmPasswrod',
      attr: {
        placeholder: 'Confirm password',
        label: 'Confirm password',
        type: 'password',
        value: ''
      },

      validators: {
        maxLength: 50, minLength: 8, required: true
      }
    };
    //create textbox field and add to form
    //this.formModels.newPassword.fields.push(new TextboxField(cpasswordOpts));


  }

  /**
   * Request password reset code using email or mobile phone
  */
  doRequest(form) {
    let that = this;
    that.isLoading = true;
    that.userSvc.resetCodeRequest(form.value).subscribe(
      data => {
        that.isLoading = false;
        that.data = data;
        if (data.status) {
          this.resetType = data.data.resetType;
          this.resetTypeValue = data.data.resetTypeValue;
          this.progress++;
        }
      }
    );
  }
  /**
   * Submit reset code for validation
   * @param form
   */
  doSubmitCode(form) {
    form.value.resetType = this.resetType;
    form.value.resetTypeValue = this.resetTypeValue;
    let that = this;
    that.isLoading = true;
    that.userSvc.resetCodeValidateReset(form.value).subscribe(data => {
      that.isLoading = false;
      that.data = data;
      if (data.status) {

        that.progress++;
      }
    })
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
      if (data.status) {
        that.progress++;
      }

    })

  }

  gotoLogin() {

  }
  onSubmit(form: any) {
    let that = this;
    if (that.progress == that.progressTypes.request_reset_code) {
      that.doRequest(form);
    }
    else if (that.progress == that.progressTypes.submit_reset_code) {
      that.doSubmitCode(form);
    }
    else if (that.progress == that.progressTypes.new_password) {
      that.doNewPassword(form);
    }
  }
  onSubmitEmail(form: any) {
    let that = this;   
    debugger
    that.isLoading = true;
    form.value.action=UserService.actions.RequestResetLink;
    that.userSvc.requestResetLink(form.value).subscribe(
      data => {
        that.isLoading = false;
        that.data = data;
        if(data.status==true)
            that.progress++;
 
      }
    );

  }
}
