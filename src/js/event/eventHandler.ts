export default class EventHandler{
    type : string;
    callback : string;
    events : Object = {};

    constructor(type : string){
        this.type = type;
    }
}