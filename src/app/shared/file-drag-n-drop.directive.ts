import { Directive, HostListener, HostBinding, Output, EventEmitter, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[fileDragDrop]'
})

export class FileDragNDropDirective {
  //@Input() private allowed_extensions : Array<string> = ['png', 'jpg', 'bmp'];
  @Output() private filesChangeEmiter : EventEmitter<File[]> = new EventEmitter();
  //@Output() private filesInvalidEmiter : EventEmitter<File[]> = new EventEmitter();

  constructor(private el : ElementRef,private rendrer: Renderer2) { }

  @HostListener('dragover', ['$event']) public onDragOver(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    this.setStyle('#EBF5FF','cadetblue','2px dashed')
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    this.setStyle('#EBF5FF','#696D7D','2px dashed')
  }

  @HostListener('drop', ['$event']) public onDrop(evt:any){
    evt.preventDefault();
    evt.stopPropagation();
    this.setStyle('#EBF5FF','#696D7D','2px dashed')
    this.filesChangeEmiter.emit(evt);
  }

  private setStyle(bgc:string,bdc:string,bds:string){
    this.rendrer.setStyle(this.el.nativeElement, 'background', bgc);
    this.rendrer.setStyle(this.el.nativeElement, 'border-color', '#2828CB');
    this.rendrer.setStyle(this.el.nativeElement, 'border', bds);
    this.rendrer.setStyle(this.el.nativeElement, 'border-radius', '10px');
  }
}