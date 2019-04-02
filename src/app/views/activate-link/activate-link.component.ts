import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import {Response } from '../../providers/data.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-activate-link',
  templateUrl: './activate-link.component.html',
  styles: []
})
export class ActivateLinkComponent implements OnInit {
  public data = new Response();
  constructor(
     public userSvc:UserService,
    private route:ActivatedRoute,
    public lang:LanguageService
  ) { }

  ngOnInit() {
   
     const id=this.route.snapshot.paramMap.get('id');
     const at=this.route.snapshot.paramMap.get('at');
     this.userSvc.activateLink(id,at).subscribe(data=>{
         this.data=data;
     })
  }

}
