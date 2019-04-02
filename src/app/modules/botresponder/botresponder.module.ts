import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BotresponderComponent } from './botresponder.component';
import { OurCommonModule } from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContainerComponent } from '../../views/admin/container.component';
const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    data: {
      title: 'Messenger Campaigns', breadcrumb: 'Messenger Campaigns'
    },
    children: [
      {
        path: '', component: BotresponderComponent,
        data: { title: 'Home', breadcrumb: 'Home', pathMatch: 'full' },
      },
    ]
  },
  {
    path: 'setup/:sid', pathMatch: 'full',
    data: { type: 'member', breadcrumb: 'Setup', title: 'Setup' },
    loadChildren: '../../modules/botresponder/setup/setup.module#SetupModule',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];



@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), FlexLayoutModule, OurCommonModule

  ],
  declarations: [BotresponderComponent]
})
export class BotresponderModule { }
