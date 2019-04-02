import { Component, OnInit,ViewChild } from '@angular/core';
import {UserService} from '../../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(public userSvc:UserService) { }

  ngOnInit() {
  }

}
