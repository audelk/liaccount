import { Injectable } from '@angular/core';

@Injectable()
export class LanguageService {
  default='en';
  constructor() { }

  trans(text){
    return text;
  }
}
