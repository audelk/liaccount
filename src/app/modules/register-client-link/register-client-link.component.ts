import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';

@Component({
  selector: 'app-register-client-link',
  templateUrl: './register-client-link.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class RegisterClientLinkComponent implements OnInit {

  public res = new Response();
  public resn = new Response();
  public investment = new Response();
  public objectName = "Registration"
  isLoading = false;
  record: any = {};
  formOptions: any;
  accountID;
  currentCon;
  formFields: any;
  fields = ['email', 'first_name', 'last_name', 'remarks'];
  fieldsEdit = ['email', 'first_name', 'last_name', 'remarks'];
  formFieldsEdit: any;
  public items: any[];
  model: any;
  accountLoaded = true;
  searchText = "";
  public tokenData = new Response();
  public temprecords = [];
  public questions = [];
  public steps = { questionaire: 1, tos: 2, contract: 2.5, subscription: 3 };
  public currentStep = 0;
  public answers: any = {};
  private id: any = "";
  private at: any = "";
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
    Object.freeze(this.steps);

  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.at = this.route.snapshot.paramMap.get('at');
    this.currentStep = 1;
    this.checkToken(this.id, this.at);

  }
  checkToken(id, token) {
    let that = this;
    that.userSvc.appiCall(UserService.actions["ProspectCheckToken"], { id: id, token: token }, "public").subscribe(res => {
      that.tokenData = res;
    });
  }
  onQASubmit(form: any) {

    this.answers = form;
    this.currentStep = 2;

  }
  next(step) {
    this.currentStep = step;
  }
  back(step) {
    this.currentStep = step;
  }
  onCCCancel(step: any) {

    this.currentStep = step;
  }
  onCCSubmit(res: any) {
    if (res.status) {
      this.checkToken(this.id, this.at);
      this.sendAnswers(this.answers);
      this.currentStep = 0;
    }
    else {
      this.res = res;
    }
  }

  sendAnswers(form) {
    let that = this;
    form.userID = that.tokenData.data.id;
    that.userSvc.appiCall(UserService.actions["ProspectSendAnwsers"], form, "public").subscribe(res => {
      that.tokenData = res;
    });
  }
}
