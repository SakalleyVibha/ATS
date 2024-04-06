import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationDetailComponent } from './location-detail.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';

const routes: Routes = [{
  path: '',
  children: [
    { path: '', component: LocationDetailComponent },
    { path: 'add-location', component: ManageLocationComponent },
    { path: 'edit-location', component: ManageLocationComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationDetailRoutingModule { }
