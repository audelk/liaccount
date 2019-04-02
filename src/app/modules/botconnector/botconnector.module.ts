import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BotconnectorComponent } from './botconnector.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
const routes: Routes = [
  {
    path: '',
    component: BotconnectorComponent, pathMatch: 'full',
    data: {
      title: 'Auto Connectors',breadcrumb: 'Auto Connectors'
    },
  },
  {
        path: 'setup/:sid', pathMatch: 'full',
        data: { type: 'member', breadcrumb: 'Setup' ,title:'Setup'},
        loadChildren: './setup/setup.module#SetupModule',
    },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [
     CommonModule,RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule

  ],
  declarations: [BotconnectorComponent]
})
export class BotconnectorModule { }
