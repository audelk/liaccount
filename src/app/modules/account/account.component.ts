import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddnewComponent } from '../../views/admin/addnew.component';
import { FormFieldBase, TextboxField, CheckboxField } from '../../helpers/dynamicform/formmodels';
import { NavigationService } from '../../shared/services/navigation.service';
import { Location } from '@angular/common';
import { ChartModule } from 'angular2-highcharts';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class AccountComponent implements OnInit {
  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Account"
  isLoading = false;
  formFields: any;
  formFieldsManual: any;
  formFieldVerify: any;
  fields = ['email', 'password', 'remarks'];
  fieldsManual = ['email', 'password', 'cookies', 'csrf_token', 'cookiesSN', 'csrf_tokenSN', 'remarks'];
  fieldsEdit = ['remarks', 'password', 'cookies', 'csrf_token', 'cookiesSN', 'csrf_tokenSN'];
  formFieldsEdit: any;
  type = ''; uID;
  record: any = {};
  formOptions: any;
  model: any;
  accountProcessMsg = "";
  accountLoaded = true;
  chromelessCtr = 0;
  addFormResult: any;
  MAX_IMPORT = 50000;
  loaded = false;
  chartOptions: any;
  chartOptions2: any;
  chartOptions3: any;
  public items: any[];
  public html1: any;
  public accrualUrl = "/members/";
  public temp = [];
  loginVerifyType = "v1";
  opts: any = { title: 'New Record', buttonText: 'Submit' };
  constructor(

    private navSvc: NavigationService,
    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar, location: Location,
    public dataSvc: DataService) {

    this.formOptions = {
      iconLabel: true
    };
    this.formFieldVerify = this.createVerifyFields();

  }

  ngOnInit() {
    this.navSvc.publishNavigationChange([]);
    this.uID = this.userSvc.editingUserID;
    this.investment.data = { summaries: [] }
    this.type = this.route.snapshot.data['type'];
    this.router.navigate(['/inaccount/inbox']);
    // this.list();
    // this.fornonSSL();
    // this.getDashboardCommunication();
  }


  checkAccount(id) {

  }
  
  
  updateSub() {
    let that = this;

    that.userSvc.appiCall(UserService.actions["PlanUpdateSettings"], { type: 'in_account_ctr' }).subscribe(res => {
      if (res.status) {
        that.userSvc.user.subcription = res.data;
      }
    });
  }
  gotoInAcount(user) {
    this.userSvc.selectedInAccount = user;

  }
  
  createVerifyFields() {
    let fields: FormFieldBase<any>[] = [];

    let emailOpts = {
      key: 'code',
      attr: {
        placeholder: 'Verification Code',
        label: 'Verification Code',
        type: 'text',
        icon: 'fa fa-user'
      },
      order: 1,
      validators: {
        maxLength: 50, minLength: 1, required: true,
      }
    };
    fields.push(new TextboxField(emailOpts));
    return fields.sort((a, b) => a.order - b.order);
  }
 
  importConnections(csrf_token, cookies, start, count, total, accountID, ID1) {
    let that = this;
    let form = {
      csrf_token: csrf_token,
      cookies: cookies,
      start: start,
      count: count,
      accountID: accountID,
      accountID1: ID1
    };
    this.accountLoaded = false;
    if (start < total) {
      that.accountProcessMsg = "We are currently importing your existing connections. Please dont close the page."
      that.accountProcessMsg += " Importing : " + (start + count) + "/" + total;
    }
    that.userSvc.apiCallNode(UserService.actions["ConnectionImport"], form).subscribe(res => {
      that.resn = res;
      this.accountLoaded = true;
      if (start < total) {
        that.accountProcessMsg = "We are currently importing your existing connections. Please dont close the page."
        that.accountProcessMsg += " Importing : " + (start + count) + "/" + total;
      }
      if (start < total && start < that.MAX_IMPORT) {
        setTimeout(function () {

          that.importConnections(csrf_token, cookies, start + count, count, total, accountID, ID1);
        }, 3000);
      }
      else {
        that.importEmailAddToTask(accountID);
        that.accountProcessMsg = "";
        that.resn.successes.push("Importing connections completed.");
        that.resn.successes.push("You can now check your account.");
        that.importConnectionUpdateLocations(accountID, total, csrf_token, cookies, ID1);
        that.list();
      }

    })
  }
  importConnectionUpdateLocations(accountID, total, csrf_token, cookies, ID1) {
    let that = this;
    let form = {
      totalResultCount: total > 1000 ? 1000 : total,
      accountID: accountID,
      csrf_token: csrf_token,
      cookies: cookies,
      accountID1: ID1
    };
    that.userSvc.apiCallNode(UserService.actions.ConnectionImportUpdateLocations, form).subscribe(res => {

    })
  }
  importEmailAddToTask(accountID) {
    console.log("importing emails");
    this.userSvc.appiCall(UserService.actions.ConnectionImportEmails, { accountID: accountID }).subscribe(res => { });
  }
  importInvites(accountID, sid, cid) {
    let that = this;
    let form = {
      accountID: accountID,
      sid: sid,
      cid: cid
    };

    that.userSvc.apiCallNode(UserService.actions["InvitationsImport"], form).subscribe(res => {

    })
  }
  

  getDashboardCommunication() {
    let that = this;
    that.loaded = false;
    that.userSvc.appiCall(UserService.actions.DashboardConnectedByAccount).subscribe(res => {
      if (res.status) {
        this.chartOptions = this.createChartOptions(res.data)
      }
      that.getDashboardCommunication2();
    });
  }

  getDashboardCommunication2() {
    let that = this;
    that.loaded = false;
    that.userSvc.appiCall(UserService.actions.DashboardInvitesByAccount).subscribe(res => {
      if (res.status) {
        this.chartOptions2 = this.createChartOptions(res.data)
      }

    });
  }

  createChartOptions(seriesOptions) {

    return {
      navigator: {
        enabled: false
      },
      legend: {
        enabled: true
      },
      rangeSelector: {
        selected: 4
      },

      yAxis: {
        labels: {

        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },

      plotOptions: {
        series: {

          showInNavigator: true
        }
      },

      tooltip: {
        xDateFormat: '%Y-%m-%d',
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>',
        valueDecimals: 0,
        //split: true
      },
      series: seriesOptions
    }
  }
  list() {
    let that = this;
    this.accountLoaded = false;
    that.userSvc.appiCall(UserService.actions[that.objectName + "ListSummary"]).subscribe(res => {
      that.res = res;

      that.model = res.data.model;
      this.accountLoaded = true;
      if (that.res.status) {

        that.items = res.data.records;
        that.temp = [...res.data.records];
       
      }
    });
    // that.userSvc.fundsData(UserService.actions.FundsData,{userID:this.uID}).subscribe();
  }

  createFormFields() {
    let model = this.res.data.model;
    let fields = [];
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
    }
    return fields;
  }
  createFormFieldsManual() {
    let model = this.res.data.model;
    let fields = [];
    for (var i = 0; i < this.fieldsManual.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fieldsManual[i]]));
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
  
  update(form, action) {
    let that = this;
    form.type = this.type;

    that.userSvc.appiCall(UserService.actions[that.objectName + "Update"], form).subscribe(res => {

      that.userSvc.showSnak(res);
      that.list();
    })


  }

  updateFilter(event) {

    const val = event.target.value.toLowerCase();
    // filter our data

    const temp = this.temp.filter(function (d) {

      try {

        if (d.email.toLowerCase().indexOf(val) !== -1 || d.remarks.toLowerCase().indexOf(val) !== -1 )
          return true;
        else
          return false;
      } catch (err) {
        return false;
      }
    });

    this.items = temp;

  }

}