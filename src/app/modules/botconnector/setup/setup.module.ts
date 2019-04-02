import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup.component';
import {OurCommonModule} from '../../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConnectionComponent } from './connection.component';
import { ResponseComponent } from './response.component';
import { SettingComponent } from './setting.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
const routes: Routes = [
  {
    path: '',
    component: SetupComponent, 
    data: {
      title: 'Messenger Campaigns',breadcrumb: 'Messenger Campaigns'
    },
  },
   
  { path: '**', redirectTo: '', }

];
@NgModule({
  imports: [
    
     CommonModule,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule,MatSlideToggleModule

  ],
  declarations: [SetupComponent, ConnectionComponent, ResponseComponent, SettingComponent],
  entryComponents:[ConnectionComponent,ResponseComponent]
})
export class SetupModule { }
