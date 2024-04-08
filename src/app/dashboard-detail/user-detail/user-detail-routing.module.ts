import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './user-detail.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: UserDetailComponent },
    { path: 'add', component: ManageUserComponent },
    { path: 'edit', component: ManageUserComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDetailRoutingModule { }
