import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobComponent } from './lob.component';
import { ManageLobComponent } from './manage-lob/manage-lob.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: LobComponent },
    { path: 'add', component: ManageLobComponent },
    { path: 'edit', component: ManageLobComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobRoutingModule { }
