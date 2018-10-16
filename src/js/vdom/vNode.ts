export default class VNode{
    id: number;
    tagName: string;
    attributes: any;
    children: Array<VNode> = [];
    parent: VNode;
    templateIndex: number;
    dom: HTMLElement;

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

    generateDom() : HTMLElement{
        this.dom = $('<' + this.tagName + '></' + this.tagName + '>')[0];
        if (this.children && this.children.length > 0)
        {
            let childDom : HTMLElement;
            this.children.forEach((child)=>{
                childDom = child.generateDom();
                this.dom.appendChild(childDom);
            });
        }
        return this.dom;
    }
}