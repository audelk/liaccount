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
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class PartnerComponent implements OnInit {
 public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Partner"
  isLoading = false;
  record: any = {};
  formOptions: any;
  accountID;
  currentCon;
  formFields: any;
  fields = ['email', 'first_name','last_name','remarks'];
  fieldsEdit = ['email', 'first_name','last_name','remarks'];
  formFieldsEdit: any;
  public items: any[];
  model: any;
  accountLoaded=true;
  searchText = "";
  public temprecords = [];
  constructor(public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar, location: Location,
    public dataSvc: DataService) {


  }

  ngOnInit() {
    this.list();
  }

  list(){
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"], { accountID: this.accountID }).subscribe(res => {
      that.res = res;
      that.model = res.data.model;
      that.temprecords = res.data.records;
      if (that.res.status) {
        that.items = res.data.records;
        
      }
    });
  }

    updateFilter(event) {


    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temprecords.filter(function (d) {
      if (d.email.toLowerCase().indexOf(val) !== -1 || d.name.toLowerCase().indexOf(val) !== -1  )
        return true;
      else
        return false;

    });

    this.res.data.records = temp;

  }
}
