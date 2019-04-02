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
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class ConnectionComponent implements OnInit {

  public res = new Response();
  public res2 = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Connection"
  isLoading = false;
  chatMessages = [];
  type = ''; uID;
  record: any = {};
  formOptions: any;
  model: any;
  modelResponder: any;
  accountProcessMsg = "";
  accountLoaded = true;
  public items: any[];
  public campaigns:any[];
  public temp = [];
  public accrualUrl = "/members/";
  accountID;
  currentCon: any = { ID1: 0, firstName: undefined };
  chatLoading = false;
  selected = [];
  msgToSend = "";
  selectedIDs = [];
  displayCheck = true;
  formFieldsResponder: any;
  fieldsResponder = ['bot_responder_id'];
  selectEvent = false;
  contactInfo: any = {};
  starred=false;
  allRowsSelected = true;
  public loadingItems = false;
  public loadingStatus=false;
  //@ViewChild(DatatableComponent) table: DatatableComponent;
  enableSummary = true;
  summaryPosition = 'top';
  statusFilters = [
    { value: 'all', viewValue: 'All' },
   // { value: 'imported', viewValue: 'Imported' },
    { value: 'replied', viewValue: 'Replied' },
    //{ value: 'chatting', viewValue: 'Chatting' },
    { value: 'connected', viewValue: 'Connected' },
    { value: 'welcome_message', viewValue: 'Welcome Message' },
    { value: 'old_connection', viewValue: 'Old Connection' },
    { value: 'follow_up', viewValue: 'Follow Up' },
   // { value: 'in_queue', viewValue: 'Inqueue' },
  //  { value: 'invite_sent', viewValue: 'Invite Sent' },
   // { value: 'ignore', viewValue: 'Ignored' },
  ];
  statusFiltersSelected = 'all';
  campaignFiltersSelected="all"
  campaignFilters=[{ value: 'all', viewValue: 'all' }];
  spreadSheetStatus:any=false;
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
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
    this.campaignFilters=[{ value: 'all', viewValue: 'all' }];
    this.listCampaigns();
    this.getNotifications();
    this.getSpreadSheetStatus();
    this.statusFiltersSelected = 'all';
    this.campaignFiltersSelected="all";
  }
  requestStarredSheet(){
    let that = this;
    that.loadingStatus=true;
    that.userSvc.appiCall(UserService.actions.InAccountCreateSheet, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.spreadSheetStatus=res.data;
          
      }
      that.res2=res;  
      
      that.loadingStatus=false;
    });
  }
  getSpreadSheetStatus(){
    let that = this;
    that.userSvc.appiCall(UserService.actions.InAccountSpreadSheetStatus, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.spreadSheetStatus=res.data;
     
      }
    });
  
  }
  getNotifications() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.GetInNotifications, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.userSvc.notifications = res.data;
      }
    });
  }
  addConnectionsToResponder(form) {
    let that = this;
    form.accountID = this.accountID;
    form.connectionIDS = that.getSelectConnectionIDS();
    that.userSvc.appiCall(UserService.actions.BotResponderConnectionAdd, form).subscribe(res => {
      if (res.status) {
        that.res = res;
        that.userSvc.showSnak(res);
        this.list();

      }
    })
  }
  createFormFieldsResponder() {

    let fields = [];
    for (var i = 0; i < this.fieldsResponder.length; i++) {
      fields.push(this.userSvc.createFormField(this.modelResponder[this.fieldsResponder[i]]));
    }
    return fields;
  }

  addFilteredToResponder() {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: this.formFieldsResponder, opts: { title: 'Add connections to auto responder', bodyText: this.getSelectConnectionName().join(', '), buttonText: 'Add' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        that.addConnectionsToResponder(result);
      }
    });
  }

  addSelectedToResponder() {
    if (this.selected.length > 0) {
      let that = this;
      let dialogRef = this.composeDialog.open(AddnewComponent, {
        width: "720px",
        data: { formFields: this.formFieldsResponder, opts: { title: 'Add connections to auto responder', bodyText: this.getSelectConnectionName().join(','), buttonText: 'Add' } }
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

  chatMessageGetAll(ID1) {
    let that = this;
    that.chatLoading = true;
    that.userSvc.apiCallNode(UserService.actions.ConversationList, { ID1: ID1, accountID:  this.userSvc.inAccountSettings.mainData.id }).subscribe(res => {
      if (res.status) {
        that.chatMessages = res.data.messages
      }
      that.chatLoading = false;

    });
  }
  contactInfoGetAll(publicIdentifier) {
    let that = this;
    that.userSvc.apiCallNode(UserService.actions.ConnectionContactInfo, { publicIdentifier: publicIdentifier, accountID:  this.userSvc.inAccountSettings.mainData.id}).subscribe(res => {
      if (res.status) {
        that.contactInfo = res.data.fields
      }

    });
  }

  download() {
    if (confirm("Download connections?")) {
      if(this.starred){
        this.filterByStarred();
      }
      let data = this.items.map(item => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          occupation: item.occupation,
          location: item.location,
          email: item.email||"none",
          connected: item.date,
          phones: item.phone || "none",
          star:item.star || 0

        }
      })
      new Angular2Csv(data, 'My Report',{headers:["First Name","Last Name","Occupation","Location","Email","Connected","Phones","Star"]} );
    }
  }
  getSelectConnectionIDS() {
    let temp = [];
    temp = this.selected.map(item => {
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
    that.loadingItems = true;
    that.userSvc.appiCall(UserService.actions[that.objectName + "ListPortal"], { accountID: this.accountID }).subscribe(res => {
      that.res = res;
      that.loadingItems = false;
      if (that.res.status) {
        // that.modelResponder = res.data.modelResponder;
        that.temp = [...res.data.records];
        that.items = res.data.records;

      }

    });
    that.userSvc.appiCall(UserService.actions.BotResponderConnectionModel, { accountID: this.accountID }).subscribe(res => {

      if (res.status) {
        that.modelResponder = res.data.model;
        if (that.formFieldsResponder == undefined)
          that.formFieldsResponder = that.createFormFieldsResponder();
      }

    });

   }
  listCampaigns() {
    let that = this;
    that.userSvc.appiCall(UserService.actions["CampaignsList"], { accountID: this.accountID }).subscribe(res => {

      if (res.status) {
        that.campaigns = res.data.records;
       
        /*that.campaigns.forEach(function(item){          
            that.campaignFilters.push(
              { value: item.id, viewValue: item.name }
            );
        })*/
        that.list();
      }
    });
  }
  msgSend() {
    if (this.msgToSend != "") {
      let that = this;
      that.chatLoading = true;
      that.userSvc.apiCallNode(UserService.actions.ConversationCreate, { accountID: this.accountID, ID1: this.currentCon.ID1, msg: this.msgToSend }).subscribe(res => {
        if (res.status) {
          let temp = {
            "text": this.msgToSend,
            "id": "",
            "sender": "Me",
            "createdAt": Date.now()
          };
          this.chatMessages.push(temp);
          this.msgToSend = "";
        }
        else {
          this.userSvc.showSnak(res);
        }
        that.chatLoading = false;

      });
    }
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    //this.selected.push(selected[0]['id']);    

  }

  onActivate(event) {
    if (event.type == 'click' && event.column.name != 'checkCol') {

      if (this.currentCon.ID1 != event.row.ID1) {
        this.currentCon = event.row;
        this.chatMessageGetAll(event.row.ID1)
        this.contactInfoGetAll(event.row.publicIdentifier);
      }
    }
  }
  setStatus(row, status) {
    if (status != 'cancel') {
      row.status = status;
      this.updateStatus(row.id, status);
    }

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

  onCampaignFilterChange(event) {

    const val = event.value.toLowerCase();

    // filter our data
    if (val != 'all') {
      const temp = this.temp.filter(function (d) {
        try {
          if (d.cNames.toLowerCase().indexOf(val) !== -1)
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
  filterByStarred(){
    const temp = this.temp.filter(function (d) {
        try {
          if (d.star>0)
            return true;
          else
            return false;
        } catch (err) {
          return false;
        }
      });
      this.items = temp;
  }
  starredChange(event){
    console.log(event)
  }
  updateFilter(event) {

    const val = event.target.value.toLowerCase();
    // filter our data

    const temp = this.temp.filter(function (d) {

      try {

        if (d.fullName.toLowerCase().indexOf(val) !== -1 || d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || d.occupation.toLowerCase().indexOf(val) !== -1 || d.industry.toLowerCase().indexOf(val) !== -1 || d.location.toLowerCase().indexOf(val) !== -1)
          return true;
        else
          return false;
      } catch (err) {
        return false;
      }
    });

    this.items = temp;

  }


  updateStatus(id, status) {
    let that = this;
    that.userSvc.appiCall(UserService.actions.InConnectionUpdate, { id: id, status: status }).subscribe(res => {
      this.userSvc.showSnak(res)
    });
  }

}
