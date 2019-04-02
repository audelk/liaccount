import { Injectable }     from '@angular/core';
import { UserService } from './services/user.service';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
@Injectable()
export class CompleteAcctGuard implements CanActivate {
  constructor(
    private router: Router,
    private userSvc: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    debugger
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if(this.userSvc.isUserLogin()){
      if(this.userSvc.user.accountComplete==false){
        this.router.navigate(['/complete/account']);  
      }
      return true;
    }
    else{
       this.router.navigate(['/login']);  
       return false;   
    }
   
  }
}