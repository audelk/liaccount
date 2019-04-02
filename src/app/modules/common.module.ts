import { NgModule, ModuleWithProviders, } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';

import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormComponent } from '../helpers/dynamicform/form.component';
import { DynamicFormService } from '../helpers/dynamicform/form.service';
import { PageNotFoundComponent } from '../views/page-not-found/page-not-found.component';
import { UserService,UserAccountResolver } from '../services/user.service';
import { AppConfirmService } from '../shared/services/app-confirm/app-confirm.service';
import { AppConfirmService2 } from '../shared/services/app-confirm2/app-confirm.service';

import { DataService } from '../providers/data.service';
import { NodeService } from '../providers/data.node.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadComponent } from '../helpers/file-upload/file-upload.component';
import { FormDirective } from '../directives/form/form.directive';
import { LanguageService } from '../services/language.service';
import {MatToolbarModule,MatSidenavModule, MatRadioModule, MatTabsModule, MatTableModule, MatChipsModule, MatExpansionModule, MatDialogModule, MatTooltipModule, MatProgressBarModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatListModule, MatIconModule, MatMenuModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
//import { NgxTablePopupComponent } from '../views/borrower/ngx-table-popup/ngx-table-popup.component'
import { Autosize } from '../helpers/formhelpers';
import { LaddaModule } from 'angular2-ladda';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterPipe} from '../pipes/common/filter.pipe';
import { ContainerComponent } from '../views/admin/container.component';
import { AddnewComponent } from '../views/admin/addnew.component';
import {FileUploadPage} from '../views/admin/fileupload.component';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
@NgModule({
  imports: [CommonModule,NgxDatatableModule,MatSidenavModule,MatRadioModule,FileUploadModule,MatToolbarModule,
    FormsModule, FlexLayoutModule, MatChipsModule,MatProgressSpinnerModule,MatTabsModule,MatTableModule,
    MatDialogModule, MatTooltipModule, MatExpansionModule,
    MatNativeDateModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatListModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatCardModule, MatMenuModule,
    RouterModule, MatProgressBarModule,
  
    LaddaModule,
    ReactiveFormsModule//,BrowserModule

  ],
  exports: [FilterPipe,
    PageNotFoundComponent,FileUploadModule,MatToolbarModule,MatSidenavModule,
    DynamicFormComponent,LaddaModule, MatRadioModule, FileUploadComponent,
    FormsModule, MatDialogModule, MatChipsModule,MatProgressSpinnerModule,MatTableModule,MatTabsModule,
    ReactiveFormsModule, MatProgressBarModule, MatExpansionModule,
    MatTooltipModule,NgxDatatableModule,FormDirective,
    MatNativeDateModule, MatDatepickerModule, MatButtonModule, MatSelectModule, MatListModule, MatCheckboxModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatMenuModule
    //BrowserModule
  ],
  declarations: [
    FilterPipe,
    FileUploadComponent,
    ContainerComponent,
    FileUploadPage,
    AddnewComponent,
    //NgxTablePopupComponent,
    
    PageNotFoundComponent, DynamicFormComponent,
     FormDirective,
     ],
    providers: [],
    entryComponents: [DynamicFormComponent,
    //  NgxTablePopupComponent,
     ContainerComponent,
     FileUploadComponent,
     FileUploadPage,
     AddnewComponent
  ]
})
export class OurCommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OurCommonModule,
      providers: [DatePipe,NodeService, DataService,AppConfirmService,AppConfirmService2, UserService, LanguageService, DynamicFormService, UserAccountResolver]
    };
  }
}
