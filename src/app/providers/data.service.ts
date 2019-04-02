import { Injectable } from '@angular/core';
import { JwtHelper } from "angular2-jwt";
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { PersistenceService,StorageType } from 'angular-persistence';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
//Server response format
export interface ServerResponse {
  // if api operations success or not
  status: boolean,
    extra:any,
  //if status false, error messages
  errors: Array<any>,
  //if status , success messages
  successes: Array<any>,
  //actual data returned
  data: any
}

export class Response implements ServerResponse {
  status = false;
  errors = [];
  extra:any='';
  successes = [];
  data:any = {}
}

export class TokenDataResponse {

}


@Injectable()
export class DataService {
 private _ajaxUrl = 'https://appv2.mylinkedsolution.com/backend/ajaxCustomerCalls.php';
 private _website = "https://appv2.mylinkedsolution.com/backend";

 //private _ajaxUrl = 'http://127.0.0.1:81/ajaxPubCalls.php';
 //private _website = "http://127.0.0.1:81/";
 public paymentUrl =this._website + "/payment.php";
  //object to handle JWT functionalities
  jwtHelper: any;

  //default storage token key
  storeName = 'token';

  // cache tokens storage for faster retrieval
  private _cacheStore = {};

  //restrict mobile number registration
  allowPhoneReg = true;

  storage: PersistenceService;
  //flag if storage is ready
  storageReady: boolean = false;

  //Configure actions to match function on server.
  //embed this on form.value . e.g=form.value.action
  //so this will be pass as 'action' param in http get/post in which 
  //you can check to match for your functions in your server
  static actions = {
    UpdateRecord: 'UpdateRecord',
    AddRecord: 'AddRecord',
    DeleteRecord: 'DeleteRecord',
    GetList: 'GetList',
    UploadFile: 'UploadFile'
  };


   
  constructor(
    store: PersistenceService,
    public router:Router,
    private http: HttpClient,
    public snack :MatSnackBar
 
  ) {
    this.storage = store;

    this.jwtHelper = new JwtHelper();
    this.storeName = 'token';
    
  }

  /**
   * Decode jwt , return true if decoding is successful,false otherwise(expired or invalid token).
   * @param token JWT to decode
   * @return res  decoded data or false 
   */
  decodeToken(token: string) {
    let res: any;
    if (this.jwtHelper.isTokenExpired(token))
      res = false;
    else
      res = this.jwtHelper.decodeToken(token);
    return res;
  }

