import { Component, OnInit, ViewEncapsulation, ViewChild, EventEmitter, Output,Input } from '@angular/core';
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
  selector: 'app-vippaymentmethod',
  templateUrl: './vippaymentmethod.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class VippaymentmethodComponent implements OnInit {
  public res = new Response();
  public resCode = new Response();
  public objectName = "Plan"
  isLoading = false;
  record: any = {};
  @Output() onCCCancel: EventEmitter<any>;
  @Output() onCCSubmit: EventEmitter<any>;
  @Input() userID: any = 0;
  formOptions: any;
  accountID;
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
  affiliateCode:any="0";
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
    this.onCCCancel = new EventEmitter<any>();
    this.onCCSubmit = new EventEmitter<any>();
    this.formOptions = {
      iconLabel: true
    };

  }

  ngOnInit() {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      agree: ['', [Validators.required]],
      affiliateCode: ['']
    });
    this.edit();
    this.affiliateCode="3333"
  }
  applyCode(){
    let that = this;
    let form={
      affiliateCode:that.stripeTest.value.affiliateCode,
      userID:that.userID
    }
    that.isLoading=true;
    that.userSvc.appiCall(UserService.actions.ProspectApplyCode, form, 'public').subscribe(res => {
      that.isLoading = false;
      that.resCode=res;   
      that.userSvc.showSnak(res);

    });
  }
  edit() {

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
  methodAdd(token,affiliateCode) {
    let that = this;
    token.affiliateCode=affiliateCode;
    token.userID=that.userID;
    that.userSvc.appiCall(UserService.actions.PaymentMethodAddProspect, token, 'public').subscribe(res => {
      
      that.isLoading = false;
      that.userSvc.showSnak(res);
      this.onCCSubmit.emit(res);
      if (res.status) {        
        this.onCCSubmit.emit(res);
    
        ///  that.planPurchaseProspect();
      }
      

    });
  }
  planPurchaseProspect() {
    let that = this;
    that.isLoading = true;
    that.userSvc.appiCall(UserService.actions.PlanPurchaseProspect).subscribe(res => {
      if (res.status) {
        that.userSvc.user.subcription = res.data;
      }
      that.isLoading = false;
      //that.router.navigate(['/member/accounts']);
    });
  }
  stripeCheckout(event,e) {
    let that = this;
    const name = this.stripeTest.get('name').value;
    that.isLoading = true;
    debugger
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
         
          that.methodAdd(result.token,that.stripeTest.value.affiliateCode||0);
        } else if (result.error) {
          // Error creating the token
          that.isLoading = false;
          this.snack.open(result.error.message, 'OK', { verticalPosition: 'top', duration: 3000 })

        }
      });
  }

  back(step) {
    debugger
    this.onCCCancel.emit(step);
  }
}
