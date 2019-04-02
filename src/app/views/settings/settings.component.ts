import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Response, DataService } from '../../providers/data.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: []
})
export class SettingsComponent implements OnInit {
  data = new Response();
  moduleData:any;
  progressMode = 'indeterminate';
  loaded = false;
  columnsToDisplay = ['date','key','version'];
  constructor(
    public userSvc:UserService
  ) { }

  ngOnInit() {
    this.loadModules();
  }

  loadModules() {
    let that = this;
    this.loaded=false;
    /*that.userSvc.getMembers().subscribe(res => {
      that.data = res;
      that.moduleData = res.data;

   
      that.loaded = true;
     
    });*/
    
  }

}
