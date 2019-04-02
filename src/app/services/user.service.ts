import { Injectable } from '@angular/core';
import { DataService, Response } from '../providers/data.service';
import { NodeService } from '../providers/data.node.service';
import { Investor } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { mergeMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Resolve } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CheckboxField,DropdownField, RadioField, FileField, TextAreaField, TextboxField, DateField } from '../helpers/dynamicform/formmodels';
import { DatePipe } from '@angular/common';
@Injectable()
export class UserService {
  // user logged in token authorization storage key
  public _userLoggedInTokenKey = 'loggedinMember';

  public notifications = {};
  protected _user: Investor;
  public website: string = '';
  public inProfileRoot = "https://www.linkedin.com/in/";
  public noPicture = "https://s3.amazonaws.com/wll-community-production/images/no-avatar.png";
  public companyLogo: string = 'https://www.thereallife.biz/wp-content/uploads/2017/11/Logo3dreallife-1.png';
  static readonly actions = {
    GetAccountDetails: "GetAccountDetails",
    LoginMe: "LoginMe",
    LoginMeFB: 'LoginMeFB',
    ActivateMeMobile: "ActivateMeMobile",
    RegisterMe: "RegisterMe",
    RegisterMeMobile: "RegisterMeMobile",
    RequestResetCode: "RequestResetCode",
    ValidateResetCode: "ValidateResetCode",
    UpdatePassword: "UpdatePassword",
    UpdateProfile: "UpdateProfile",
    UpdateAccount: "UpdateAccount",
    UploadProfilePic: "UploadProfilePic",
    ResetPassword: "ResetPassword",
    RequestResetLink: 'RequestResetLink',
    ActivateLink: "ActivateMe",
    GetNotifications: 'GetNotifications',
    GetTimeline: 'GetTimeline',
    UpdateNotification: 'UpdateNotification',
    GetRequirements: 'GetRequirements',
    UserSettings: 'UserSettings',
    UserList: 'UserList',
    UserAdd: 'UserAdd',
    UserGet: 'UserGet',
    UserUpdate: 'UserUpdate',
    UserDelete: 'UserDelete',
    UserUpdateProfile: 'UserUpdateProfile',
    UserGetWallet: 'UserGetWallet',
    UserUpdateWallet: 'UserUpdateWallet',
    UserSettingsSave: 'UserSettingsSave',
    LeadSettingsGeneral: 'LeadSettingsGeneral',
    LeadSettingsSave: 'LeadSettingsSave',

    CustomerList: "CustomerList",
    CustomerSummary: "CustomerSummary",
    CustomerInvoiceAll:'CustomerInvoiceAll',
    
    ProspectApplyCode:"ProspectApplyCode",
    ProspectList: "ProspectList",
    ProspectData:"ProspectData",
    ProspectModel: "ProspectModel",
    ProspectDelete: "ProspectDelete",
    ProspectUpdate: "ProspectUpdate",
    ProspectAdd: "ProspectAdd",
    ProspectAddPublic: "ProspectAddPublic",
    ProspectCheckToken:"ProspectCheckToken",
    ProspectSendAnwsers:"ProspectSendAnwsers",
    ProspectGeneratePaymentAccessToken:"ProspectGeneratePaymentAccessToken",
    ProspectGeneratePaymentAccessTokenList:"ProspectGeneratePaymentAccessTokenList",
    QuestionList: "QuestionList",
    QuestionDelete: "QuestionDelete",
    QuestionUpdate: "QuestionUpdate",
    QuestionAdd: "QuestionAdd",

    UserAddNote: 'UserAddNote',
    UserGetNotes: 'UserGetNotes',
    UserGetDownloads: 'UserGetDownloads',
    UserUpdateNote: 'UserUpdateNote',
    UserDeleteNote: 'UserDeleteNote',
    UpdatePasswordExt: 'UpdatePasswordExt',
    UserPerformSearch: 'UserPerformSearch',
    UserLogout: 'UserLogout',
    UserPerformSearchDownload: 'UserPerformSearchDownload',
    UserPerformSearchSave: 'UserPerformSearchSave',
    UserPerformDownloadSave: 'UserPerformDownloadSave',
    GetTOS: 'GetTOS',
    SettingsGeneralGet: 'SettingsGeneralGet',
    ResourceList: 'ResourceList',

    AccountListN: 'accounts/list',
    AccountAddN: 'accounts/add',
    AccountAddNManual: 'accounts/addManual',
    AccountAdd: 'AccountAdd',
    AccountUpdate: 'AccountUpdate',
    AccountDelete: 'AccountDelete',
    AccountList: 'AccountList',
    AccountListSummary: 'AccountListSummary',
    SigninVerify: 'accounts/signin-verify',

    InAccountSpreadSheetStatus:'InAccountSpreadSheetStatus',
    InAccountSpreadSheetAddSheet:'InAccountSpreadSheetAddSheet',
    InAccountCreateSheet:"InAccountCreateSheet",
    AccountSettings: 'InAccountSettings',
    AccountSettingsAdd: 'InAccountSettingsAdd',
    AccountSettingsUpdate: 'InAccountSettingsUpdate',

    ConnectionSearch: 'accounts/connection-search',
    ConnectionImport: 'accounts/connections-import',
    ConnectionImportEmails: 'ConnectionImportEmails',
    ConnectionImportUpdateLocations: 'accounts/connections-update-locations',
    //ConnectionList:'accounts/connections-list',
    ConnectionList: 'ConnectionList',
    ConnectionListPortal:'ConnectionListPortal',
    CampaignsList: 'CampaignsList',
    ConnectionContactInfo: 'accounts/connections-contactInfo',
    InvitationsImport: 'accounts/invitations-sent',

    ConversationCreate: 'conversations/create',
    ConversationList: 'conversations/list',
    InConnectionUpdate: 'InConnectionUpdate',

    GlobalSearch: 'accounts/global-search',
    InSearchTypeAhead: 'search/typeahead',
    InSearchTypeAheadDefaults: 'search/typeahead-defaults',

    BotResponderList: 'BotResponderList',
    BotResponderAdd: 'BotResponderAdd',
    BotResponderDelete: 'BotResponderDelete',
    BotResponderUpdate: 'BotResponderUpdate',
    BotResponderDuplicate: 'BotResponderDuplicate',


    EmailTemplateList: 'EmailTemplateList',
    EmailTemplateAdd: 'EmailTemplateAdd',
    EmailTemplateDelete: 'EmailTemplateDelete',
    EmailTemplateUpdate: 'EmailTemplateUpdate',



    BotResponderConnectionModel: 'BotResponderConnectionModel',
    BotResponderConnectionAdd: 'BotResponderConnectionAdd',
    BotResponderConnectionList: 'BotResponderConnectionList',
    BotResponderMessageList: 'BotResponderMessageList',
    BotResponderMessageAdd: 'BotResponderMessageAdd',
    BotResponderMessageDelete: 'BotResponderMessageDelete',
    BotResponderMessageUpdate: 'BotResponderMessageUpdate',
    BotResponderSettings: 'BotResponderSettings',
    BotResponderSettingsUpdate: 'BotResponderSettingsUpdate',

    BotConnectorList: 'BotConnectorList',
    BotConnectorListTemplate: 'BotConnectorListTemplate',    
    BotConnectorAdd: 'BotConnectorAdd',
    BotConnectorDelete: 'BotConnectorDelete',
    BotConnectorUpdate: 'BotConnectorUpdate',
    BotConnectorDuplicate: 'BotConnectorDuplicate',
    BotConnectorSaveAsTemplate: 'BotConnectorSaveAsTemplate',
    BotConnectorDeleteTemplate: 'BotConnectorDeleteTemplate',
    BotConnectorUpdateTemplate: 'BotConnectorUpdateTemplate',
    BotConnectorDuplicateTemplate: 'BotConnectorDuplicateTemplate',

    BotConnectorConnectionModel: 'BotConnectorConnectionModel',
    BotConnectorConnectionAdd: 'BotConnectorConnectionAdd',
    BotConnectorConnectionList: 'BotConnectorConnectionList',
    BotConnectorMessageList: 'BotConnectorMessageList',
    BotConnectorMessageAdd: 'BotConnectorMessageAdd',
    BotConnectorMessageDelete: 'BotConnectorMessageDelete',
    BotConnectorMessageUpdate: 'BotConnectorMessageUpdate',
    BotConnectorSettings: 'BotConnectorSettings',
    BotConnectorSettingsUpdate: 'BotConnectorSettingsUpdate',

    SearchList: 'SearchList',
    SearchAdd: 'SearchAdd',
    SearchDelete: 'SearchDelete',
    SearchUpdate: 'SearchUpdate',
    SearchDo: 'SearchDo',
    //SearchResults:'search/results',
    SearchResults: 'SearchResults',
    SearchResultsExportCSV: 'SearchResultsExportCSV',
    SearchResultsImport: '',
    PlanList: "PlanList",
    PlanPurchase: "PlanPurchase",
    PlanDowngrade: "PlanDowngrade",
    PlanUpgrade: "PlanUpgrade",
    PlanCancel: "PlanCancel",
    PlanUpdateSettings: "PlanUpdateSettings",
    PlanCheckPermission: 'PlanCheckPermission',
    PlanPurchaseProspect:'PlanPurchaseProspect',

    PaymentMethodAdd: 'PaymentMethodAdd',
    PaymentMethodAddProspect: 'PaymentMethodAddProspect',
    PaymentMethodData: 'PaymentMethodData',
    PaymentMethodDataProspect: 'PaymentMethodDataProspect',

    InviteNorm: "invite/norm",
    InviteSalesNav: "invite/sales-nav",
    PlanPurchaseTrial: "PlanPurchaseTrial",
    InboxList: 'InboxList',
    TaskList: 'TaskList',
    InboxMessageSetStatus: 'InboxMessageSetStatus',
    InboxMessageSetStar: 'InboxMessageSetStar',
    InboxContactSendToCRM:'InboxContactSendToCRM',
    GetInNotifications: 'GetInNotifications',

    DashboardSubscription: 'DashboardSubscription',
    DashboardConnections: 'DashboardConnections',
    DashboardCommuncations: 'DashboardCommuncations',
    DashboardMessenger: 'DashboardMessenger',
    DashboardConnector: 'DashboardConnector',
    DashboardInbox: 'DashboardInbox',
    DashboardConnectedByAccount: 'DashboardConnectedByAccount',
    DashboardInvitesByAccount: 'DashboardInvitesByAccount',
    AffiliateList: 'AffiliateList',
    AffiliateLinkList: 'AffiliateLinkList',
    AffiliateLinkNew: 'AffiliateLinkNew',

    AffiliateListVIP: 'AffiliateListVIP',
    AffiliateLinkListVIP: 'AffiliateLinkListVIP',
    AffiliateLinkNewVIP: 'AffiliateLinkNewVIP',
    PartnerList:'PartnerList',
    SupportLoadVideos: 'SupportLoadVideos'
  };
  public memberModel: any;
  public memberProfileModel: any;
  public adminModel: any;
  public adminProfileModel: any;
  public userRecord: any;
  public autoLogOutMessage: string = '';
  public editingUserID = 0;
  public TOSEnabled = true;
  public TOSAgree = false;
  public TOSEnable = false;
  public selectedInAccount: any = {};
  public selectedProspect: any = {};
  public inAccountSettings: any = {};
  public
  constructor(
    protected nodePdr: NodeService,
    protected dataPdr: DataService,
    private snack: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.website = dataPdr.website;
  }

