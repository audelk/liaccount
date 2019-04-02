import { Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';



@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class SupportComponent implements OnInit {
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
  pageTitle="";
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
    let menu = this.navSvc.createMenu(0);
    this.navSvc.publishNavigationChange(menu);
    this.list();
  }


 list() {
    let that = this;

    that.userSvc.appiCall(UserService.actions.SupportLoadVideos).subscribe(res => {
      if (res.status) {      
        that.items=res.data.records;
        that.pageTitle=res.data.pageTitle
      }
    });
  }
}
