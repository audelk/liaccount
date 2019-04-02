import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
import { ChartModule } from 'angular2-highcharts';
import {MatSidenav} from '@angular/material/sidenav';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatSidenav) chatSidebar: MatSidenav;
  data = new Response();
  customers: any = [];
  progressMode = 'indeterminate';
  loaded = false;
  accountID;
  connections: any = {};
  messengers:any={};
  connectors:any={}
  chartOptions: any;
  messages:any=[];
  isSidenavOpen:any=false;
  chatLoading = false;
  chatMessages = [];
  msgToSend = "";
  currentCon: any = { ID1: 0, firstName: undefined };
  constructor(
    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,
    private navSvc: NavigationService,
    public dataSvc: DataService
  ) { }

  ngOnInit() {
    this.messages=[];
    this.accountID = this.route.snapshot.paramMap.get('id');
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
    this.getNotifications();
    this.getDashboardConnections();
    this.getDashboardCommunication();
    this.getDashboardMessenger();
    this.getDashboardConnector();
    this.getDashboardInbox();
  }

  getDashboardCommunication() {
    let that = this;
    that.loaded = false;
    that.userSvc.appiCall(UserService.actions.DashboardCommuncations, { accountID: that.accountID }).subscribe(res => {
      if (res.status) {
        this.chartOptions = this.createChartOptions(res.data)
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
  getNotifications() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.GetInNotifications, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {

        that.userSvc.notifications = res.data;
      }
    });
  }

  getDashboardInbox(){
    let that=this;
    that.userSvc.appiCall(UserService.actions.DashboardInbox,{ accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.messages = res.data;
      }
    });
  }

  getDashboardConnections() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.DashboardConnections, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.connections = res.data;

      }
    });
  }

  getDashboardMessenger() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.DashboardMessenger, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.messengers = res.data;

      }
    });
  }

  getDashboardConnector() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.DashboardConnector, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.connectors = res.data;

      }
    });
  }
  viewAllInbox(){
    this.router.navigate(['/inaccount/inbox/'+this.accountID]);
  }

 
  chatMessageGetAll(ID1, row) {
    let that = this;
    that.chatLoading = true;
    that.userSvc.apiCallNode(UserService.actions.ConversationList, { ID1: ID1, accountID: this.accountID }).subscribe(res => {
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
  showMessages(contact){
    if (this.currentCon.ID1 != contact.ID1) {
        this.currentCon = contact;
        this.chatMessageGetAll(contact.ID1,contact)
    
    }
  this.chatSidebar.open();
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
}
