import {Component,EventEmitter, Output, ElementRef, Renderer, Input, HostListener, HostBinding, OnInit} from '@angular/core';
import {FileUploader, FileUploaderOptions,} from 'ng2-file-upload';
import { Subject } from 'rxjs/Subject';
import {LanguageService} from '../../services/language.service';
@Component({
  selector: 'demo-file-upload',
  templateUrl: './file-upload.component.html',

})
export class FileUploadComponent implements OnInit {
  
  @Input() public url:string;
  @Input() public queueLimit:number;
  @Input() public maxFileSize:number;
  @Input() public autoUpload:boolean;
  @Input() public allowedMimeType:Array<string>;
  @Input() public allowedFileType:Array<string>;
  @Input() public removeAfterUpload:boolean;
  @Input() public headers:Array<any>;
  @Input() isLoading: boolean = false;
  @Input() submitText: string = 'Submit';
  @Input() authToken:string;
  @Input() isHTML5:boolean;
  @Input() title:string = 'Form';
  @Input() additionalParameter:any;
  @Output() formSubmit: EventEmitter<any>;
  @HostBinding('class.hover') private isHover:boolean = false;
  submitForm: Subject<any> = new Subject();  
  private inputs:string[] = ['allowedMimeType',
    'allowedFileType',
    'autoUpload',
    'isHTML5',
    'headers',
    'maxFileSize',
    'queueLimit',
    'removeAfterUpload',
    'url',
     'authToken','additionalParameter'
  ];

  private uploaderOptions:FileUploaderOptions = {};

  public multiple:boolean = false;

  private element:ElementRef;
  public uploader:FileUploader;
  private renderer:Renderer;
  
  public constructor(public lang:LanguageService, element:ElementRef, renderer:Renderer) {
    this.element = element;
     this.formSubmit = new EventEmitter<any>();
    this.renderer = renderer;
  }

  public ngOnInit():any {
    for (let input of this.inputs) {
      if (this[input]) {
        this.uploaderOptions[input] = this[input];        
      }
    }
   // this.uploaderOptions.allowedFileType=['.jpg','.jpeg','.png','.gif'];
    this.uploaderOptions.maxFileSize= 1024 * 1024 * 20;
     this.uploaderOptions.allowedMimeType= ['image/png', 'image/jpg', 'image/jpeg', 'image/gif','application/pdf'],
    this.uploader =  new FileUploader(this.uploaderOptions);
    this.multiple = (!this.queueLimit || this.queueLimit > 1);
    
    this.uploader.onProgressItem=(fitelItem,progress)=>{
        console.log(progress)
    }
    this.uploader.onCompleteItem=(item,response,status)=>{
      console.log(response)
    }
    this.uploader.onSuccessItem=(item,response,status)=>{
        let j=JSON.parse(response);
        this.submitForm.next(j);
        this.formSubmit.emit(j);
               
    }
    this.uploader._onErrorItem=(item,response,stats)=>{
        this.submitForm.next({status:false});
         this.formSubmit.emit({status:false});
    }
    this.uploader.onAfterAddingFile=(item)=>{
      console.log(item);
    }
  }
  upload(){
    this.uploader.uploadAll();
    
  }
  @HostListener('drop', ['$event'])
  public onDrop(event:any):void {
    this._preventAndStop(event);
    this.isHover = false;

    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }
    this.uploader.addToQueue(transfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event:any):void {
    this._preventAndStop(event);

    if (this.isHover) {
      return;
    }

    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }
    this.isHover = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event:any):void {
    this._preventAndStop(event);
    if (event.currentTarget === (this as any).element[0]) {
      return;
    }
    this.isHover = false;
  }

  public onChange($event:any):void {
    this.uploader.addToQueue($event.currentTarget.files);
  }

  private _getTransfer(event:any):any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _preventAndStop(event:any):any {
    event.preventDefault();
    event.stopPropagation();
  }

  private _haveFiles(types:any):any {
    if (!types) {
      return false;
    }

    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    } else if (types.contains) {
      return types.contains('Files');
    } else {
      return false;
    }
  }

}