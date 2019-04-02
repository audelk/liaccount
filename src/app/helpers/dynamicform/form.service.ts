/**
  * Dynamic form service
  * Class DynamicForm
  * A simple service transforming model into FormGroup
  * @author Audel B. Kabristante
  * @copyright 2017 - Audel B. Kabristante
  * @copyright 2017 - www.site2apps.com
*/

/**
  Import dependencies.
*/
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Our form field models
import { FormFieldBase } from './formmodels';
import {CustomValidation} from '../formhelpers';

@Injectable()
export class DynamicFormService {

    constructor() {

    }

    /**
     * Convert form field model to FormGroup object
     * @param modelarr
     * @param  validatorFn   group-level custom validator for the FormGroup
     * @param  asyncValidatorFn group-level custom async validator for the FormGroup
     * @return FormGroup  
     */
    toFormGroup(fields: FormFieldBase<any>[], validatorFn?: any | null, asyncValidatorFn?: any | null) {
        let group: any = {};
        let validators =[];
        validatorFn===undefined?'':validators.push(validatorFn); 
    
        fields.forEach(field => {
            let control = new FormControl(field.value === undefined ? '' : field.value, Validators.compose(this.parseValidators(field.validators)));
            group[field.key] = control;
        })
        return new FormGroup(group, {validators:validators});
  
       // return new FormGroup(group, {updateOn:'blur',validators:validators});
    }
    createNewControl(field,validatorFn?: any | null, asyncValidatorFn?: any | null){
         return new FormControl(field.value === undefined ? '' : field.value, Validators.compose(this.parseValidators(field.validators)));
         
    }
    /**
     * Parse array  into arrays of validators
     * @param Array 
     */
    parseValidators(arr) {
        let validators = [];
      
        Object.keys(arr).forEach(key => {
            let value = arr[key];
            if (key == 'required' && value == true)
                validators.push(Validators.required);
            else if (key == 'maxLength')
                validators.push(Validators.maxLength(value));
            else if (key == 'minLength')
                validators.push(Validators.minLength(value));
            else if (key == 'pattern')
                validators.push(Validators.pattern(value));
            else if(key=='email' && value==true)
                validators.push(Validators.email);
            //else if (key=='passwordMatch' &&value==true){
              //  validators.push(CustomValidation.MatchPassword);
            //}
        });

        return validators;
    }
}
