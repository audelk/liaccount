/**
  * User models
  * Object model that has properties that are needed by the user functionality
  * @copyright 2017
*/
import { DropdownField, RadioField, TextboxField, FileField } from '../helpers/dynamicform/formmodels';

// User base class
export abstract class UserBase {
    static readonly actions;
    agreedTOS=false;
    accountDetails: any;
    verified:number;
    tried:number;
    notifications: Array<any> = [];
    documents: any;
    fundsData: any;
    fundsTotal = 0;
    withdrawal: any = {
        records: [],
        total: 0, pending: 0, pendingCtr: 0
    };
    deposit: any = {
        records: [],
        total: 0, pending: 0
    };
    investment:any={
        
    };
    profileDetails: any = {
        profile_pic:{
            attr:{

            }
        }
    };
    subcription:any={

    };
    wallet:any;
    educationDetails: any;
    //is account requirements complete
    accountComplete: any;
    //completion progress with what requirement is meet or no
    accountCompletion: any;
    loginType: any = '';
    userActive: any = 0;
    loggedIn = false;
    user_id: any = 0;
    package:any=undefined;
    avatar: string = "";
    request: {

    };

    constructor(opts: {
        loginType: 'none',
        user_id: 0,
        loggedIn: false,
        userActive: '0'
    }) {

        let that = this;
        that.loginType = opts.loginType;
        that.user_id = opts.user_id;
        that.loggedIn = opts.loggedIn;
        that.userActive = opts.userActive;
        that.request = {

        };
    }

    logout() {
        let that = this;
        that.loggedIn = false;
        that.accountDetails = undefined;
        that.loggedIn = false;
        that.loginType = 'none';
        that.userActive = '0';
    }
    setAccount(res) {
        let that = this;
        // res.data.profModel.birth_date.value=new Date(res.data.profModel.birth_date.value);
        //  res.data.profModel.birth_date.attr.value=new Date(res.data.profModel.birth_date.attr.value);
        that.verified=res.data.verified;
        that.tried=res.data.tried;
        that.accountDetails = res.data.acctModel;
        that.profileDetails = res.data.profModel;
        that.accountComplete = res.extra.complete;
        that.accountCompletion = res.data.completion;
        that.wallet=res.data.wallet;
        that.subcription=res.data.subscription;
    }
    unsetAccount() {
        let that = this;
      //  that.accountDetails = undefined;
      //  that.profileDetails = undefined;
        that.accountComplete = undefined;
        that.accountCompletion = undefined;
        that.notifications = [];
        that.documents = undefined;
        that.fundsData = undefined;
        that.wallet={};
        that.subcription={};
        that.fundsTotal = 0;
        that.withdrawal = {
            records: [],
            total: 0,
            pending: 0, pendingCtr: 0
        };
        that.deposit = {
            records: [],
            total: 0,
            pending: 0,
        };
        that.investment={};
        that.package=undefined;
    }

    setRequest(data: any, type: string) {

    }

}

/**
 * User student class
 */
export class Investor extends UserBase {
    static readonly actions = {
    }
    constructor(opts) {
        super(opts);
    }
}

/**
 * User donor class
 */
export class Donor extends UserBase {
    static readonly actions = {
    }
    constructor(opts) {
        super(opts);
    }


}

/*************************************************************************/
/*************************************************************************/
/***************************Request classes*******************************/
/*************************************************************************/
class RequestFactory {
    // model to create form field
    protected _model: any = {};
    // keys or field names
    protected _keys: Array<any> = [];
    protected _requests: any = [];
    constructor(private type: string, opts: { keys?: Array<any>, requests?: Array<any>, model: any }) {
        if (opts.keys != undefined)
            this._keys = opts.keys;
        if (opts.model != undefined)
            this._model = opts.model;
        if (opts.requests != undefined)
            this._requests = opts.requests;
    }

    create(opts: any) {
        if (this.type == 'Allowance')
            return new Allowance(opts);
    }

    public getModels() {
        let temp = [];
        for (let i = 0; i < this._requests.length; i++) {
            let copyModel = JSON.parse(JSON.stringify(this._model));
            if (this.type == 'Allowance')
                temp.push(new Allowance({
                    keys: this._keys,
                    request: this._requests[i],
                    model: copyModel
                }));
        }
        return temp;
    }


}


/**
 * Requests base class
 */
export abstract class Request {
    protected _model: any = {};

    /** constructor
     * @param opts
     */
    constructor(opts: { request?: any, model?: any } = {
        request: {}, model: {}
    }) {
        if (opts.model)
            this._model = opts.model;
        this.fillModel(opts.request);
    }

    /**
     * Fill form field model with record values
     * @param model - form field model
     * @param record - request record
     */
    protected fillModel(request) {
        let that = this;
        Object.keys(request).forEach(key => {
            if (that._model[key] !== undefined) {
                that._model[key].attr.value = request[key];
                that._model[key].value = request[key];

            }
            else {
                that._model[key] = {
                    value: request[key],
                    key: key,
                    editable: false
                }
            }

        })
    }

    get model() {
        return this._model;
    }

}

/**
 * Allowance request class
 */
export class Allowance extends Request {
    public icon = "ice-cream";
    constructor(opts?: any) {
        super(opts);
    }
}