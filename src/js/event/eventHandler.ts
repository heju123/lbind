export default class EventHandler{
    type : string;
    callback : Function;
    events : Object = {};

    constructor(type : string){
        this.type = type;
    }
}