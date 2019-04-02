import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class CustomerComponent implements OnInit {
   @ViewChild('myTable') table: any;
  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public resInvoices = new Response();
  public objectName = "Customer"
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
  expanded: any = {};
  public temprecords = [];
  private invoices:any;
  constructor(
    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,
    private navSvc: NavigationService,
    public dataSvc: DataService) {

    this.formOptions = {
      iconLabel: true
    };

  }

  ngOnInit() {

    this.list();

  }
  add(form) {
    let that = this;
    form.accountID = this.accountID;
    that.accountLoaded=false;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Add"], form).subscribe(res => {
      if (res.status) {
        that.res = res;
        that.userSvc.showSnak(res);
        this.list();

      }
      that.accountLoaded=true;
    })
    
  }
  createFormFields() {
    let model = this.res.data.model;
    let fields = [];
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
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
  delete(id) {
    let that = this;
    if (confirm('Delete Customer?'))
      that.userSvc.appiCall(UserService.actions[that.objectName + "Delete"], { accountID: this.accountID, id: id }).subscribe(res => {
        that.userSvc.showSnak(res);
        that.list();
      })
  }
  edit(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.opentEditDialog(id, that.formFieldsEdit, that.objectName, 'Update Customer');
  }
  list() {
    let that = this;
    that.isLoading=true;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Summary"], { accountID: this.accountID }).subscribe(res => {
      that.isLoading=false;
      that.res = res;
      that.model = res.data.model;
      that.temprecords = res.data.records;
      if (that.res.status) {
        that.items = res.data.records;
        if (that.formFields == undefined)
          that.formFields = that.createFormFields();
        that.getInvoices();
      }
    });
  }

  getInvoices(){
    let that = this;
    that.isLoading=true;
    that.userSvc.appiCall(UserService.actions[that.objectName + "InvoiceAll"], { accountID: this.accountID }).subscribe(res => {
      that.resInvoices = res;   
      that.isLoading=false;
      if (that.res.status) {
        debugger
        that.invoices = res.data.records;
      }
    });
  }

   opentEditDialog(id, fields, action, title) {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: fields, opts: { title: title, buttonText: 'Update' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        result.id = id;
        that.update(result, action);
      }
    });
  }
  openNewDialog() {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFields, opts: { title: 'Add Customer', buttonText: 'Add' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.add(result);
      }
    });
  }

  update(form, action) {
    let that = this;
    form.accountID = this.accountID;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Update"], form).subscribe(res => {
      that.userSvc.showSnak(res);
      that.list();
    })


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

   toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
}

}