  activateLink(id, at) {
    let form = {
      id: id,
      at: at,
      action: UserService.actions.ActivateLink
    }
    return this.dataPdr.submit(form);
  }
  /**
     * Create form field
     * @param fieldModel
     */
  createFormField(fieldModel) {

    if (fieldModel.attr.type == 'enum') {
      return new DropdownField(fieldModel);
    }
    else if (fieldModel.attr.type == 'radio') {
      return new RadioField(fieldModel);
    }
    else if (fieldModel.attr.type == 'checkbox') {
      return new CheckboxField(fieldModel);
    }
    else if (fieldModel.attr.type == 'file')
      return new FileField(fieldModel);
    else if (fieldModel.attr.type == 'textarea')
      return new TextAreaField(fieldModel);
    else if (fieldModel.attr.type == 'date')
      return new DateField(fieldModel);
    else
      return new TextboxField(fieldModel);

  }
  appiCall(action, params = {}, type = 'private') {
    let that = this;
    let temp = Object.assign({}, params, { action: action });
    if (type == 'private')
      return this.dataPdr.submitJWT(temp, that._userLoggedInTokenKey);
    else
      return this.dataPdr.submit(temp);
  }

  apiCallNode(action, params = {}) {
    let that = this;
    let temp = Object.assign({}, params, { endNode: action });

    return this.nodePdr.submitJWT(temp, that._userLoggedInTokenKey);

  }

  leadSettingsGeneral(params = {}) {
    let that = this;
    let temp = Object.assign({}, { action: UserService.actions.UserUpdate }, params);
    return this.dataPdr.submitJWT(temp, that._userLoggedInTokenKey);
  }
  userAdd(params = {}) {
    let that = this;
    let temp = Object.assign({}, { action: UserService.actions.UserAdd }, params);
    return this.dataPdr.submitJWT(temp, that._userLoggedInTokenKey);
  }
  userGet(params: any = {}) {
    let that = this;
    let temp = Object.assign({}, { action: UserService.actions.UserGet }, params);
    return this.dataPdr.submitJWT(temp, that._userLoggedInTokenKey).pipe(
      tap(res => {
        if (res.status) {
          if (that.memberModel == undefined && params.type == 'member') {
            that.memberModel = res.data.model;
            that.memberProfileModel = res.data.profileModel;
          }

          that.userRecord = res.data.record;
        }
      }));
  }

  userUpdate(params = {}) {
    let that = this;
    let temp = Object.assign({}, { action: UserService.actions.UserUpdate }, params);
    return this.dataPdr.submitJWT(temp, that._userLoggedInTokenKey);
  }

  userDelete(params = {}) {
    let that = this;
    let temp = Object.assign({}, { action: UserService.actions.UserDelete }, params);
    return this.dataPdr.submitJWT(temp, that._userLoggedInTokenKey);
  }

