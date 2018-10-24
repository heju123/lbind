import VNode from "@/js/vdom/vNode";
import TextNode from "@/js/vdom/textNode";
import evalUtil from "@/js/utils/evalUtil";
import Model from "@/js/model/model";
import EventHandler from "@/js/event/eventHandler";

/** 树形结构转换成dom元素 */
export default class Compiler{
    root : VNode;
    model : Model;

    constructor(root : VNode, model : Model){
        this.root = root;
        this.model = model;
    }

    private generateText(node : TextNode) : string{
        let ret : string = node.text;
        let reg = new RegExp(/\{\{(.*?)\}\}/, 'g');
        let result;
        let regExp;
        let modelValue;
        while ((result = reg.exec(node.text)) != null){
            this.model.createModel(node, result[1]);
            regExp = new RegExp(result[0], 'g');
            modelValue = evalUtil.evalDotSyntax(result[1], this.model.data);
            if (modelValue)
            {
                ret = ret.replace(regExp, modelValue);
            }
        }
        return ret;
    }

    private createEventHandler(node : VNode, type : string, funStr : Function | string){
        let handler = new EventHandler(type);
        if (typeof(funStr) === 'string')
        {
            let func = new Function(undefined, funStr);
            handler.callback = func;
        }
        else
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
    }

    private generateDom(node : VNode) : HTMLElement | Text{
        if (node instanceof TextNode)
        {
            let text = this.generateText(node);
            let textDom : Text = document.createTextNode(text);
            node.dom = textDom;
            return textDom;
        }
        else
        {
            let dom : HTMLElement = document.createElement(node.tagName);
            for (let key in node.attributes)
            {
                dom.setAttribute(key, node.attributes[key]);
                this.disposeAttr(node, key, node.attributes[key]);
            }
            if (node.children && node.children.length > 0)
            {
                let childDom : HTMLElement | Text;
                node.children.forEach((child)=>{
                    childDom = this.generateDom(child);
                    dom.appendChild(childDom);
                });
            }
            node.dom = dom;
            return dom;
        }
    }

    compile() : HTMLElement | Text{
        let dom = this.generateDom(this.root);
        return dom;
    }
}