import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddnewComponent } from '../../views/admin/addnew.component';
import { FormFieldBase, TextboxField, CheckboxField } from '../../helpers/dynamicform/formmodels';
import { Location } from '@angular/common';
@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class AffiliateComponent implements OnInit {
  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Affiliate"
  isLoading = false;
  formFields: any;
  formFieldVerify: any;
  fields = ['code'];
  fieldsEdit = ['remarks'];
  formFieldsEdit: any;
  type = ''; uID;
  record: any = {};
  formOptions: any;
  model: any;
  linkModel:any;

  accountProcessMsg = "";
  accountLoaded = true;
  chromelessCtr = 0;
  addFormResult: any;

  public items: any[];
  public linkItems:any[];
  public html1: any;
  public accrualUrl = "/members/";
  opts: any = { title: 'New Record', buttonText: 'Submit' };
  constructor(


    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar, location: Location,
    public dataSvc: DataService) {


  }

  ngOnInit() {
    this.uID = this.userSvc.editingUserID;
    this.investment.data = { summaries: [] }
    this.type = this.route.snapshot.data['type'];
    this.list();this.listLinks();
  }

  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"]).subscribe(res => {
      that.res = res;

      that.model = res.data.model;

      if (that.res.status) {
        that.items = res.data.records;

      }
    });
  }
  listLinks() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "LinkList"]).subscribe(res => {

      that.linkModel = res.data.model;
      if (that.res.status) {
        that.linkItems = res.data.records;
       
      }
    });
  }

  requestCode(){
    if(confirm("Request new affilicate code?")){
      this.getNewCode();
    }
  }

  getNewCode(){
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "LinkNew"]).subscribe(res => {
        that.userSvc.showSnak(res);
        if(res.status)
          that.listLinks();
      
    });
  }
}
