import VNode from "@/js/vdom/vNode";
import TextNode from "@/js/vdom/textNode";
import evalUtil from "@/js/utils/evalUtil";
import Model from "@/js/model/model";

export default class Compiler{
    root : VNode;
    model : Model;

    constructor(root : VNode, model : Model){
        this.root = root;
        this.model = model;
    }

    private generateText(command : string) : string{
        let ret : string = command;
        let reg = new RegExp(/\{\{(.*?)\}\}/, 'g');
        let result;
        let regExp;
        let modelValue;
        while ((result = reg.exec(command)) != null){
            regExp = new RegExp(result[0], 'g');
            modelValue = evalUtil.evalDotSyntax(result[1], this.model.data);
            if (modelValue)
            {
                ret = ret.replace(regExp, modelValue);
            }
        }
        return ret;
    }

    private generateDom(node : VNode) : HTMLElement | Text{
        if (node instanceof TextNode)
        {
            let text = this.generateText(node.text);
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