import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrl: './dashboard-detail.component.css'
})
export class DashboardDetailComponent {

  constructor(private router: Router) { }

  ngOnInit() { }

  onLogout() {
    localStorage.clear()
    this.router.navigate(['/login']);
  }

}
