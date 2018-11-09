import VNode from "@/js/vdom/vNode";
import TextNode from "@/js/vdom/textNode";
import evalUtil from "@/js/utils/evalUtil";
import Model from "@/js/model/model";
import EventHandler from "@/js/event/eventHandler";
import Component from "@/js/components/component";
import commonUtil from "@/js/utils/commonUtil";

/** 树形结构转换成dom元素 */
export default class Compiler{
    root : VNode;
    component : Component;

    constructor(root : VNode, component : Component){
        this.root = root;
        this.component = component;
    }

    /** 向text查询model符号，并绑定 */
    private bindTextWithModel(node : VNode, text : string) : string{
        let ret : string = text.replace(/\{\{(.*?)\}\}/g, (outer, content) => {
            this.component.createWatcher(node, content, (newVal)=>{
                this.regenerateNode(node);
            });
            return node.model.getModelData(content) || outer;
        });
        return ret;
    }

    private generateText(node : TextNode) : string{
        return this.bindTextWithModel(node, node.text);
    }

    private createEventHandler(node : VNode, type : string, funStr : Function | string){
        let handler = new EventHandler(type);
        if (typeof(funStr) === 'string')
        {
            handler.callback = funStr;
        }
        node.events.push(handler);
    }

    private disposeAttr(node : VNode, attrName : string, attrVal : string | Function){
        if (attrName === 'lb-click')
        {
            this.createEventHandler(node, 'click', attrVal);
        }
        else if (attrName === 'lb-model')
        {
            node.create2WayBind(<string>attrVal, attrName);
            if (attrVal !== undefined)
            {
                node.setDomVal(commonUtil.getValueByDot(node.model.data, attrVal));
            }
        }
    }

    private generateHiddenText(text : string) : Comment{
        let textDom : Comment = document.createComment(text);
        return textDom;
    }

    public generateDom$1(node : VNode) : HTMLElement | Text | Comment{
        if (node.ifSentence !== undefined)//if
        {
            let ifResult = commonUtil.getSentenceResult(this.component, node.ifSentence);
            this.component.addDynamicSentence('if', node, node.ifSentence, ifResult);
            if (ifResult === false || ifResult === undefined)
            {
                let textDom = this.generateHiddenText('lb-if=\"' + node.ifSentence + '\"');
                if (!(node.dom instanceof Array))
                {
                    node.dom = textDom;
                }
                else if (node.dom instanceof Array)
                {
                    node.dom.push(textDom);
                }
                (<any>textDom).vNode = node;
                return textDom;
            }
        }
        if (node instanceof TextNode)
        {
            let text = this.generateText(node);
            let textDom : Text = document.createTextNode(text);
            if (!(node.dom instanceof Array))
            {
                node.dom = textDom;
            }
            else if (node.dom instanceof Array)
            {
                node.dom.push(textDom);
            }
            (<any>textDom).vNode = node;
            return textDom;
        }
        else
        {
            let dom : HTMLElement = document.createElement(node.tagName);
            if (!(node.dom instanceof Array))
            {
                node.dom = dom;
            }
            else if (node.dom instanceof Array)
            {
                node.dom.push(dom);
            }
            (<any>dom).vNode = node;
            if (node.children && node.children.length > 0)
            {
                let childDom : HTMLElement | Text | Comment | Array<HTMLElement | Text | Comment>;
                node.children.forEach((child)=>{
                    childDom = this.generateDom(child);
                    if (childDom)
                    {
                        if (childDom instanceof Array)
                        {
                            childDom.forEach((child)=>{
                                dom.appendChild(child);
                            });
                        }
                        else
                        {
                            dom.appendChild(childDom);
                        }
                    }
                });
            }
            for (let key in node.attributes)
            {
                dom.setAttribute(key, node.attributes[key] === undefined ? '' : this.bindTextWithModel(node, node.attributes[key]));
                this.disposeAttr(node, key, node.attributes[key]);
            }
            if (node.showSentence !== undefined)//show
            {
                let showResult = commonUtil.getSentenceResult(this.component, node.showSentence);
                this.component.addDynamicSentence('show', node, node.showSentence, showResult);
                if (showResult === false || showResult === undefined)
                {
                    dom.style.display = 'none';
                }
            }
            return dom;
        }
    }

    public generateDom(node : VNode) : HTMLElement | Text | Comment | Array<HTMLElement | Text | Comment>{
        if (node.forCollection && node.forItem)
        {
            // node.dom = [];
            // let collection = commonUtil.getValueByDot(node.model.data, node.forCollection);
            // let newModel;
            // collection.forEach((item)=>{
            //     newModel = Object.create(node.model);
            //     newModel.data = Object.create(node.model.data);
            //     newModel.data[node.forItem] = item;
            //     console.log(newModel);
            // });
        }
        else
        {
            return this.generateDom$1(node);
        }
    }

    /**
     * 重新生成节点
     */
    public regenerateNode(node : VNode){
        this.component.cleanNode(node);
        let oriDom = node.dom;
        let newDom = this.generateDom(node);
        if (newDom instanceof Array)
        {
            newDom.forEach((ndom)=>{
                (<any>node.parent.dom).insertBefore(ndom, oriDom[0]);
            });
            (<Array<HTMLElement | Text | Comment>>oriDom).forEach((odom)=>{
                (<any>node.parent.dom).removeChild(odom);
            });
        }
        else
        {
            (<any>node.parent.dom).insertBefore(<HTMLElement | Text | Comment>newDom, <HTMLElement | Text | Comment>oriDom);
            (<any>node.parent.dom).removeChild(<HTMLElement | Text | Comment>oriDom);
        }
    }

    compile() : HTMLElement | Text | Comment{
        let dom : HTMLElement | Text | Comment = <HTMLElement | Text | Comment>this.generateDom(this.root);
        return dom;
    }
}