  userList(params: any = {}) {
    let that = this;
    let temp = Object.assign({}, { action: UserService.actions.UserList }, params);
    temp.user_id = that.editingUserID;
    return this.dataPdr.submitJWT(temp, that._userLoggedInTokenKey).pipe(
      tap(res => {
        if (res.status) {
          if (that.memberModel == undefined && params.type == 'member') {
            that.memberModel = res.data.model;
            that.memberProfileModel = res.data.profileModel;
          }

        }
      }));
  }
  userUpdateProfile(form) {
    form.action = UserService.actions.UserUpdateProfile;
    return this.dataPdr.submitJWT(form, this._userLoggedInTokenKey);
  }

  getNotifications(page) {
    let that = this;
    return this.dataPdr.submitJWT({ action: UserService.actions.GetNotifications, p: page }, that._userLoggedInTokenKey)
      .pipe(
      tap(res => {
        if (res.status) {

          that._user.notifications = res.data;
        }
      }));
  }

  getRequirements() {
    let that = this;
    return this.dataPdr.submitJWT({ action: UserService.actions.GetRequirements }, that._userLoggedInTokenKey)
      .pipe(
      // map(),
      tap(res => {
        if (res.status) {
          that._user.documents = res.data.docModel;
        }

      }));
  }

  getTimeline(page) {
    let that = this;
    return this.dataPdr.submitJWT({ action: UserService.actions.GetTimeline, p: page }, that._userLoggedInTokenKey);
  }



  /**
     * Check if there's currently logged in user by checking session    
     */
  isUserLogin() {

    let that = this;
    let session = that.dataPdr.sessionGet(that._userLoggedInTokenKey);
    this.TOSEnable = this.dataPdr.storeGet('TOSEnable');
    let r = false;
    this.TOSAgree = this.dataPdr.storeGet('TOSAgree');

    if (session.status === true && (session.data.decodedTokenData.role == 'member')) {
      that._user = new Investor(session.data.decodedTokenData);
      r = true;
    }
    else {
      that._user = new Investor({ loggedIn: false });
    }
    return r;
  }

  /**
     * Perfoms user login to server.If successful will initialize _accountDetails.
     * Raw data from server will be passed in returned Promised.
     * @param form fields to submit to server
    */
  login(form): Observable<Response> {
    let that = this;
    form.action = form.action == undefined ? UserService.actions.LoginMe : form.action;
    return that.dataPdr.submit(form, that._userLoggedInTokenKey)
      .pipe(
      // map(),
      tap(res => {
        if (res.status && (res.data.role == 'member')) {
          that._user = new Investor(res.data);
          that.editingUserID = res.data.user_id;
        }
        else
          that._user = new Investor({});
      }),
      //mergeMap(res => res.status == true ? that.setAccount(res) : of(res))
    )

  }
  logout() {
    let that = this;
    this.appiCall(UserService.actions.UserLogout, { loggedIn: 0 }).subscribe(res => {
      if (res.status == true) {
        this.dataPdr.storeSave(false, 'TOSAgree');
        this.dataPdr.sessionDestroy(this._userLoggedInTokenKey);
      }

      else
        this.showSnak(res);
    })


  }
  /**
     * Register user to server
     * @param form - fields to submit to server
     * @return Promise
     */
  getServerTime() {
    let form = { action: 'GetServerTime' };
    return this.dataPdr.submit(form);
  }
  getBITPrice() {
    let form = { action: 'GetBITPrice' };
    return this.dataPdr.submit(form);
  }
  register(form) {
    form.action = form.action == undefined ? UserService.actions.RegisterMe : form.action;
    return this.dataPdr.submit(form);
  }

