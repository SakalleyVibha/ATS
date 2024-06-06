import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommunicateService {
  isLoaderLoad: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isDetailSideShow: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private Secret_key = "RNFFc2PuKJBUwX77UNu5QT+urdxa986OeyaqnxMfXDM="

  constructor() { }
  queryValidator = /^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i
  isBase64(base64String:string) {
  return !!base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  }


 encryptText(text:string){
    var ciphertext = CryptoJS.AES.encrypt(text, this.Secret_key).toString();
    return ciphertext;
}
decryptText(ciphertext:any){
    if(!ciphertext) return ciphertext;
    var bytes  = CryptoJS.AES.decrypt(ciphertext, this.Secret_key);
    return bytes.toString(CryptoJS.enc.Utf8);
}
}