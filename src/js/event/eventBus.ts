import Event from "./event";
import VNode from "@/js/vdom/vNode";
import commonUtil from "@/js/utils/commonUtil";
import EventHandler from "./eventHandler";
import Component from "@/js/components/component";

export default class EventBus{
    private component : Component;
    private el : HTMLElement;
    private vNode : VNode;

    constructor(component : Component, el : HTMLElement, vNode : VNode){
        this.component = component;
        this.vNode = vNode;
        this.el = el;
    }

    /** 触发事件 */
    triggerEvent(node : VNode, eventHandler : EventHandler, sourceEvent : any){
        let event = new Event(eventHandler.type);
        event.node = node;
        event.sourceEvent = sourceEvent;
        eventHandler.callback.apply(this.component, [event]);
    }
    executeEvent(node : VNode, type : string, sourceEvent : any){
        if (node.events.length > 0)
        {
            node.events.forEach((event)=>{
                if (sourceEvent.srcElement !== node.dom)
                {
                    return;
                }
                if (event.type === type)
                {
                    this.triggerEvent(node, event, sourceEvent);
                }
            });
        }
    }
    handleEvent(type : string, sourceEvent : any){
        commonUtil.recursiveVNode(this.vNode, (node)=>{
            this.executeEvent(node, type, sourceEvent);
        });
    }
    enableEvents(){
        commonUtil.addDomEventListener(this.el, 'click', (e)=>{
            this.handleEvent('click', e);
        });
    }
}