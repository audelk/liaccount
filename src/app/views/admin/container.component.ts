import { Component, OnInit ,ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styles: [],
  encapsulation:ViewEncapsulation.None
})
export class ContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
