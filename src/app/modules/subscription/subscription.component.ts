import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationService } from '../../shared/services/navigation.service';
import { AddnewComponent } from '../../views/admin/addnew.component';
import { AppConfirmService2 } from '../../shared/services/app-confirm2/app-confirm.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class SubscriptionComponent implements OnInit {
  public res = new Response();
  public objectName = "Plan"
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
  model: any;
  paymentMethodData: any = false;
  purchasing = false;
  constructor(
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
    this.list();
    this.paymentMethodDataGet();
  }


  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions[that.objectName + "List"]).subscribe(res => {
      that.res = res;
      that.model = res.data.model;
      if (that.res.status) {
        that.items = that.setCurrentPlan(res.data.records);
      }
    });
  }

  cancelPlan(id) {
    let that = this;
    that.purchasing = true;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Cancel"], { currendPlanID: that.userSvc.user.subcription.plan_id }).subscribe(res => {
      if (res.status) {
        that.userSvc.user.subcription = res.data;
        that.list();
      }
      that.userSvc.showSnak(res);
      that.purchasing = false;
    });
  }
  cancelSub(plan) {
    let that = this;
    let data = { enableInput: false, message: "Cancel current subscription?" };
    this.confirmService.confirm(data)
      .subscribe(res => {
        if (res == true) {
          that.cancelPlan(plan.id);
        }
      })

  }

  choosePlan(plan) {

    let that = this;
    if (that.paymentMethodData == false) {
      let data = { enableInput: false, message: "You need to add payment method first. Add now?" };
      this.confirmService.confirm(data)
        .subscribe(res => {
          if (res == true) {
              this.router.navigateByUrl('member/paymentmethod');
          }
        })
    }
    else {
      let data = { enableInput: false, message: "Purchase " + plan.name + " plan?" };
      this.confirmService.confirm(data)
        .subscribe(res => {
          if (res == true) {
            that.purchasePlan(plan.id);
          }
        })
    }

  }

  paymentMethodDataGet() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.PaymentMethodData).subscribe(res => {
      if (res.status) {
        that.paymentMethodData = res.data;
      }

    });
  }


  reChoosePlan(plan) {
    plan.id = plan.plan_id;
    this.choosePlan(plan);
  }
  purchasePlan(id) {
    let that = this;
    that.purchasing = true;
    let currentPlanID=that.userSvc.user.subcription.plan_id || 0;
    that.userSvc.appiCall(UserService.actions[that.objectName + "Purchase"], { currentPlanID:currentPlanID , newID: id }).subscribe(res => {
      if (res.status) {
        that.userSvc.user.subcription = res.data;
        that.list();
      }
      that.userSvc.showSnak(res);
      that.purchasing = false;
    });
  }
  setCurrentPlan(plans) {
    let that = this;
    let planID = that.userSvc.user.subcription.plan_id;
    plans = plans.map(item => {
      if (item.id == planID) {
        item = Object.assign({}, item, that.userSvc.user.subcription);
      }
      return item;
    })
    
    plans = plans.filter(item => {
      if (that.userSvc.user.subcription != false && item.status !== "current" && item.settings.trial == true)
        return false;
      else if( item.settings.trial == true &&  item.status == "current" && item.cancelled==1)
        return false;
      else
        return true;
    });
    return plans;
  }
}
