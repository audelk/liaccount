import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DynamicFormService } from '../../helpers/dynamicform/form.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Response, DataService } from '../../providers/data.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-searchnew',
  templateUrl: './searchnew.component.html',
  styles: [], encapsulation: ViewEncapsulation.None,
  providers: [DynamicFormService]
})
export class SearchnewComponent implements OnInit {
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  model: any;
  formFields: any;
  formFields2: any;
  formFields3: any;
  locationCtrl: FormControl;
  industryCtrl: FormControl;
  companyCtrl: FormControl;
  filteredLocations = [];
  filteredIndustries = [];
  filteredCompanies = [];
  searRes = new Response();
  locationLoading = false;
  industryLoading = false;
  companyLoading = false;
  accountID = 0;
  typeAheadDEfaults: any = {};
  formValue = {
    type: 'standard_search'
  };
  fields = ['name', 'type', 'keywords', 'title', 'company', 'location', 'industry'];
  fields2 = ['name', 'inURL'];
  fields3 = ['name', 'inURLSalesNavigator'];
  constructor(
    public userSvc: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SearchnewComponent>,
    public dfs: DynamicFormService
  ) { }

  ngOnInit() {
    let that = this;
    that.locationCtrl = new FormControl();
    that.industryCtrl = new FormControl();
    that.companyCtrl = new FormControl();
    that.model = that.data.model;
    that.formFields = that.createFormFields(this.fields);
    that.formFields2 = that.createFormFields(this.fields2);
    that.formFields3 = that.createFormFields(this.fields3);
    that.form = that.dfs.toFormGroup(that.formFields);
    that.form2 = that.dfs.toFormGroup(that.formFields2);
    that.form3 = that.dfs.toFormGroup(that.formFields3);
    this.accountID = that.data.accountID;
    
    that.locationCtrl.valueChanges
      .debounceTime(300)
      .subscribe(data => {
        if (data == "") {
          that.filteredLocations = that.typeAheadDEfaults.data.GEO_REGION;
        } else
          that.sendTypeAhead(data, 'REGION', 'filteredLocations')
      });

    that.industryCtrl.valueChanges
      .debounceTime(300)
      .subscribe(data => {
        if (data == "") {
          that.filteredIndustries = that.typeAheadDEfaults.data.INDUSTRY;
        } else
          that.sendTypeAhead(data, 'INDUSTRY', 'filteredIndustries')
      });

    that.companyCtrl.valueChanges
      .debounceTime(300)
      .subscribe(data => {
        if (data == "") {
          that.filteredCompanies = that.typeAheadDEfaults.data.CURRENT_COMPANY;
        } else
          that.sendTypeAhead(data, 'COMPANY', 'filteredCompanies')
      });

    that.getTypeAheadDefaults();
  }

  createFormFields(fields) {
    let model = this.model;
    let temp = [];
    for (var i = 0; i < fields.length; i++) {
      temp.push(this.userSvc.createFormField(model[fields[i]]));
    }
    return temp;
  }

  getTypeAheadDefaults() {
    let that = this;
    that.userSvc.apiCallNode(UserService.actions.InSearchTypeAheadDefaults, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.typeAheadDEfaults = res;
        that.filteredCompanies = res.data.CURRENT_COMPANY;
        that.filteredIndustries = res.data.INDUSTRY;
        that.filteredLocations = res.data.GEO_REGION;

      }
    })


  }
  onSubmit(form: any, type) {
    let that = this;
    if (form.status == 'VALID') {
      form.value.type = type;
      if (type == 'standard_search') {

        form.value.location = JSON.stringify(that.locationCtrl.value);
        form.value.industry = JSON.stringify(that.industryCtrl.value);
        form.value.company = JSON.stringify(that.companyCtrl.value);
      }


      this.dialogRef.close(form.value);
    }
  }
  selectedTabChange(event) {
    if (event.index == 0)
      this.formValue.type = 'standard_search';
    else if (event.index == 1)
      this.formValue.type = 'url_search';
    else if (event.index == 1)
      this.formValue.type = 'sales_navigator_search';
  }

  sendTypeAhead(data, type, results) {
    let that = this;

    if (data.length > 0) {
      let params = {
        query: data,
        type: type
      };
      if (type == "REGION")
        that.locationLoading = true;
      else if (type == "INDUSTRY")
        that.industryLoading = true;
      else if (type == "COMPANY")
        that.companyLoading = true;

      that.userSvc.apiCallNode(UserService.actions.InSearchTypeAhead, params).subscribe(res => {
        that.searRes = res;
        that.locationLoading = false;
        that.industryLoading = false;
        that.companyLoading = false;
        if (res.status) {
          if (res.data.hints.length == 0)
            res.data.hints = [
              {
                SID: '',
                text: "No match found."
              }

            ]
          that[results] = res.data.hints;

        }
      })
    }
    else {
      that[results] = [];
    }
  }

  onLocationSelect(object) {
    if (object && object.SID != '')
      return object.text;
    else
      return '';
  };
  onIndustrySelect(object) {
    if (object && object.SID != '')
      return object.text;
    else
      return '';
  };
  onCompanySelect(object) {
    if (object && object.SID != '')
      return object.text;
    else
      return '';
  };
}
