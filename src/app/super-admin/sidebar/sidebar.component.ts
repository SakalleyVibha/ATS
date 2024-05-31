import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  router:Router = inject(Router);
  onLogout(){
    localStorage.removeItem('supertoken');
    localStorage.removeItem('superdetails');
    this.router.navigate(['super-admin/login'])
  }
}
