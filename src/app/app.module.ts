import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { GestureConfig } from '@angular/material';
import { PersistenceModule } from 'angular-persistence';
import { HttpClientModule } from '@angular/common/http';
import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { OurCommonModule } from './modules/common.module';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { ChartModule } from 'angular2-highcharts';
import { DatePipe, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './views/login/login.component';
import {ForgotPasswordComponent} from './views/forgot-password/forgot-password.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import {AppConfirmModule} from './shared/services/app-confirm/app-confirm.module';
import {AppConfirmModule2} from './shared/services/app-confirm2/app-confirm.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ResetLinkComponent } from './views/reset-link/reset-link.component';
import { TosComponent } from './views/tos/tos.component';
import { AffiliateregComponent } from './modules/affiliatereg/affiliatereg.component';
import { RegisterComponent } from './views/register/register.component';
import { ActivateLinkComponent } from './views/activate-link/activate-link.component';
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}
export function highchartsFactory() {
  return require('highcharts');
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,FlexLayoutModule,
    HttpModule,
    SharedModule,AppConfirmModule,AppConfirmModule2,
        MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    OurCommonModule.forRoot(),
    PersistenceModule,
    HttpClientModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false })
  ],
  declarations: [AffiliateregComponent,AppComponent,LoginComponent,ForgotPasswordComponent, ResetLinkComponent, TosComponent, RegisterComponent, ActivateLinkComponent],
  providers: [
    AuthGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
    // ANGULAR MATERIAL SLIDER FIX
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }