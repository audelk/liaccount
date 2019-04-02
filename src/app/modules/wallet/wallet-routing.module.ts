
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { WalletComponent } from './wallet.component';
const routes: Routes = [
  {
    path: '',
    component: WalletComponent, pathMatch: 'full',
    data: {
      title: 'Wallet'
    },    
  },  
  { path: '**', redirectTo: '', pathMatch: 'full' }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
