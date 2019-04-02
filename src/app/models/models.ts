export abstract class FundBase {
    id = 0;
    private model: any;
    data: any;
    keys: Array<string> = [];
    constructor(params) {
        this.model = JSON.parse(JSON.stringify(params.model));
        this.data = JSON.parse(JSON.stringify(params.data));

        this.keys = Object.keys(this.model);
        this.mapDataToModel();
    }
    mapDataToModel() {
        let that = this;
        that.keys.forEach(key => {
            that.model[key].value = this.data[key];
            that.model[key].attr.value = this.data[key];
        })
    }
}

export class Withdrawal extends FundBase {
    
    constructor(opts) {
        super(opts);
        
    }
}
export class Deposit extends FundBase {
    
    constructor(opts) {
        super(opts);
        
    }
}