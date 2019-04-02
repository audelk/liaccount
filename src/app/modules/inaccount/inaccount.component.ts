import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationService } from '../../shared/services/navigation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-inaccount',
  templateUrl: './inaccount.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class InaccountComponent implements OnInit {
  accountID;
  constructor(
    private route: ActivatedRoute,
    private navSvc: NavigationService,
    public userSvc: UserService,
  ) {

  }

  ngOnInit() {
    this.accountID = this.route.firstChild.snapshot.paramMap.get('id');
    this.getSettings();

  }

  getSettings() {
    let that = this;
   
    that.userSvc.appiCall(UserService.actions.AccountSettings, { accountID: this.accountID }).subscribe(res => {
      if (res.status)
        that.userSvc.inAccountSettings = res.data;
    })
  }

}


