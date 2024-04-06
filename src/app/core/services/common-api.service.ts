import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor(private http: HttpClient) { }

  isLoggedIn() {
    let token = localStorage.getItem('token');
    return token ? true : false;
  }

  allPostMethod(endpoint: string, data: any) {
    return this.http.post(`${environment.base_URL}/${endpoint}`, data);
  }

  allgetMethod(endpoint: string) {
    return this.http.get(`${environment.base_URL}/${endpoint}`);
  }
}
