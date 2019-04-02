import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup.component';
import {OurCommonModule} from '../../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SmtpComponent } from './smtp.component';
import { EmailTemplateComponent } from './email-template.component';

const routes: Routes = [
  {
    path: '',
    component: SetupComponent, 
    data: {
      title: 'Settings',breadcrumb: 'Settings'
    },
  },
   
  { path: '**', redirectTo: '', }

];

@NgModule({
  imports: [
   CommonModule,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule

  ],
 declarations: [SetupComponent, SmtpComponent, EmailTemplateComponent],
  entryComponents:[SmtpComponent,EmailTemplateComponent]
})
export class SetupModule { }
