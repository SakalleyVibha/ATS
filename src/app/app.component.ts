import { Component } from '@angular/core';
import { CommunicateService } from './core/services/communicate.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private communicate:CommunicateService,private loader:NgxUiLoaderService){}
  ngOnInit(){
    this.communicate.isLoaderLoad.subscribe((res:any)=>{
      if(res == true){
        this.loader.start();
      }else{
        this.loader.stop();
      }
    })
  }
}
