import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {
  isLoaderLoad: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }
}