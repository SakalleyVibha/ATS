import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ROLE } from '../Constants/role.constant';


@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor(private http: HttpClient) { }

  isLoggedIn() {
    let token = localStorage.getItem('token');
    return token ? true : false;
  }
  isSuperAdminLoggedIn(){
    let token = localStorage.getItem('supertoken');
    let details:any = localStorage.getItem('superdetails');
    details = details ? JSON.parse(details) : {};
    return !!(token && details && details.role == ROLE.SUPER_ADMIN);
  }
  allPostMethod(endpoint: string, data: any) {
    return this.http.post(`${environment.base_URL}/${endpoint}`, data);
  }

  allgetMethod(endpoint: string,Data:any) {
    return this.http.get(`${environment.base_URL}/${endpoint}`,Data);
  }
}
