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
import { FormFieldBase } from '../dynamicform/formmodels';
//A simple service transforming model into FormGroup
import { DynamicFormService } from '../dynamicform/form.service';

@Component({
    selector: 'dynamic-search-form',
    templateUrl: './form.component.html',
    styleUrls: [],
      encapsulation: ViewEncapsulation.None,
    providers: [DynamicFormService]
})
export class DynamicSearchFormComponent implements OnInit {
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
         
    }

    ngOnInit() {

   
        this.form = this.dfs.toFormGroup(this.fields);
          
    }
    
    addControl(newField:any){
        let newControl=this.dfs.createNewControl(newField);
        this.form.addControl(newField.key,newControl);
    }

    onSubmit(form,$e) {
        if (this.form.status == 'VALID') {
            try {
                this.submitForm.next({ value: this.form.value, name: this.formName, id: this.formID });
                this.formSubmit.emit({ value: this.form.value, name: this.formName, id: this.formID,e:$e });
            } catch (err) {
                console.log(err);
            }
        }

       
    }
 
}

export class AdForm {
    constructor(public component: Type<any>) {
    }
}

