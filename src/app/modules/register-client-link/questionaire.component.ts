import { Component, OnInit, ViewEncapsulation, EventEmitter, Output,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
@Component({
  selector: 'app-questionaire',
  templateUrl: './questionaire.component.html',
  styles: [], encapsulation: ViewEncapsulation.None
})
export class QuestionaireComponent implements OnInit {
  public questions = [];
  public res = new Response();
  @Output() formSubmit: EventEmitter<any>;
  @Input() answers : any;
  isLinear = true; isEditable = true;
  public formGroup: any;
  constructor(
    public userSvc: UserService,
    private _formBuilder: FormBuilder
  ) {
     this.questions = [];
     this.loadQuestions();
    
    this.formSubmit = new EventEmitter<any>();
  }

  ngOnInit() {
    
   
  }

  loadQuestions() {
    let that = this;

    that.userSvc.appiCall(UserService.actions["QuestionList"], {}, 'public').subscribe(res => {

      if (res.status) {
        this.createFormFields(res.data.records);

      }
    });
  }

  createFormFields(qs) {
   
    qs = qs.sort((a, b) => a.order - b.order);
    for (var i = 0; i < qs.length; i++) {
      var obj = {};
      let value= this.answers['Q' + qs[i].order] || "";
      if (qs[i].required == 1) {

        obj['Q' + qs[i].order] = [value, Validators.required];
        var temp = this._formBuilder.group(obj);
      }
      else {
        obj['Q' + qs[i].order] = [value, Validators.required];
        var temp = this._formBuilder.group(obj);
      }
      this.questions.push({
        formGroup: temp,
        question: qs[i].question,
        ctrlName: "Q" + qs[i].order
      });
    }
  }

  onSubmit() {
    let values = {};
    this.questions.forEach(item => {
      values = Object.assign(values, item.formGroup.value);
    })
    this.formSubmit.emit(values);
  }

}
