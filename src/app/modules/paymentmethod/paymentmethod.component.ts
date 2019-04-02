import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
import { AppConfirmService2 } from '../../shared/services/app-confirm2/app-confirm.service';
import { StripeService, Elements, Element as StripeElement, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-paymentmethod',
  templateUrl: './paymentmethod.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class PaymentmethodComponent implements OnInit {

  public res = new Response();
  public prospectRes = new Response();
  public accessRes = new Response();
  public resAccessList = new Response();

  public objectName = "Plan"
  isLoading = false;
  record: any = {};
  formOptions: any;
  accountID;
  prospectID = "";
  currentCon;
  formFields: any;
  fields = ['name', 'status'];
  fieldsEdit = ['name', 'status'];
  formFieldsEdit: any;
  public items: any[];
  model: any;
  purchasing = false;
  methodData: any = { last4: 'no record', brand: "Card" };
  elements: Elements;
  card: StripeElement;
  showStripeForm = false;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;
  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    public lang: LanguageService,
    private route: ActivatedRoute,
    public composeDialog: MatDialog,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,
    private navSvc: NavigationService,
    private confirmService: AppConfirmService2,
    public dataSvc: DataService) {

    this.formOptions = {
      iconLabel: true
    };

  }

  ngOnInit() {
    this.showStripeForm = false;
    this.prospectID = this.route.snapshot.paramMap.get('id');
    this.methodDataGet();
    this.getProspectData();
    this.accessList();
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

  }

  getProspectData() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.ProspectData, { prospectID: that.prospectID }).subscribe(res => {
      that.prospectRes = res;
    });
  }

  generateNew() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.ProspectGeneratePaymentAccessToken, { prospectID: that.prospectID }).subscribe(res => {
      that.accessRes = res;
      that.accessList();
    });
  }


  edit() {
    this.showStripeForm = true;
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#example1-card');
        }
      });
  }

  methodAdd(token) {
    let that = this;
    that.userSvc.appiCall(UserService.actions.PaymentMethodAdd, token).subscribe(res => {
      that.isLoading = false;
      that.userSvc.showSnak(res);
    });
  }

  methodDataGet() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.PaymentMethodDataProspect, { prospectID: this.prospectID }).subscribe(res => {
      if (res.status) {
        that.methodData = {
          last4: res.data == false ? "no record" : "**** **** **** " + res.data.last4,
          brand: res.data == false ? "Card" : res.data.brand
        };
      }
      else
        that.methodData = { last4: 'no record' };
    });
  }
  accessList() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.ProspectGeneratePaymentAccessTokenList, { prospectID: that.prospectID }).subscribe(res => {
      that.resAccessList = res;
      if(that.resAccessList.data.length>0){
          that.resAccessList.data[0].expDate=that.dataSvc.getTokenExpirationDate(that.resAccessList.data[0].token);
      }

    });
  }
  stripeCheckout(event) {
    let that = this;
    const name = this.stripeTest.get('name').value;
    that.isLoading = true;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {

        if (result.token) {

          that.methodAdd(result.token);
        } else if (result.error) {
          // Error creating the token
          that.isLoading = false;
          this.snack.open(result.error.message, 'OK', { verticalPosition: 'top', duration: 3000 })

        }
      });
  }
}
