import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './auth-guard.service';
import { UserAccountResolver } from './services/user.service'
import { ResetLinkComponent } from './views/reset-link/reset-link.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { TosComponent } from './views/tos/tos.component';
import { AffiliateregComponent } from './modules/affiliatereg/affiliatereg.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ActivateLinkComponent } from './views/activate-link/activate-link.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'member', pathMatch: 'full' },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    resolve: { response: UserAccountResolver },
    children: [
      { path: '', redirectTo: 'member', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
      },
      {
        path: 'complete-registration',
        loadChildren: './modules/complete-registration/complete-registration.module#CompleteRegistrationModule',
        data: { title: 'Complete Registration', breadcrumb: 'Complete Registration' }
      },
      {
        path: 'support',
        loadChildren: './modules/support/support.module#SupportModule',
        data: { title: 'support', breadcrumb: 'Support' }
      },
      {
        path: 'member',
        loadChildren: './views/member/member.module#MemberModule',
        data: { title: 'Home', breadcrumb: 'Home' }
      },
      {
        path: 'inaccount',
        loadChildren: './modules/inaccount/inaccount.module#InaccountModule',
        data: { title: 'In Account', breadcrumb: 'In Account' }
      },


    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'affiliatereg/:id', component: AffiliateregComponent },
  { path: 'affiliatereg', component: AffiliateregComponent },
  { path: 'tos', component: TosComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'resetLink/:tk', component: ResetLinkComponent },
  { path: 'activateLink/:id/:at', component: ActivateLinkComponent },
  {
    path: 'registerClientLink/:id/:at', loadChildren: './modules/register-client-link/register-client-link.module#RegisterClientLinkModule',
    data: { title: 'Complete Registration', breadcrumb: 'Complete Registration' }
  },
  {
    path: 'sign-up',
    loadChildren: './modules/sign-up/sign-up.module#SignUpModule',
    data: { title: 'Sign Up', breadcrumb: 'Sign Up' }
  },
  {
    path: 'update-payment-method/:token',
    loadChildren: './modules/vippaymentmethodext/vippaymentmethodext.module#VippaymentmethodextModule',
        data: { title: 'Payment method Info', breadcrumb: 'Payment method Info' }
      },
  {
    path: '**',
    redirectTo: 'member'
  }
];

