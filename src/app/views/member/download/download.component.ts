import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Response, DataService } from '../../../providers/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppConfirmService2 } from '../../../shared/services/app-confirm2/app-confirm.service';


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  encapsulation : ViewEncapsulation.None
})
export class DownloadComponent implements OnInit {
   public res = new Response();
    public resd = new Response();
    currentSearchID=0;
   type = 'member';
   downloads:any=[];
   constructor(  
     private confirmService: AppConfirmService2,
    public userSvc: UserService,
    private router: Router,
    public snack: MatSnackBar,
    public dataSvc: DataService) { }

  ngOnInit() {
     this.list();
  }
  list() {
    let that = this;
    that.userSvc.appiCall(UserService.actions.UserGetDownloads).subscribe(res => {
      that.res = res;
      that.downloads=res.data.records;


    });
  }

  downloadConfirm(id){
    this.confirmService.confirm({message: "Click OK to download search results. All downloads are final. No credits will be re-issued in the event of user-error (including duplicate records resulting from similar search parameters)." })
      .subscribe(res => {
         if (res == true) {
          let that=this;
          let search= that.downloads.find(item=>item.id==id);
          let searchQuery=search.query;
          searchQuery.id=id;
          searchQuery.start=search.total_downloads+1;
          that.currentSearchID=id;

          this.downloadResults(searchQuery);
        }
      })

  


  }
  downloadResults(searchQuery){
      this.userSvc.appiCall(UserService.actions.UserPerformDownloadSave,searchQuery).subscribe(res => {
        this.userSvc.user.wallet = res.data.wallet;
        this.resd = res;
        this.list();
      })
  }
}
