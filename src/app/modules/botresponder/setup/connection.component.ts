import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Response, DataService } from '../../../providers/data.service';
import { LanguageService } from '../../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../../shared/services/navigation.service';
import { AddnewComponent } from '../../../views/admin/addnew.component';

@Component({
  selector: 'setup-app-connection',
  templateUrl: './connection.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class ConnectionComponent implements OnInit {

  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "BotResponderConnection"
  isLoading = false;
  chatMessages = [];
  type = ''; uID;
  record: any = {};
  formOptions: any;
  model: any;
  modelResponder: any;
  accountProcessMsg = "";
  accountLoaded = true;
  public items: any[] = [];
  public temp = [];
  public accrualUrl = "/members/";
  accountID;
  currentCon:any={ID1:0,firstName:undefined};
  chatLoading = false;
  selected = [];
  msgToSend = "";
  selectedIDs = [];
  formFieldsResponder: any;
  contactInfo: any = {};
  fieldsResponder = ['bot_responder_id'];
  selectEvent = false;
  public loadingItems=false;
  //@ViewChild(DatatableComponent) table: DatatableComponent;
  responderID;
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
    public dataSvc: DataService) {

    this.formOptions = {
      iconLabel: true
    };

  }

  ngOnInit() {
    this.accountID = this.route.snapshot.paramMap.get('id');
    this.responderID = this.route.snapshot.paramMap.get('sid');
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
    this.list();
    this.statusFiltersSelected = 'all';
  }




  chatMessageGetAll(ID1) {
    let that = this;
    that.chatLoading = true;
    that.userSvc.apiCallNode(UserService.actions.ConversationList, { ID1: ID1, accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.chatMessages = res.data.messages
      }
      that.chatLoading = false;

    });
  }
  contactInfoGetAll(publicIdentifier) {
    let that = this;
    that.userSvc.apiCallNode(UserService.actions.ConnectionContactInfo, { publicIdentifier: publicIdentifier, accountID: this.accountID }).subscribe(res => {
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
  list() {
    let that = this;
    that.loadingItems=true;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"], { accountID: this.accountID, responderID: this.responderID }).subscribe(res => {
      that.res = res;
      that.loadingItems=false;

      if (that.res.status) {

        that.temp = [...res.data.records];
        that.items = res.data.records;

      }

    });


    // that.userSvc.fundsData(UserService.actions.FundsData,{userID:this.uID}).subscribe();
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
    if (event.type == 'click' && event.column.name != "checkCol") {
      if (this.currentCon.ID1 != event.row.ID1) {
        this.currentCon = event.row;
        this.chatMessageGetAll(event.row.ID1);
        this.contactInfoGetAll(event.row.publicIdentifier);
      }
    }
  }
  setStatus(row, status) {
    debugger
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
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.firstName.toLowerCase().indexOf(val) !== -1 || d.lastName.toLowerCase().indexOf(val) !== -1 || d.occupation.toLowerCase().indexOf(val) !== -1 || d.industry.toLowerCase().indexOf(val) !== -1 || d.location.toLowerCase().indexOf(val) !== -1)
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