  /**
     * Reset Password. Request for reset code from server. Reset code will be sent to email or phone
     * @param form - fields to submit to server
     */
  resetCodeRequest(form) {

    form.action == undefined ? form.action = UserService.actions.RequestResetCode : '';
    //doSubmit will return jwt,so will be use for inputing reset code and new password
    return this.dataPdr.submit(form, 'resetCodeToken');

  }
  requestResetLink(form) {

    form.action == undefined ? form.action = UserService.actions.RequestResetCode : '';
    //doSubmit will return jwt,so will be use for inputing reset code and new password
    return this.dataPdr.submit(form);

  }
  /**
   * Validate reset code in server.We put 
   * @param form - fields to submit to server
   */
  resetCodeValidateReset(form) {
    form.action = form.action == undefined ? UserService.actions.ValidateResetCode : form.action;
    //submitJWT need jwt token, we use what we acquire from resetCodeRequest
    return this.dataPdr.submitJWT(form, 'resetCodeToken');

  }
  resetCodeUpdatePassword(form) {
    form.action = form.action == undefined ? UserService.actions.UpdatePasswordExt : form.action;
    //submitJWT need jwt token, we use what we acquire from resetCodeRequest
    return this.dataPdr.submitJWT(form, 'resetCodeToken');
  }
  updatePasswordExt(form) {
    form.action = form.action == undefined ? UserService.actions.UpdatePasswordExt : form.action;
    //submitJWT need jwt token, we use what we acquire from resetCodeRequest
    return this.dataPdr.submitJWT(form, this._userLoggedInTokenKey);
  }
  /**
   * Initialize _accountDetails from server data. Helpfull if needed to access account details
   * @return _accountDetils or null
   */
  setAccount(res): Observable<Response> {
    let that = this;

    if (that._user.loggedIn) {
      return that.dataPdr.submitJWT({ action: UserService.actions.GetAccountDetails }, that._userLoggedInTokenKey)
        .pipe(
        tap(res => {
          if (res.status) {
            that._user.setAccount(res);

          }
          else {
            that._user.unsetAccount();
            that.logout();
          }
        })
        );
    }
    else {
      return res;
    }

  }


  /**
    * Update account setting
    * @param form
    */
  updateAccount(form) {
    form.action = UserService.actions.UpdateAccount;
    return this.dataPdr.submitJWT(form, this._userLoggedInTokenKey);
  }
  updateNotification(data) {
    let that = this;
    data.action = UserService.actions.UpdateNotification;
    return this.dataPdr.submitJWT(data, that._userLoggedInTokenKey);
  }
  updateProfile(form) {
    form.action = UserService.actions.UpdateProfile;
    return this.dataPdr.submitJWT(form, this._userLoggedInTokenKey);
  }

  UpdatePassword(form) {

    form.action = form.action == undefined ? UserService.actions.UpdatePassword : form.action;
    //submitJWT need jwt token, we use what we acquire from resetCodeRequest
    return this.dataPdr.submitJWT(form, this._userLoggedInTokenKey);
  }
  formatDate() {

  }
  dateOnly(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  showSnak(res) {
    let that = this;
    if (res.status) {

      if (res.successes.length > 0)
        this.snack.open(res.successes[0], 'OK', { verticalPosition: 'top', duration: 40000 });

    }
    else {
      if (res.errors.length > 0)
        this.snack.open(res.errors[0], 'OK', { verticalPosition: 'top', duration: 4000 });

    }
  }
  /**
    * Upload profile picture
    */

  get accountDetails() {
    return this._user.accountDetails;
  }
  get profileDetails() {
    return this._user.profileDetails;
  }
  get user() {
    return this._user;
  }
  get accountCompletion() {
    return this._user.accountCompletion;
  }
  get accountComplete() {
    return this._user.accountComplete;
  }
  get loginTokenKey() {
    return this._userLoggedInTokenKey;
  }
  set accountComplete(val) {
    this._user.accountComplete = val;
  }
}



// Resolvers 
@Injectable()
export class UserAccountResolver implements Resolve<Response> {
  constructor(private userSvc: UserService) {
  }
  resolve(): Observable<Response> {
    let that = this;
    return that.userSvc.setAccount(new Response());
  }
}