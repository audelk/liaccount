import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ElementRef, HostListener, Directive, OnInit } from '@angular/core';

/*  Password repeat custom validator
    How to use :
      1. import class in component
          import { PasswordValidation } from './formhelpers';
      2. add validator to your formbuilder or formgroup validators

        this.form = fb.group({
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
        }, {
          validator: PasswordValidation.MatchPassword // your validation method
       })
      3. set error message
          <div class="alert" *ngIf="form.controls.confirmPassword.errors.MatchPassword">Password not match</div>
  
*/

export class CustomValidation {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            console.log('false');
            AC.get('confirmPassword').setErrors({ MatchPassword: true })
        } else {
            console.log('true');
            return null
        }
    }

    static AlphaNumeric(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            console.log('false');
            AC.get('confirmPassword').setErrors({ MatchPassword: true })
        } else {
            console.log('true');
            return null
        }
    }
    static forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const forbidden = nameRe.test(control.value);
            return forbidden ? { 'forbiddenName': { value: control.value } } : null;
        };
    }
}




export class Autosize implements OnInit {
    @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }

    constructor(public element: ElementRef) {
    }

    ngOnInit(): void {
        setTimeout(() => this.adjust(), 0);
    }

    adjust(): void {
        let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
        textArea.style.overflow = 'hidden';
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + "px";
    }
}