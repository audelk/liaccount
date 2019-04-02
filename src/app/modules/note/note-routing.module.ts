import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NoteComponent } from './note.component';
const routes: Routes = [
  {
    path: '',
    component: NoteComponent, pathMatch: 'full',
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
export class NoteRoutingModule { }




