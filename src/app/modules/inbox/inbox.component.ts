import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class InboxComponent implements OnInit {

  public res = new Response();
  public res2 = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Inbox"
  isLoading = false;
  chatMessages = [];
  type = ''; uID;
  record: any = {};
  formOptions: any;
  modelResponder: any;
  accountProcessMsg = "";
  accountLoaded = true;
  public items: any[] = [];
  public temp = [];
  accountID;
  currentCon :any= { ID1: 0 };
  chatLoading = false;
  selected = [];
  msgToSend = "";
  selectedIDs = [];
  formFieldsResponder: any;
  contactInfo: any = {};
  fieldsResponder = ['bot_responder_id'];
  selectEvent = false;
  public loadingItems=false;
  connectorID;
  enableSummary = true;
  summaryPosition = 'top';
  formFields: any;
  fields = ['note'];
  fieldsEdit = ['note'];  
  statusFilters = [
    { value: 'all', viewValue: 'All' },
    { value: 'read', viewValue: 'Read' },
    { value: 'unread', viewValue: 'Unread' },
  
  ];
  statusFiltersSelected = 'all';
  public loadingStatus=false;
  model=
  {"note":{
    "attr":{
      "label":"Add a note",
      "type":"textarea",
      "value":"",
      "placeholder":"Add a note"}
      ,
    "validators":{"required":false,"maxLength":300},
    "editable":true,"value":"",
    "key":"note"},
  };
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
    //this.accountID = this.route.snapshot.paramMap.get('id');
  
    // this.list();
    let menu = this.navSvc.createMenu(0);
    this.navSvc.publishNavigationChange(menu);
    this.list();
    this.getNotifications();
    this.statusFiltersSelected = 'all';
    this.formFields = this.createFormFields();
    this.getSpreadSheetStatus();
  }
  createFormFields() {
    let model = this.model;
    let fields = [];
    for (var i = 0; i < this.fields.length; i++) {
      fields.push(this.userSvc.createFormField(model[this.fields[i]]));
    }
    return fields;
  }
   opentNoteDialog(id, ID1,fields,  title) {
    let that = this;
    let dialogRef = this.composeDialog.open(AddnewComponent, {
      width: "720px",
      data: { formFields: fields, opts: { title: title, buttonText: 'Send' } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
        result.id = id;
        result.ID1=ID1;
        that.sendToCrm(result)
      }
    });
  }
  sendToCrm(params){
    let that = this;
    that.loadingItems=true;
    that.userSvc.appiCall(UserService.actions.InboxContactSendToCRM, params).subscribe(res => {
      if (res.status) {
         that.items=that.items.map(item=>{
             if(item.inid==params.id){
              item.ex_to_sheet=1;
             }
         
                return item;
         }) 
         that.userSvc.showSnak(res);
      }
      that.loadingItems=false;

    });
  }
  getNotifications() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.GetInNotifications, { accountID: 0 }).subscribe(res => {
      if (res.status) {
        that.userSvc.notifications = res.data;
      }
    });
  }

  chatMessageGetAll(ID1, row) {
    let that = this;
    that.chatLoading = true;
    that.userSvc.apiCallNode(UserService.actions.ConversationList, { ID1: ID1, accountID: this.userSvc.inAccountSettings.mainData.id}).subscribe(res => {
      if (res.status) {
        that.chatMessages = res.data.messages;
        if (row.inStatus == 'unread') {
          that.setMessageStatus(row);
        }
      }
      that.chatLoading = false;

    });
  }
  setMessageStatus(row) {
    let that = this;

    that.userSvc.appiCall(UserService.actions.InboxMessageSetStatus, { status: 'read', id: row.inid, accountID: that.accountID }).subscribe(res => {
      if (res.status) {


      }
      that.chatLoading = false;

    });
  }
  updateStar(id,star){
    let that = this;

    that.userSvc.appiCall(UserService.actions.InboxMessageSetStar, { star: star, id: id, accountID: that.accountID }).subscribe(res => {
      if (res.status) {

         that.userSvc.showSnak(res);
      }
      that.chatLoading = false;

    });
  }
  contactInfoGetAll(publicIdentifier) {
    let that = this;
    
    that.userSvc.apiCallNode(UserService.actions.ConnectionContactInfo, { publicIdentifier: publicIdentifier, accountID: this.userSvc.inAccountSettings.mainData.id }).subscribe(res => {
      if (res.status) {
        that.contactInfo = res.data.fields
      }

    });
  }
  getSelectConnectionIDS() {
    let temp = [];
    temp = this.selected.map(item => {
      return item.id;
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

  getCellClass({ row, column, value }) {

    if (row.inStatus == "unread") {

      return { "unread-message": row.inStatus == "unread" };
    }
  }
  getSpreadSheetStatus(){
    let that = this;
    that.userSvc.appiCall(UserService.actions.InAccountSpreadSheetStatus, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.spreadSheetStatus=res.data;
     
      }
    });
  
  }
  list() {
    let that = this;
    that.loadingItems=true;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"], { accountID: 0 }).subscribe(res => {
      that.res = res;
      that.loadingItems=false;
      if (that.res.status) {
        that.temp = [...res.data.records];
        that.items = res.data.records;

      }
      this.selected = res.data.records.filter(item => {
          return item.ex_to_sheet != 0;
        })
    });


    // that.userSvc.fundsData(UserService.actions.FundsData,{userID:this.uID}).subscribe();
  }
  msgSend() {
    if (this.msgToSend != "") {
      let that = this;
      that.chatLoading = true;
      that.userSvc.apiCallNode(UserService.actions.ConversationCreate, { accountID: this.userSvc.inAccountSettings.mainData.id, ID1: this.currentCon.ID1, msg: this.msgToSend }).subscribe(res => {
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
    
  }

  onActivate(event) {
    
    if (event.type == 'click' && (event.column.name != "checkCol" && event.column.name != "To CRM")) {
      
      if (this.currentCon.ID1 != event.row.ID1) {
        this.currentCon = event.row;
        this.chatMessageGetAll(event.row.ID1, event.row);
        this.contactInfoGetAll(event.row.publicIdentifier);

      }
    }
    else if(event.type == 'click' && event.column.name == "To CRM"){
          this.opentNoteDialog(event.row.inid,event.row.ID1, this.formFields, 'Send to CRM');
    }
  }
  setStatus(row, status) {
    if (status != 'cancel') {
      row.status = status;
      this.updateStatus(row.id, status);
    }

  }

  setStar(row,star){
    if(star!=-1){
      row.star=star;
      this.updateStar(row.inid,star);
    }
  }
  onStatusFilterChange(event) {

    const val = event.value.toLowerCase();

    // filter our data
    if (val != 'all') {
      const temp = this.temp.filter(function (d) {

        try {
          if (d.inStatus.toLowerCase().indexOf(val) !== -1)
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
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || d.occupation.toLowerCase().indexOf(val) !== -1 || d.industry.toLowerCase().indexOf(val) !== -1 || d.location.toLowerCase().indexOf(val) !== -1 || d.title.toLowerCase().indexOf(val) !== -1 || d.company.toLowerCase().indexOf(val) !== -1)
        return true;
      else
        return false;

    });

    // update the rows
    this.items = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }

  updateStatus(id, status) {
    let that = this;
    that.userSvc.appiCall(UserService.actions.InConnectionUpdate, { id: id, status: status }).subscribe(res => {
      this.userSvc.showSnak(res)
    });
  }


}
