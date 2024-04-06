import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationDetailComponent } from './location-detail.component';

const routes: Routes = [{ path: '', component: LocationDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationDetailRoutingModule { }
