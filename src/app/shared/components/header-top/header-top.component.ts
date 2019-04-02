import { Component, OnInit, Input, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationService } from "../../../shared/services/navigation.service";
import { Subscription } from 'rxjs/Subscription';
import { ThemeService } from '../../../shared/services/theme.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LayoutService } from '../../services/layout.service';
import { UserService } from '../../../services/user.service';
import { Response, DataService } from '../../../providers/data.service';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES,EventTargetInterruptSource } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { MatDialogRef } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppComfirmComponent } from '../../services/app-confirm/app-confirm.component';
@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html'
})
export class HeaderTopComponent implements OnInit, OnDestroy {
  timer: any;
  layoutConf: any;
  public res = new Response();
  menuItems: any;
  menuItemSub: Subscription;
  egretThemes: any[] = [];
  currentLang = 'en';
  availableLangs = [{
    name: 'English',
    code: 'en',
  }, {
    name: 'Spanish',
    code: 'es',
  }];
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  toReset = 0;
  @Input() notificPanel;
  dialogRef: MatDialogRef<AppComfirmComponent>;
  constructor(
    public confirmService: AppConfirmService,
    private idle: Idle, private keepalive: Keepalive,
    private layout: LayoutService,
    private navService: NavigationService,
    public themeService: ThemeService,
    public translate: TranslateService,
    private renderer: Renderer2,
    public dataSvc: DataService, public userSvc: UserService, public router: Router
  ) { 
    // this.initAutoLogout();
  }

  ngOnInit() {
    
   
    this.layoutConf = this.layout.layoutConf;
    this.egretThemes = this.themeService.egretThemes;

    this.menuItemSub = this.navService.menuItems$
      .subscribe(res => {
        res = res.filter(item => item.type !== 'icon' && item.type !== 'separator');
        let limit = 10
        let mainItems: any[] = res.slice(0, limit);
       
        if (res.length <= limit) {
         
          return this.menuItems = mainItems
        }
        let subItems: any[] = res.slice(limit, res.length - 1)
        mainItems.push({
          name: 'More',
          type: 'dropDown',
          tooltip: 'More',
          icon: 'more_horiz',
          sub: subItems
        })
        this.menuItems = mainItems
      })
     this.daysToReset(); 
  }
  ngOnDestroy() {
    this.menuItemSub.unsubscribe();
        //this.idle.stop();
   
   // this.idle.onIdleStart.unsubscribe();

   
  }
  daysToReset() {
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let temp = this.userSvc.user.wallet.date_auto_fill.split('-');
    let firstDate = new Date(this.userSvc.user.wallet.date_auto_fill);
    let secondDate = new Date();
    this.toReset = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  }
  setLang() {
    this.translate.use(this.currentLang)
  }
  changeTheme(theme) {
    this.themeService.changeTheme(this.renderer, theme);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      })
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }
  logout() {

    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.stop();
    
    this.idle.onTimeout.observers.length = 0;
    this.idle.onIdleStart.observers.length = 0;
    this.idle.onIdleEnd.observers.length = 0;
    this.userSvc.logout();

    this.router.navigateByUrl('/login');
  }

  initAutoLogout() {

    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(30*60);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    //this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      console.log('idle end')
      //this.idleState = 'active';

    });
    
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.dialogRef.close();
      this.logout();
      
      //this.logout();

    });
    this.idle.onIdleStart.subscribe(() => {

      if (this.idleState != 'dialogOpen') {
        this.idleState = 'dialogOpen';
        this.openDialog('Inactivity detected')
      }

    }
    );
    this.idle.onTimeoutWarning.subscribe((countdown) => {
     
      this.userSvc.autoLogOutMessage = 'You will be logout in ' + countdown + ' seconds!';
      this.confirmService.updateMessage(this.idleState);
    });


    this.reset();
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  openDialog(title) {
    let that = this;
    that.dialogRef = that.confirmService.confirm({ title: title, message: that.idleState, disableClose: true })
    that.dialogRef.afterClosed().subscribe((result) => {
      if (result == false) {
        this.dialogRef.close();
      
        that.logout();
      }

      else{
         that.idleState = 'active';
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.idle.clearInterrupts();
        this.idle.interrupt(true);
        this.reset();
      }
        
    });
  }

  goHome(){
    this.router.navigateByUrl('member/accounts');
  }
  goSupport(){
    this.router.navigateByUrl('support');
  }
}
