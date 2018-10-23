export default class VNode{
    id: number;
    tagName: string;
    attributes: any;
    children: Array<any> = [];
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

        for (let key in this.attributes)
        {
            this.dom.setAttribute(key, this.attributes[key]);
        }

        if (this.children && this.children.length > 0)
        {
            let childDom : HTMLElement;
            this.children.forEach((child)=>{
                if (child instanceof VNode)
                {
                    childDom = child.generateDom();
                    this.dom.appendChild(childDom);
                }
                else if (typeof(child) === 'string')
                {
                    let txtNode = document.createTextNode(child);
                    this.dom.appendChild(txtNode);
                }
            });
        }
        return this.dom;
    }
}