import { Injectable }     from '@angular/core';
import { UserService } from './services/user.service';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userSvc: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    //if (this.authService.isLoggedIn) { return true; }
    //return true;
    // Store the attempted URL for redirecting
    //this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    if(this.userSvc.isUserLogin()){
      
      
      // if(this.userSvc.TOSEnable==true && this.userSvc.TOSAgree==false){
      //    this.router.navigate(['/tos']);
        //  return false;  
      //}
      //else
      return true;
    }
    else{
      this.router.navigate(['/login']);   
       return false;   
    }
   
  }
}