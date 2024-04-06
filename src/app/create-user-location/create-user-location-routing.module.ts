import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserLocationComponent } from './create-user-location.component';

const routes: Routes = [{ path: '', component: CreateUserLocationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateUserLocationRoutingModule { }
