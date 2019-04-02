import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class ResultsComponent implements OnInit {
  public res = new Response();
  public objectName = "Search"
  public items: any[];
  public temp = [];
  selected = [];
  selectedIDs = [];
  accountID;
  currentCon;
  sid;
  inviteLoading = false;
  importType = "sales_nav";
  modelConnector: any;
  model: any;
  displayCheck = true;
  formFieldsConnector: any;modelResponder: any;  fieldsResponder = ['bot_responder_id'];
  formFieldsResponder: any;
  fieldsConnector = ['bot_connector_id'];
  selectEvent = false;
  contactInfo: any = {};
  public loadingItems=false;
  statusFilters = [
    { value: 'all', viewValue: 'All' },
    { value: 'replied', viewValue: 'Replied' },
    { value: 'chatting', viewValue: 'Chatting' },
    { value: 'connected', viewValue: 'Connected' },
    { value: 'welcome_message', viewValue: 'Welcome Message' },
    { value: 'old_connection', viewValue: 'Old Connection' },
    { value: 'follow_up', viewValue: 'Follow Up' },
    { value: 'in_queue', viewValue: 'Inqueue' },
    { value: 'invite_sent', viewValue: 'Invite Sent' },
    { value: 'ignore', viewValue: 'Ignored' },
  ];
  statusFiltersSelected = 'all';
  constructor(
    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,
    private navSvc: NavigationService,
    public dataSvc: DataService
  ) {
    this.accountID = this.route.snapshot.paramMap.get('id');
    this.sid = this.route.snapshot.paramMap.get('sid');
    this.list();
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
  }

  ngOnInit() {
    this.statusFiltersSelected = 'all';
  }

  addConnectionsToConnector(form) {
    let that = this;
    form.accountID = this.accountID;
    form.connectionIDS = that.getSelectConnectionIDS();
    form.sid= this.sid;
    that.userSvc.appiCall(UserService.actions.BotConnectorConnectionAdd, form).subscribe(res => {
      if (res.status) {
        that.res = res;
        that.userSvc.showSnak(res);
        this.list();
      }
    })
  }
  addConnectionsToConnectorAll(form) {
    let that = this;
    form.accountID = this.accountID;
    form.connectionIDS = that.getSelectConnectionIDSAll();
    form.sid= this.sid;
    that.userSvc.appiCall(UserService.actions.BotConnectorConnectionAdd, form).subscribe(res => {
      if (res.status) {
        that.res = res;
        that.userSvc.showSnak(res);
        this.list();

      }
    })
    
  }
  addToCampaign(item) {
    let selected = [item];
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.addSelectedToConnector();
  }
  createFormFieldsConnector() {

    let fields = [];
    for (var i = 0; i < this.fieldsConnector.length; i++) {
      fields.push(this.userSvc.createFormField(this.modelConnector[this.fieldsConnector[i]]));
    }
    return fields;
  }
   createFormFieldsResponder() {

    let fields = [];
    for (var i = 0; i < this.fieldsResponder.length; i++) {
      fields.push(this.userSvc.createFormField(this.modelResponder[this.fieldsResponder[i]]));
    }
    return fields;
  }
  addFilteredToConnector() {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFieldsConnector, opts: { title: 'Add contacts to auto Connector', bodyText: this.getSelectConnectionName().join(', '), buttonText: 'Add' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.addConnectionsToConnector(result);
      }
    });
  }
  addAllToConnector() {
    let that = this;
    debugger
    let f = that.items.filter(item => {
      return (item.status == 'imported' && item.cNames == undefined)
    }
    );
    let bodyText = "Add all " + f.length + " contacts to campaign.";
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFieldsConnector, opts: { title: 'Add all contacts to auto Connector', bodyText: bodyText, buttonText: 'Add' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.addConnectionsToConnectorAll(result);
      }
    });
  }
  addSelectedToConnector() {
    if (this.selected.length > 0) {
      let that = this;
      let dialogRef = this.composeDialog.open(AddnewComponent, {
        width: "720px",
        data: { formFields: this.formFieldsConnector, opts: { title: 'Add contacts to auto Connector', bodyText: "Add " + this.getSelectConnectionName().length + " selected contacts to campaign.", buttonText: 'Add' } }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          that.addConnectionsToConnector(result);
        }
      });
    }
    else {
      alert("Nothing selected")
    }
  }
  addAllToResponder(){
    let that = this;
    debugger
    let f = that.items.filter(item => {

      return (item.status != 'imported' && item.status !='invite_sent' && item.status!="in_queue" && item.status!="invite_error")
    }
    );
    let bodyText = "Add all " + f.length + " connections to campaign.";
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFieldsResponder, opts: { title: 'Add connections to campaign', bodyText: bodyText, buttonText: 'Add' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.addConnectionsToResponder(result);
      }
    });
  }
  addSelectedToResponder(){
    if (this.selected.length > 0) {
      let that = this;
      let dialogRef = this.composeDialog.open(AddnewComponent, {
        width: "720px",
        data: { formFields: this.formFieldsConnector, opts: { title: 'Add connections to auto responder', bodyText: this.getSelectConnectionName().join(','), buttonText: 'Add' } }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != '') {
          that.addConnectionsToResponder(result);
        }
      });
    }
    else {
      alert("Nothing selected")
    }
  }
  addConnectionsToResponder(form) {
    let that = this;
    form.accountID = this.accountID;
    form.connectionIDS = that.getSelectConnectionIDSAllResponder();
  
    that.userSvc.appiCall(UserService.actions.BotResponderConnectionAdd, form).subscribe(res => {
      if (res.status) {
        that.res = res;
        that.userSvc.showSnak(res);
        this.list();

      }
    })
  }
  download() {
    if (confirm("Download search results?")) {

      let data = this.items.map(item => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          title: item.title,
          company: item.company,
          location: item.location
        }
      })
      new Angular2Csv(data, 'My Report');
    }
  }
  getSelectConnectionIDS() {
    let temp = [];
    temp = this.selected.map(item => {
      return item.ID2;
    })
    return temp;
  }
  getSelectConnectionIDSAll() {
    let that = this;
    let temp = [];
    let f = that.items.filter(item => {
      return (item.status == 'imported' && item.cNames == undefined)
    }
    );
    temp = f.map(item => {
      return item.ID2;
    })
    return temp;
  }
   getSelectConnectionIDSAllResponder() {
    let that = this;
    let temp = [];
    let f = that.items.filter(item => {
        return (item.status != 'imported' && item.status !='invite_sent' && item.status!="in_queue" && item.status!="invite_error")
  
    }
    );
    temp = f.map(item => {
      return item.ID2;
    })
    return temp;
  }
  getSelectConnectionName() {
    let temp = [];
    temp = this.selected.map(item => {
      return item.fullName;
    })

    return temp;
  }
  list() {
    let that = this;
    that.loadingItems=true;
    that.userSvc.appiCall(UserService.actions.SearchResults, { accountID: this.accountID, sid: this.sid }).subscribe(res => {
      that.res = res;
      that.loadingItems=false;
      if (that.res.status) {

        that.temp = [...res.data.records];
        that.items = res.data.records;
        that.importType = res.data.search.type;
      }
      that.loadConnectorModel();
      that.loadResponderModel();
    });

   
  }
  loadConnectorModel(){
    let that=this;
    that.loadingItems=true;
     that.userSvc.appiCall(UserService.actions.BotConnectorConnectionModel, { accountID: this.accountID }).subscribe(res => {
       that.loadingItems=false;
      if (res.status) {
        that.modelConnector = res.data.model;
        if (that.formFieldsConnector == undefined)
          that.formFieldsConnector = that.createFormFieldsConnector();
      }

    });
  }

  loadResponderModel(){
    let that=this;
      that.userSvc.appiCall(UserService.actions.BotResponderConnectionModel, { accountID: this.accountID }).subscribe(res => {

      if (res.status) {
        that.modelResponder = res.data.model;
        if (that.formFieldsResponder == undefined)
          that.formFieldsResponder = that.createFormFieldsResponder();
      }

    });
  }
  onActivate(event) {
    if (event.type == 'click' && event.column.checkboxable != true) {
      this.currentCon = event.row;

    }
  }
  onSelect({ selected }) {

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    //this.selected.push(selected[0]['id']);    

  }
  
onStatusFilterChange(event) {

    const val = event.value.toLowerCase();

    // filter our data
    if (val != 'all') {
      const temp = this.temp.filter(function (d) {

        try {
          if (d.status.toLowerCase().indexOf(val) !== -1)
            return true;
          else
            return false;
        } catch (err) {
          return false;
        }
      });
      this.items = temp;
    }
    else {
      this.items = this.temp
    }
    return true;
  }
  sendInvite(con, row) {
    let that = this;
    that.inviteLoading = true;
    let action = con.import_type == "sales_nav" ? UserService.actions.InviteSalesNav : UserService.actions.InviteNorm;

    that.userSvc.apiCallNode(action, {
      accountID: this.accountID,
      ID1: con.ID1,
      ID2: con.ID2,
      importType: con.import_type,
      authType: con.authType,
      authToken: con.authToken,
      memberId: con.memberId,
      msg: ""
    })
      .subscribe(res => {
        if (res.status) {

        }
        this.userSvc.showSnak(res);
        that.inviteLoading = false;

      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.formattedName.toLowerCase().indexOf(val) !== -1 || d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || d.occupation.toLowerCase().indexOf(val) !== -1 || d.industry.toLowerCase().indexOf(val) !== -1 || d.location.toLowerCase().indexOf(val) !== -1)
        return true;
      else
        return false;

    });

    this.items = temp;

  }
}