  getTokenExpirationDate(token: string){
     return this.jwtHelper.getTokenExpirationDate(token);
  }
  /**
  * REST call error callback
  * @param err
  * @param suppress erros to show in toast or not
  */
  handleError(err, noToast?: boolean) {

    let text = !err.message ? err.text() : err.message;
    let res = new Response();
    res.errors.push(text);
    return res;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleHttpError<Response>(operation = 'operation') {
    return (error: any): Observable<ServerResponse> => {
      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead
      let text = '';
      if (error.status == 200)
        text = error.error.text;
      else if (error.status == 0)
        text = error.message;
      this.showMessages([text])
      // Let the app keep running by returning an empty result.
      let res = new Response();
      res.errors.push(text);
      return of(res);
    };
  }

  /**
   * Performs server calls with JWT auth. 
   * @param url - server url
   * @param body - request body
   * @param token - JWT token
   */
  httpPost(url: string, body: any, token?: string) {
    let that = this;
    let headers;
    if (token !== undefined) {
       headers= new HttpHeaders({ 'Authorization':"Bearer " + token })
    }
    return that.http
      .post<ServerResponse>(url, JSON.stringify(body), {
        headers: headers,
      }).pipe(
      tap(res => { }),
      catchError(this.handleHttpError('getHeroes'))
      );
  }
  httpPostEXT(url: string, body: any) {
    let that = this;
    let headers;

    that.http
      .post<ServerResponse>(url, JSON.stringify(body), {
        headers: headers,
      });
  }
  /**
   * Remove token from local storage and cache 
   * @return boolean - false or true
   */
  sessionDestroy(store) {
    let that = this;
    try {
      that._cacheStore[store] = undefined;
      that.storage.remove(store,StorageType.LOCAL);
      return true;
    }
    catch (err) {
      console.log(err);
      return false;
    }

  }

  /**
   * Retrieve JWT from storage. Perform jwt validation (if expired of invalid form)
   * @param storeName - storage key    
   */
  sessionGet(storeName: string) {
    let that = this;
    let token = that._cacheStore[storeName];
    let res = new Response();
    if (token!=undefined) {
      let temp = that.decodeToken(token);
      res.data = { token: token, decodedTokenData: temp.data };
      res.status = true;
      return res;
    }
    else {
      let token = that.storage.get(storeName, StorageType.LOCAL);
  
      if (token == undefined)
        return this.handleError({ status: false, message: 'Session timeout' }, true);
      else {
        // check if valid
        let temp = that.decodeToken(token);
        if (!temp) {
          return this.handleError({ status: false, message: 'Token decoding error' });
        }
        else {
          res.data = { token: token, decodedTokenData: temp.data };
          res.status = true;
          return res;
        }
      }
    }
  }
  
  storeSave(data,storeName){
    this.storage.set(storeName, data,{type: StorageType.LOCAL});
  }
  storeGet(storeName){
    return this.storage.get(storeName, StorageType.LOCAL);
  }
  /**
    * Save user JWT to storage. Check JWT if valid and save to storage, otherwise no
    * @param data - JWT
    * @param storeName - storage identifier
    * @return Promise - resolve decoded token
  */

  sessionSave(data: any, storeName: string) {
    let that = this;
    let temp = that.decodeToken(data);
    let ret: any = undefined;
    if (!temp) {
      this.handleError({ message: 'Invalid/Expired token' });
    }
    else {
      that.storage.set(storeName, data,{type: StorageType.LOCAL});
      that._cacheStore[storeName] = data;
      ret = temp.data;
    }
    return ret;
  }

  /**
   * Show all successes or errors messages
   * @param msgs
   */
  showMessages(msgs: any) {
    for (var i = 0; i < msgs.length; i++)
      this.showMsgWin(msgs[i]);
  }

  /**
   * Pop up toast with message
   * @param msg
   */
  showMsgWin(msg: any, type: string = 'error') {
    let text = msg;
  
  }

  /**
   Submit form to server. If JWT is expected be sure to set storeName
   @param form fields or json data to submit
   @param storeName  key for JWT in saving to storage/cache
 */
  submit(form, storeName?: string) {
    if (storeName == undefined)
      return this.httpPost(this._ajaxUrl, form);
    else
      return this.submitGetJWT(form, storeName);
  }

  submitJWT(form, storeName: string): Observable<Response> {
    let that = this;
    storeName = storeName || this.storeName;
    // Retrieve token
    let session = that.sessionGet(storeName);
    if(session.status===true){
      
      return this.httpPost(this._ajaxUrl, form,session.data.token).pipe(
      tap(res => { 
          if(res.status==false && res.errors[0]=='session_killed'){
              this.sessionDestroy(storeName);
              this.showSnak(res);
              this.router.navigateByUrl('/login');
          }
          
      }))
    }
    else
      return of(session);
    //Do ajax call to server
    
  }

  /**
     Submit form to server. Use this if your expecting JWT in return data 
     @param form fields or json data to submit
     @param storeName  key for JWT in saving to storage/cache   
   */
  submitGetJWT(form, storeName: string): Observable<Response> {
    let that = this;
    storeName = storeName || that.storeName;
    //Do ajax call to server
    let res = of(new Response());
    return Observable.create((observer => {
      that.httpPost(that._ajaxUrl, form)
        .subscribe(obj => {
          if (obj.status) {
            //Save token to store
            let decodedTokenData = that.sessionSave(obj.data, storeName);
            if (decodedTokenData == null) {
              obj.status = false;
              obj.errors.push('Session timeout');
            }
            else {
              //replace jwt with decoded data
              obj.data = decodedTokenData;
            }
          }
          observer.next(obj);

        }
        );
      return new Response();
    }));

  }
  /**
    *  File transfer functions
    */
  get url(){
    return this._ajaxUrl;
  }
  get website(){
    return this._website;
  }
  showSnak(res){
    let that=this;
    if(res.status){
        
        if(res.successes.length>0)
           this.snack.open(res.successes[0], 'OK', { verticalPosition:'top', duration: 40000 });
           
        }
        else{
          if(res.errors.length>0)
          this.snack.open(res.errors[0], 'OK', {  verticalPosition:'top',duration: 4000 });
          
        }
  }
}
