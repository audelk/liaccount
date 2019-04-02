import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Response, DataService } from '../../../providers/data.service';
import { LanguageService } from '../../../services/language.service';
import { MatSnackBar } from '@angular/material';
import { DynamicFormService } from '../../../helpers/dynamicform/form.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConfirmService2 } from '../../../shared/services/app-confirm2/app-confirm.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  public res = new Response();
  fieldsAll = [];
  fieldsIncludeSearch: any = [];
  fieldsDefaultResult: any = [];
  fieldsExludeDefaultResult: any = [];
  checkAllVal = false;
  checkAllVal2 = false;
  formFieldsEdit: any;
  fieldsAllNames: any = [];
  currentSearchQuery:any;
  formOptions: any = {};
  fieldsAvailableDefaults = ['MobilePhone_AreaCode', 'city', 'zip_cd', 'home_owner_flag'];
  fieldsShow = [];
  loaded = false; formFields: any;
  opts: any = { title: 'New Record', buttonText: 'Submit' };
  form: FormGroup;
  searchloaded = false;
  downloadStep="";
  currentResultCount=0;
  constructor(
    private dfs: DynamicFormService,
    public userSvc: UserService,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService2,
    public dataSvc:DataService
  ) { }

  ngOnInit() {
    this.getSettingsGeneral();

  }
  availableFieldsUpdate(key, item) {
    let index = this.fieldsShow.indexOf(key);
    //if not yet added and checked
    if (index === -1 && item.checked) {
      this.fieldsShow.push(key);

      this.formFieldsEdit.push(this.userSvc.createFormField(this.res.data.model[key]));
      this.form.addControl(key, this.dfs.createNewControl(this.formFieldsEdit[this.formFieldsEdit.length - 1]));
    }
    else if (index === -1 && !item.checked) {
      this.fieldsShow.splice(index, 1);
      this.formFieldsEdit.splice(index, 1);
      this.form.removeControl(key);
    }
    //if added and unchecked
    else if (index !== -1 && !item.checked) {
      this.fieldsShow.splice(index, 1);
      this.formFieldsEdit.splice(index, 1);
      this.form.removeControl(key);
    }
  }

  createFormFieldsEdit(model, fieldsEdit, fieldsShow) {
    let fields = [];
    let that = this;

    for (var i = 0; i < fieldsEdit.length; i++) {
      let f = fieldsEdit[i];
      if (fieldsShow.indexOf(f) == -1)
        continue;
      let field=this.userSvc.createFormField(model[f])
         field.attr.maxLength=(model[f].validators && model[f].validators.maxLength)?model[f].validators.maxLength:'';
      fields.push(field);
      
    }
    
    return fields;
  }
  createFormFieldsAvailable(model, enables, defaults) {
    let fields = [];
    let that = this;

    for (var i = 0; i < enables.length; i++) {
      let f = enables[i];
      let temp = false;
      if (defaults.indexOf(f) != -1) {
        temp = true;
        that.fieldsShow.push(f);
      }
      if(model[f].validators && model[f].validators.required){
        model[f].attr.value = true;
        model[f].value = true;
        model[f].maxLength=5;
      
      }
    else{
      model[f].attr.value = temp;
      model[f].value = temp;
    }
      
      let field=this.userSvc.createFormField(model[f]);
   

      fields.push(field);
    }
    
    return fields;
  }
  getSettingsGeneral() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.UserSettings, { user_id: that.userSvc.editingUserID }).subscribe(res => {
      that.res = res;

      that.fieldsIncludeSearch = res.data.fieldsIncludeSearch;
      that.fieldsDefaultResult = res.data.fieldsDefaultResult;
      that.fieldsAllNames = res.data.fieldsAllNames;
      that.formFields = this.createFormFieldsAvailable(JSON.parse(JSON.stringify(that.res.data.model)), that.fieldsIncludeSearch.data, that.fieldsAvailableDefaults);

      that.formFieldsEdit = this.createFormFieldsEdit(JSON.parse(JSON.stringify(that.res.data.model)), that.fieldsIncludeSearch.data, that.fieldsShow);
      this.form = this.dfs.toFormGroup(this.formFieldsEdit);

      that.loaded = true;
    });
  }


  update(form, action) {
    let that = this;

    if (action == 'account')
      that.userSvc.userUpdate(form).subscribe(res => {
        that.userSvc.showSnak(res);

      })
    else
      that.userSvc.userUpdateProfile(form).subscribe(res => {
        that.userSvc.showSnak(res);

      })
  }
  checkAll(val, type) {
    this[type].map(field => {
      field.attr.value = val;
      return field;
    });
  }
  downloadConfirm() {
   this.confirmService.confirm({message: "Click OK to download search results. All downloads are final. No credits will be re-issued in the event of user-error (including duplicate records resulting from similar search parameters)." })
      .subscribe(res => {
         if (res == true) {
          this.downloadResults();
          
        }
      })
  }
  downloadResults(){
      this.userSvc.appiCall(UserService.actions.UserPerformSearchDownload, this.currentSearchQuery).subscribe(res => {
        this.res = res;
        if(res.status){
            this.downloadStep="downloadGenerated";
            this.userSvc.user.wallet = res.data.wallet;
        }
        
      })
  }
  downloadSave(){
    let obj={
      query:JSON.stringify(this.currentSearchQuery),
      complete:false,
      result_count:this.currentResultCount
    }
    this.userSvc.appiCall(UserService.actions.UserPerformSearchSave,obj ).subscribe(res => {
        this.res = res;  
       
        this.downloadStep="downloadSaved";

      })
  }
  onSubmit(form, $e) {
    let that = this;
    if (this.form.status == 'VALID') {
      this.searchloaded = false;
      let obj=JSON.parse(JSON.stringify(form.value));
      Object.keys(obj).map(function (key, index) {
        let temp = obj[key].trim();
        obj[key] = (temp == "" ? undefined : temp);
      });
      this.currentSearchQuery=obj;
      that.userSvc.appiCall(UserService.actions.UserPerformSearch, obj).subscribe(res => {
        this.downloadStep="searched";  
        this.currentResultCount=res.data.result_count;
        this.res = res;
        //that.userSvc.showSnak(res);      
        this.searchloaded = true;
      })
    }
  }
}
