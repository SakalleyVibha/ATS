import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {
  isLoaderLoad: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  isBase64(base64String:string) {
  return !!base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  }
}