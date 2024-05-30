import { Component } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.css',
})
export class SuperAdminComponent {
  isLoginPath = false;

  constructor(private router: Router) {
    router.events.subscribe((event:Event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPath = event.url.includes('/login')
      }
    });
  }
}
