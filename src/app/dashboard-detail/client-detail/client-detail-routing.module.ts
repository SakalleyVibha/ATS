import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDetailComponent } from './client-detail.component';
import { ManageClientComponent } from './manage-client/manage-client.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: ClientDetailComponent },
    { path: 'add', component: ManageClientComponent },
    { path: 'edit', component: ManageClientComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientDetailRoutingModule { }
