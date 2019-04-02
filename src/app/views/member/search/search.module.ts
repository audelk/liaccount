import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OurCommonModule} from '../../../modules/common.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DynamicSearchFormComponent } from '../../../helpers/dynamicsearchform/form.component';
@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,    FlexLayoutModule,OurCommonModule
  ],
  declarations: [SearchComponent,DynamicSearchFormComponent],
  entryComponents: [DynamicSearchFormComponent]
})
export class SearchModule { }
