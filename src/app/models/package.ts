export class Package {
    id=0;
    private model:any;
    data:any;
    keys:Array<string>=[];
    constructor(params:any={
            model:{},data:{}
        }){
        //real clone with out reference to original object    
        this.model = JSON.parse(JSON.stringify(params.model));  
        this.data = JSON.parse(JSON.stringify(params.data));   
      
        this.keys=Object.keys(this.model);
        this.mapDataToModel();
    }
    mapDataToModel(){
        let that=this;
        that.keys.forEach(key=>{
            that.model[key].value=this.data[key];
            that.model[key].attr.value=this.data[key];
        })
        that.id=that.data['id'];
    }
}