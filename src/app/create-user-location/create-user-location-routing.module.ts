import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserLocationComponent } from './create-user-location.component';

const routes: Routes = [{
  path: '', component: CreateUserLocationComponent,
  children:[
    { path:'location-detail', loadChildren: () => import('./location-detail/location-detail.module').then(m => m.LocationDetailModule)},
    { path:'user-detail', loadChildren: () => import('./user-detail/user-detail.module').then(m => m.UserDetailModule)}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateUserLocationRoutingModule { }
