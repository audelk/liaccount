import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DataService, Response } from '../../providers/data.service';
import { FormFieldBase, TextboxField, CheckboxField } from '../../helpers/dynamicform/formmodels';
import { LanguageService } from '../../services/language.service';
import { Validators, FormGroup, FormControl,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import {CustomValidation} from '../../helpers/formhelpers';
import { MatProgressBar, MatButton } from '@angular/material';
import { DynamicFormService } from '../../helpers/dynamicform/form.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-affiliatereg',
  templateUrl: './affiliatereg.component.html',
  styles: []
})
export class AffiliateregComponent implements OnInit {

  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  success = false;

  loginFields: any;
  formErrors: Array<string>;
  data = new Response();
  res = new Response();
  formOptions: any;
  isLoading = false;
  signup: FormGroup;
  progressMode = 'indeterminate';
  ready = false;
  loaded=false;
  affiliateID='0';
  constructor(
    public dataSvc: DataService,
    public userSvc: UserService,
    public lang: LanguageService,
    private router: Router,
    private dfs: DynamicFormService,
        private route:ActivatedRoute,
  ) {
    this.formOptions = {
      iconLabel: true
    }
  }

  ngOnInit() {
    this.affiliateID=this.route.snapshot.paramMap.get('id');
    debugger
    this.loginFields = this.createLoginFields();
    this.signup = this.dfs.toFormGroup(this.loginFields);
  }

  /**
   * Create login fields
   */
  createLoginFields() {
    let fields: FormFieldBase<any>[] = [];

    let userNameOpts = {
      key: 'user_name',
      attr: {
        placeholder: 'Username',
        label: 'Enter your username',
        type: 'text',
        icon: 'fa fa-user'
      },
      order: 1,
      validators: {
        maxLength: 50, minLength: 8, required: true, pattern: '^[a-zA-Z0-9]+$'
      }
    };
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
    let passwordOpts = {
      key: 'password',
      attr: {
        placeholder: 'Password',
        label: 'Password',
        type: 'password',
        icon: 'fa fa-lock'
      },
      order: 2,
      validators: {
        maxLength: 50, minLength: 8, required: true
      }
    };
      let tos = {
      key: 'tos',
      attr: {
        placeholder: 'I have read and agree to the terms of service.',
        label: 'Terms and Conditions',
        type: 'checkbox',
        icon: ''
      },
      order:3,
      validators: {
         required: true,
         maxLength:4
      }
    };

    let affiliate = {
      key: 'affiliate_id',
      value:this.affiliateID,
      attr: {
        placeholder: 'Affiliate Code',
        label: 'Enter affiliate code',
        type: 'text',
        icon: 'fa device_hub',
        value:this.affiliateID
      },
      order: 4,
      validators: {
        maxLength: 20, minLength: 4, required: true, 
      }
    };

    fields.push(new TextboxField(userNameOpts));
    fields.push(new TextboxField(emailOpts));
    fields.push(new TextboxField(passwordOpts));
    fields.push(new TextboxField(affiliate));
    
    //if(this.TOS)
    //fields.push(new CheckboxField(tos));
    return fields.sort((a, b) => a.order - b.order);
  }

  doSignUp() {
    let that = this;
    //Perform loggging in
    let form=this.signup;
    if(form.status!="INVALID"){
    form.value.action = UserService.actions.RegisterMe;
    that.isLoading = true;
    that.loaded=false;  
    form.value.affiliate=true;
    that.userSvc.register(form.value).subscribe(
      data => { 
        that.loaded=true;
        that.isLoading = false;
        that.data = data;
        this.progressBar.mode = 'determinate';
        this.progressBar.value=100;      
        
 
      }

    )
    }

  }

  

}

