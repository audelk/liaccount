import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class ResourceComponent implements OnInit {
  public items: any[];
  public res = new Response();


  constructor(    
    public userSvc: UserService,
    public lang: LanguageService,
    private router: Router,
    public dataSvc: DataService) {

  }

  ngOnInit() {
    this.list();

  }

  
  list() {
    debugger
    let that = this;
    that.userSvc.appiCall(UserService.actions.ResourceList).subscribe(res => {
      that.res = res;
      if (that.res.status) {
        that.items = res.data.records;       
      }
    });
  }
  
}
