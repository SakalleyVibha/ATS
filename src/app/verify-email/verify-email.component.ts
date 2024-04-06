import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {

  email_add: string = '';

  constructor() {
    let data: any = localStorage.getItem('Shared_Data');
    data = JSON.parse(data);
    this.email_add = data.email_add;
  }

}
