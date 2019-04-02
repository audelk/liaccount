import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DataService, Response } from '../../providers/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styles: []
})
export class TosComponent implements OnInit {
  res:any;
  TOSText='';
  constructor(
    public dataSvc:DataService,
    public userSvc: UserService,
    private router:Router
  ) { }

  ngOnInit() {
    this.loadTOS();
  }
  loadTOS(){
    let that=this;
    that.userSvc.appiCall(UserService.actions.GetTOS,{},'public').subscribe(res=>{
        that.res=res;      
        if(that.res.data.TOS.data.enableIt){
            that.TOSText=that.res.data.TOS.data.text;
        }
    })
  }

  iagree(){
    this.dataSvc.storeSave(true ,'TOSAgree');
    this.router.navigateByUrl('/member');
  }
  logout(){
     this.userSvc.logout();
     this.router.navigateByUrl('/login');
  }
}
