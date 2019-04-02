import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-globalsearch',
  templateUrl: './globalsearch.component.html',
  styles: [],encapsulation: ViewEncapsulation.None
})
export class GlobalsearchComponent implements OnInit {

  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Connection"
  isLoading = false;
  totalResultCount:0;
  type = ''; uID;
  record: any = {};
  formOptions: any;
  model: any;
  accountProcessMsg = "";
  accountLoaded = true;
  public items: any[];
  public accrualUrl = "/members/";
  accountID;
  keyword:''
  constructor(
    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,
    public dataSvc: DataService) {

    this.formOptions = {
      iconLabel: true
    };
  }

  ngOnInit() {
    this.accountID=this.route.snapshot.paramMap.get('id'); 
   // this.list();
  }

  searchNow(){
    this.list();
  }
  list() {
    let that = this;
    let params={
      accountID:this.accountID,
      start:0,
      count:40,
      keyword: this.keyword
    }
    that.userSvc.apiCallNode(UserService.actions["GlobalSearch"],params).subscribe(res => {
      that.res = res;
      that.totalResultCount=0;
     // that.model = res.data.model;
      
      if (that.res.status) {
        that.totalResultCount=res.data.totalResultCount
        that.items = res.data.results;
      }

    });
    // that.userSvc.fundsData(UserService.actions.FundsData,{userID:this.uID}).subscribe();
  }
}
