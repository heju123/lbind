import EventHandler from "@/js/event/eventHandler";
import Model from "@/js/model/model";
import commonUtil from "@/js/utils/commonUtil";

export default class VNode{
    id: number;
    tagName: string;
    attributes: any;
    children: Array<VNode> = [];
    parent: VNode;
    templateIndex: number;
    dom: HTMLElement | Text;
    events: Array<EventHandler> = [];

    constructor(attr){
        if (attr.id)
        {
            this.id = attr.id;
        }
        if (attr.tagName)
        {
            this.tagName = attr.tagName;
        }
        if (attr.parent)
        {
            this.parent = attr.parent;
        }
        if (attr.templateIndex)
        {
            this.templateIndex = attr.templateIndex
        }
    }

    /** 创建双向绑定 */
    create2WayBind(model : Model, modelKey : string, type : string){
        switch (type)
        {
            case 'lb-model' :
                model.createModel(this, modelKey, (newVal)=>{
                    if (this.dom)
                    {
                        (<HTMLInputElement>this.dom).value = newVal;
                        if ((<Element>this.dom).tagName === 'INPUT' && (<HTMLInputElement>this.dom).type === 'text')
                        {
                            commonUtil.addDomEventListener(this.dom, 'input', (e)=>{
                                console.log('change');
                            }, false);
                        }
                    }
                });
                break;
            default : break;
        }
    }
}