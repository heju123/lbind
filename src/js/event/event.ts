import VNode from "@/js/vdom/vNode";

export default class Event{
    type : string;
    node : VNode;
    sourceEvent : any;

    constructor(type : string){
        this.type = type;
    }
}