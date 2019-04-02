import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DataService, Response } from '../../providers/data.service';
import { FormFieldBase, TextboxField,CheckboxField } from '../../helpers/dynamicform/formmodels';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatProgressBar, MatButton } from '@angular/material';
import { DynamicFormService } from '../../helpers/dynamicform/form.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  success = false;
  loggedIn = false;
  loginFields: any;
  formErrors: Array<string>;
  data = new Response();
  res= new Response();
  formOptions: any;
  isLoading = false;
  signinForm: FormGroup;
  TOS=true;
  ready=false;
  universalMessage=false;
  constructor(
    public dataSvc:DataService,
    public userSvc: UserService,
    public lang: LanguageService,
    private router:Router,
    private dfs: DynamicFormService
  ) {
    this.formOptions = {
      iconLabel: true
    }

  }

  ngOnInit() {
    this.loadTOS();

  }
  /**
   * Create login fields
   */
  createLoginFields() {
    let fields: FormFieldBase<any>[] = [];

    let emailOpts = {
      key: 'userName',
      attr: {
        placeholder: 'Username',
        label: 'Enter your username',
        type: 'text',
        icon: 'fa fa-user'
      },
      order: 1,
      validators: {
        maxLength: 50, minLength: 5, required: true, 
      }
    };
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
        maxLength: 50, minLength: 4, required: true
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
    fields.push(new TextboxField(emailOpts));
    fields.push(new TextboxField(passwordOpts));
    //if(this.TOS)
    //fields.push(new CheckboxField(tos));
    return fields.sort((a, b) => a.order - b.order);
  }
  /**
     * Login user using email or mobile
     */
  doLogin() {
    let that = this;
    //Perform loggging in
    let form=this.signinForm;
    form.value.action = UserService.actions.LoginMe;
    that.isLoading = true;
    form.value.vip=1;
    that.userSvc.login(form.value).subscribe(
      data => {
 
        that.isLoading = true;
        that.data = data;
        this.progressBar.mode = 'determinate';
        this.progressBar.value=100;
        if(this.userSvc.user.loggedIn){
            that.router.navigateByUrl('/member');
        }
        
 
      }

    )

  }
  onSubmit() {
    this.progressBar.mode = 'query';
    
    this.doLogin();
  }
  loadTOS(){
    let that=this;
    that.ready=false;
    that.userSvc.appiCall(UserService.actions.GetTOS,{},'public').subscribe(res=>{
        this.res=res;
        that.ready=true;
        this.TOS=false,// res.data.TOS.data.enableIt;
        this.dataSvc.storeSave(this.TOS,'TOSEnable');
        this.dataSvc.storeSave(false,'TOSAgree');
        this.universalMessage=false;//res.data.universalMessage.data.enableIt
        this.loginFields = this.createLoginFields();
        this.signinForm = this.dfs.toFormGroup(this.loginFields);
    })
  }
  
}
