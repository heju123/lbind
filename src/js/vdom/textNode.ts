import VNode from "./vNode";

export default class TextNode extends VNode{
    text: string;
    constructor(attr){
        super(attr);
        if (attr.text)
        {
            this.text = attr.text;
        }
    }
}