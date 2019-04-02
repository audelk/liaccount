import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
import { SearchnewComponent } from './searchnew.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Search"
  isLoading = false;
  record: any = {};
  formOptions: any;
  accountID;
  currentCon;
  formFields: any;
  fields = ['name'];
  fieldsEdit = ['name'];
  formFieldsEdit: any;
  public items: any[];
  model: any;
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
    this.accountID = this.route.snapshot.paramMap.get('id');
    this.list();
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
    this.getNotifications();
  }
  getNotifications() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.GetInNotifications, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.userSvc.notifications = res.data;
      }
    });
  }
  add(form) {
    let that = this;
    form.accountID = this.accountID;
    if (form.type == "url_search") {
      form.queryObj = this.formatURLSearchURL(form.inURL);
    }
    else if (form.type == "sales_navigator_search") {      
      form.queryObj=this.formatSNSearchURL(form.inURLSalesNavigator); 
    }
    that.userSvc.appiCall(UserService.actions[that.objectName + "Add"], form).subscribe(res => {
      if (res.status) {
        that.res = res;     
    //    that.searchImport(res.status);
        this.list();
      }
        that.userSvc.showSnak(res);
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
    if (confirm('Delete Search?'))
      that.userSvc.appiCall(UserService.actions[that.objectName + "Delete"], { accountID: this.accountID, id: id }).subscribe(res => {
        that.userSvc.showSnak(res);
        that.list();
      })
  }
  edit(id) {
    let that = this;
    that.formFieldsEdit = this.createFormFieldsEdit(id, JSON.parse(JSON.stringify(this.res.data.model)), this.fieldsEdit);
    that.opentEditDialog(id, that.formFieldsEdit, that.objectName, 'Update Search');
  }
  formatSNSearchURL(url) {
  //  let url = "https://www.linkedin.com/sales/search?facet=G&facet=N&facet=I&facet.G=us%3A748&facet.N=S&facet.I=4&facet.I=68&facet.I=124&facet.I=80&facet.I=14&facet.I=69&facet.I=96&facet.I=43&facet.I=100&facet.I=47&facet.I=48&facet.I=17&facet.I=70&facet.I=86&facet.I=31&facet.I=9&facet.I=13&facet.I=99&facet.I=6&facet.I=27&facet.I=139&facet.I=75&facet.I=19&facet.I=28&facet.I=103&facet.I=50&facet.I=42&facet.I=34&facet.I=115&facet.I=1&facet.I=98&facet.I=105&facet.I=136&facet.I=110&facet.I=91&facet.I=10&facet.I=11&facet.I=67&facet.I=135&facet.I=112&facet.I=137&facet.I=25&facet.I=53&facet.I=12&facet.I=5&facet.I=8&facet.I=24&facet.I=140&facet.I=46&facet.I=88&facet.I=32&facet.I=38&facet.I=111&facet.I=144&facet.I=33&facet.I=126&facet.I=82&facet.I=52&facet.I=76&facet.I=113&facet.I=132&facet.I=142&facet.I=36&facet.I=7&facet.I=114&facet.I=37&facet.I=15&facet.I=51&facet.I=89&facet.I=35&facet.I=18&facet.I=30&facet.I=3&facet.I=39&facet.I=104&facet.I=40&facet.I=131&facet.I=133&facet.I=90&facet.I=101&facet.I=94&facet.I=118&facet.I=125&facet.I=84&facet.I=23&facet.I=54&facet.I=122&facet.I=92&facet.I=74&facet.I=57&facet.I=77&facet.I=106&facet.I=83&facet.I=20&facet.I=78&facet.I=26&facet.I=79&facet.I=49&facet.I=81&facet.I=116&facet.I=138&facet.I=59&facet.I=121&facet.I=102&facet.I=63&facet.I=148&facet.I=97&facet.I=147&facet.I=16&facet.I=85&facet.I=107&facet.I=143&facet.I=141&facet.I=71&facet.I=119&facet.I=146&facet.I=55&facet.I=66&facet.I=95&facet.I=108&facet.I=120&facet.I=130&facet.I=134&facet.I=60&facet.I=127&facet.I=109&facet.I=64&facet.I=72&facet.I=145&facet.I=73&facet.I=129&facet.I=56&facet.I=123&facet.I=22&facet.I=29&facet.I=93&facet.I=117&facet.I=58&facet.I=65&facet.I=61&facet.I=62&facet.I=87&countryCode=us&radiusMiles=10&postalCode=93101&count=25&start=25&updateHistory=true&searchHistoryId=2593317204&trackingInfoJson.contextId=948D1CE5EFF92E15209F42F9622B0000";
    let tempArr = url.split('?')[1].split("&");
    let queryObj = {};
    debugger
    tempArr.forEach(item => {
      let temp = item.split("=");
      let key = temp[0];
      let value = temp.length > 1 ? temp[1] : "";
      if(queryObj[key]!=undefined){
        if (!Array.isArray(queryObj[key])){
          let oldVal=queryObj[key];
          queryObj[key] = [];
          queryObj[key].push(oldVal);
          queryObj[key].push(decodeURIComponent(value));
        }
        else{
          queryObj[key].push(decodeURIComponent(value));
        }           
      }
      else{
        queryObj[key]=decodeURIComponent(value);
      }
  
    })

    return queryObj;
  }
  formatURLSearchURL(url) {
    //url = "https://www.linkedin.com/search/results/people/?company=binaryinputs&facetCurrentCompany=%5B%221009%22%5D&facetGeoRegion=%5B%22us%3A0%22%2C%22ph%3A0%22%5D&facetIndustry=%5B%2296%22%5D&facetNetwork=%5B%22S%22%2C%22O%22%5D&facetNonprofitInterest=%5B%22volunteer%22%5D&facetPastCompany=%5B%221033%22%5D&facetProfileLanguage=%5B%22en%22%5D&facetSchool=%5B%2215812%22%2C%2215667%22%5D&firstName=audel&keywords=senior%20programmer&lastName=kabristante&origin=FACETED_SEARCH&school=silliman&title=mr";
    //List(v->PEOPLE,facetNetwork->S|O,facetGeoRegion->us:0|ph:0,facetCurrentCompany->1009,facetPastCompany->1033,facetIndustry->96,facetNonprofitInterest->volunteer,facetProfileLanguage->en,facetSchool->15812|15667,firstName->audel,lastName->kabristante,title->mr,company->binaryinputs,school->silliman)
    //"List(v->PEOPLE,company->,facetCurrentCompany->1009,facetGeoRegion->ph:0undefined|"us:0,facetIndustry->4undefined|"96,facetNetwork->Sundefined|"O,facetProfileLanguage->en,firstName->,lastName->,school->,title->)"
    let qs = url.split('?')[1];
    let obj = JSON.parse('{"' + qs.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) })


    let mainKeys = ['keywords', 'origin'];
    let queryObj = { guides: '' };
    let guidesStr = "List(v->PEOPLE";
    let temp = [];

    Object.keys(obj).forEach(key => {
      if (mainKeys.indexOf(key) != -1) {
        queryObj[key] = obj[key];
      }
      else {

        let arr = obj[key].replace('["', '').replace('"]', '').replace(new RegExp('"', 'g'), '').replace(/,/g, "|");
        if (arr != "") {
          let pairStr = "," + key + '->' + arr;
          guidesStr += pairStr;
        }
      }
    });
    queryObj.guides = guidesStr + ")";
    debugger;
    return queryObj;
  }

  searchImport(sid) {
    let that = this;
    that.userSvc.apiCallNode(UserService.actions.SearchResultsImport, { accountID: this.accountID, sid: sid }).subscribe(res => {
      console.log(res);
    });
  }
  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"], { accountID: this.accountID }).subscribe(res => {
      that.res = res;
      that.model = res.data.model;
      if (that.res.status) {
        that.items = res.data.records;
        if (that.formFields == undefined)
          that.formFields = that.createFormFields();
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
    let dialogRef = this.composeDialog.open(SearchnewComponent, {
      width: "720px",
      data: { model: that.model,accountID:that.accountID }
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


}
