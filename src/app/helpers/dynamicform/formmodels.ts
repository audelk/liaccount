/**
  * Form field models
  * Object model that has properties that are needed by the form functionality
  * @author Audel B. Kabristante
  * @copyright 2017 - Audel B. Kabristante
  * @copyright 2017 - www.site2apps.com
*/

// Base class

export class FormFieldBase<T>{
    value: T;
    key: string;
    validators: Array<any>;
    attr: any;
    order: number;
    controlType: string;
    
    
    constructor(options: {
        value?: T,
        key?: string,
        validators?: Array<any>,
        attr?: any,
        order?: number,
        controlType?: string,
    } = {}) {

        this.value = options.value ;
        this.key = options.key || '';
        this.validators = options.validators || [];
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.attr = options.attr || {};

    } 
}

//Select class
export class DropdownField extends FormFieldBase<string> {
    controlType = 'dropdown';
    values = [];
    //we will use this on ngFor so we can irriterate and access key:value
    keys = [];  
    constructor(options: {} = {}) {        
        super(options);
        this.keys = Object.keys(this.attr.values);
    }
}
//Radio class
export class RadioField extends FormFieldBase<string> {
    controlType = 'radio';
    values = [];
    keys = [];
    constructor(options: {} = {}) {
        super(options);
        this.keys = Object.keys(this.attr.values);
    }
}
export class ToggleField extends FormFieldBase<string> {
    controlType = 'toggler';
   
    constructor(options: {} = {}) {
        super(options);
        
    }
}
export class CheckboxField extends FormFieldBase<string> {
    controlType = 'checkbox';
   
    constructor(options: {} = {}) {
        super(options);
        
    }
}
//Text Class
export class TextboxField extends FormFieldBase<string> {
    controlType = 'textbox';
    constructor(options: {} = {}) {       
        super(options);       
    }
}
export class TextAreaField extends FormFieldBase<string> {
    controlType = 'textarea';
    constructor(options: {} = {}) {
        super(options);
    }
}
//Text Class
export class FileField extends FormFieldBase<string> {
    controlType = 'file';
    constructor(options: {} = {}) {
        super(options);
    }
}
//Text Class
export class DateField extends FormFieldBase<string> {
    controlType = 'date';
    constructor(options: {} = {}) {
        super(options);
    }
}