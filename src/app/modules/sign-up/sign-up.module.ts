import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatStepperModule} from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';
const routes: Routes = [
  {
    path: '',
    component: SignUpComponent, pathMatch: 'full',
    data: {
      title: 'Sign Up',breadcrumb:'Sign Up'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
@NgModule({
  imports: [
    CommonModule,FormsModule,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule
  ],
  declarations: [SignUpComponent]
})
export class SignUpModule { }
