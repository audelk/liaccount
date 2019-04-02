import { NgModule,Pipe, PipeTransform  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SupportComponent } from './support.component';
import {OurCommonModule} from '../../modules/common.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: '',
    component: SupportComponent, pathMatch: 'full',
    data: {
      title: 'Training Videos'
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
import { DomSanitizer} from '@angular/platform-browser';
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),FlexLayoutModule,OurCommonModule,
   ],
  declarations: [SupportComponent,SafePipe]
})

export class SupportModule { }
