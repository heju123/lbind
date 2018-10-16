import Stack from "@/js/structure/stack";
import VNode from "@/js/vdom/vNode";

export default class HtmlParser{
    html : string;
    rootNode : VNode;

    constructor(html : string){
        this.html = html;
    }

    parseAttr(str : string) : any{
        let reg = new RegExp(/(?<name>(\w|\-)+)\=\"(?<value>(\w|\-|\.|\=|\$|\s|,|\'|\(|\))*)\"/, 'g');
        let result;
        let attrs = {};
        while ((result = reg.exec(str)) != null){
            attrs[result.groups.name] = result.groups.value;
        }
        return attrs;
    }

    parse() : VNode{
        let reg = new RegExp(/(\<(?<tagName>(\w|\-)+)(?<attributes>(.|\n|\r)*?)\>)|(\<\/(?<tagEnd>(\w|\-)+)\>)/, 'g');
        let result;
        let all = [];
        while ((result = reg.exec(this.html)) != null){
            all.push(result);
        }
        let nodeStack : Stack = new Stack();
        let parent : VNode;
        let vnode : VNode;
        all.forEach((match)=>{
            if (match.groups.tagName)
            {
                vnode = new VNode({
                    tagName: match.groups.tagName,
                    templateIndex: match.index
                });
                if (parent)
                {
                    vnode.parent = parent;
                    parent.children.push(vnode);
                }
                if (!this.rootNode)
                {
                    this.rootNode = vnode;
                }
                if (match.groups.attributes)
                {
                    vnode.attributes = this.parseAttr(match.groups.attributes);
                }
                parent = vnode;
                nodeStack.push(vnode);
            }
            else if (match.groups.tagEnd)
            {
                let popItem = nodeStack.pop();
                parent = popItem.parent;
                // console.log("aaaaaaaaaaaaaaaaa",this.html.substring(popItem.templateIndex, match.index + match.groups.tagEnd.length + 3));
            }
        });
        return this.rootNode;
    }
}