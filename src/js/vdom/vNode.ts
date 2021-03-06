import EventHandler from "@/js/event/eventHandler";
import Model from "@/js/model/model";
import commonUtil from "@/js/utils/commonUtil";
import Component from "@/js/components/component";

export default class VNode{
    id: number;
    tagName: string;
    attributes: any;
    children: Array<VNode> = [];
    parent: VNode;
    templateIndex: number;
    dom: HTMLElement | Text | Comment | Array<HTMLElement | Text | Comment>;
    events: Array<EventHandler> = [];
    component : Component;
    model : Model;
    ifSentence: string;
    showSentence: string;
    forItem: string;
    forCollection: string;

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
        if (attr.component)
        {
            this.component = attr.component
        }
        if (attr.model)
        {
            this.model = attr.model;
        }
    }

    setDomVal(val : any){
        if (this.dom)
        {
            if ((<HTMLInputElement>this.dom).type === 'checkbox'
                || (<HTMLInputElement>this.dom).type === 'radio')
            {
                if (val)
                {
                    $(this.dom).prop('checked', true);
                }
                else
                {
                    $(this.dom).prop('checked', false);
                }
            }
            else
            {
                $(this.dom).val(val);
            }
        }
    }

    /** 创建双向绑定 */
    create2WayBind(modelKey : string, type : string){
        switch (type)
        {
            case 'lb-model' :
                //model to dom
                this.model.createModel(modelKey);//如果有为空的属性，则自动创建
                this.component.createWatcher(this, modelKey, (newVal)=>{
                    this.setDomVal(newVal);
                });
                //dom to model
                if (this.dom)
                {
                    if ((<Element>this.dom).tagName === 'INPUT')//input
                    {
                        if ((<HTMLInputElement>this.dom).type === 'text')
                        {
                            commonUtil.addDomEventListener(this.dom, 'input', (e)=>{
                                this.model.setModel(modelKey, (<HTMLInputElement>this.dom).value);
                            }, false);
                        }
                        else if ((<HTMLInputElement>this.dom).type === 'checkbox'
                            || (<HTMLInputElement>this.dom).type === 'radio')
                        {
                            commonUtil.addDomEventListener(this.dom, 'change', (e)=>{
                                this.model.setModel(modelKey, (<HTMLInputElement>this.dom).checked);
                            }, false);
                        }
                    }
                    else if ((<Element>this.dom).tagName === 'SELECT')//input
                    {
                        commonUtil.addDomEventListener(this.dom, 'change', (e)=>{
                            this.model.setModel(modelKey, (<HTMLInputElement>this.dom).value);
                        }, false);
                    }
                }
                break;
            default : break;
        }
    }
}