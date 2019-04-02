import { Component, OnInit } from '@angular/core';
import { Response, DataService } from '../../../providers/data.service';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styles: []
})
export class SetupComponent implements OnInit {
  accountID;
  constructor(private route: ActivatedRoute, public userSvc: UserService,
    public dataSvc: DataService, ) { }

  ngOnInit() {
  
    this.accountID = this.route.snapshot.paramMap.get('id');
    
  }

}
