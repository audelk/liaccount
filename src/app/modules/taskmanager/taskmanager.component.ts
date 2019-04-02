import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
@Component({
  selector: 'app-taskmanager',
  templateUrl: './taskmanager.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class TaskmanagerComponent implements OnInit {
  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "BotConnector"
  isLoading = false;
  record: any = {};
  formOptions: any;
  accountID;
  currentCon;
  formFields: any;
  fields = ['name', 'status'];
  fieldsEdit = ['name', 'status'];
  formFieldsEdit: any;
  public items: any[];
  public tasksCompleted=[];
  public tasksList=[];
  public loadingItems=false;
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
    let menu = this.navSvc.createMenu(this.accountID);
    this.navSvc.publishNavigationChange(menu);
    this.getNotifications();
    this.list();
  }
  getNotifications() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.GetInNotifications, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
       
        that.userSvc.notifications = res.data;
      }
    });
  }

  list() {
    let that = this;
    that.loadingItems=true;
    that.userSvc.appiCall(UserService.actions.TaskList, { accountID: this.accountID }).subscribe(res => {
      if (res.status) {
        that.tasksCompleted = res.data.tasksCompleted;
        that.tasksList=res.data.tasksList;
      }
      that.loadingItems=false;
    });
  }

  updateSpeed(event){
    let that=this;
    this.userSvc.inAccountSettings.data.invites_daily_max=event.checked?150:75;
    
    let form={ accountID: this.accountID};   
    form= Object.assign({},  this.userSvc.inAccountSettings,form);
    that.userSvc.appiCall(UserService.actions.AccountSettingsUpdate, form).subscribe(res => {
      if (res.status) {
         that.userSvc.showSnak(res);
      }
    });
    
  }
}
