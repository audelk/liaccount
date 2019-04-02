import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { OurCommonModule } from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContainerComponent } from '../../views/admin/container.component';
import { SearchnewComponent } from './searchnew.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ResultsComponent } from './results.component';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    data: {title: 'Search', breadcrumb: 'Search'}
  },
  {
    path: 'results/:sid', component: ResultsComponent,
    data: {title: 'Results', breadcrumb: 'Results'}
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];



@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes), FlexLayoutModule, OurCommonModule, MatAutocompleteModule

  ],
  declarations: [SearchComponent, SearchnewComponent, ResultsComponent],
  entryComponents: [SearchnewComponent]
})
export class SearchModule { }
