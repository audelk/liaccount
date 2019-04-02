/**
  * Component
  * DynamicForm Component
  * Entry point and the main container for the form
  * @author Audel B. Kabristante
  * @copyright 2017 - Audel B. Kabristante
  * @copyright 2017 - www.site2apps.com
*/

import { Component,ViewEncapsulation, OnInit, EventEmitter, Output, Input, Type } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageService } from '../../services/language.service';
import { Autosize } from '../formhelpers';
import { Subject } from 'rxjs/Subject';
// Object models that has properties that are needed by the form functionality
import { FormFieldBase } from './formmodels';
//A simple service transforming model into FormGroup
import { DynamicFormService } from './form.service';

@Component({
    selector: 'dynamic-form',
    templateUrl: './form.component.html',
    styleUrls: [],
      encapsulation: ViewEncapsulation.None,
    providers: [DynamicFormService]
})
export class DynamicFormComponent implements OnInit {
    @Input() submitText: string = 'Submit';
    @Input() submitUrl: string = '#';
    @Input() formOpts: any = { iconLabel: false };
    @Input() eventToListen: string;
    @Input() isLoading: boolean = false;
    @Input() fields: FormFieldBase<any>[] = [];
    @Output() formSubmit: EventEmitter<any>;
    form: FormGroup;
    @Input() formName: string = 'form';
    @Input() formID: any = 0;
    date:any;
    submitForm: Subject<any> = new Subject();    
   
    constructor( private dfs: DynamicFormService, private lang: LanguageService) {
        this.formSubmit = new EventEmitter<any>();
        //this.uploader.setOptions({url:'http://127.0.0.1/thereallife/ajaxPubCalls.php'});
       
    }

    ngOnInit() {
         if(this.formName=="birth"){
            this.date=new Date(this.fields[0].value);
        }
   
        this.form = this.dfs.toFormGroup(this.fields);
          
    }
    
    genPassword(){
       let pass=Math.random().toString(36).replace(/[^a-zA-Z1-9]+/g, '').substr(1, 10);; 
       for(let i=0;i<this.fields.length;i++){
          if(this.fields[i].key=='password'){
            this.fields[i].attr.value=pass;
           this.fields[i].value=pass;
          }
          
       }
       
       
    }

    onSubmit(form,$e) {
        if (this.form.status == 'VALID') {
            try {
                /*if(this.formName=="birth" || this.formName=="gender"){
                 
                    this.fields[0].value=this.date;
                    this.fields[0].attr.value=this.date;
                    form.value.birth_date=this.date;
                }*/
                this.submitForm.next({ value: this.form.value, name: this.formName, id: this.formID });
                this.formSubmit.emit({ value: this.form.value, name: this.formName, id: this.formID,e:$e });
            } catch (err) {
                console.log(err);
            }
        }

        //this.payLoad = JSON.stringify(this.form.value);
    }
 
}

export class AdForm {
    constructor(public component: Type<any>) {

    }
}

