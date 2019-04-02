import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OurCommonModule} from '../common.module';
import { WalletComponent } from './wallet.component';
import { WalletRoutingModule } from './wallet-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    CommonModule,
    WalletRoutingModule,FlexLayoutModule,OurCommonModule
  ],
  declarations: [WalletComponent]
})
export class WalletModule { }
