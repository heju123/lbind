import Stack from "@/js/structure/stack";
import VNode from "@/js/vdom/vNode";

export default class HtmlParser{
    html : string;
    rootNode : VNode;

    constructor(html : string){
        this.html = html;
    }

    parseAttr(str : string) : any{
        //idx=1：name；idx=3：value
        let reg = new RegExp(/((\w|\-)+)\=\"((\w|\-|\.|\=|\$|\s|,|\'|\(|\))*)\"/, 'g');
        let result;
        let attrs = {};
        while ((result = reg.exec(str)) != null){
            attrs[result[1]] = result[3];
        }
        return attrs;
    }

    parse() : VNode{
        //idx=2：tagName；idx=4：attributes；idx=7：tagEnd
        var reg = new RegExp(/(\<((\w|\-)+)((.|\n|\r)*?)\>)|(\<\/((\w|\-)+)\>)/, 'g');
        let result;
        let all = [];
        while ((result = reg.exec(this.html)) != null){
            all.push(result);
        }
        let nodeStack : Stack = new Stack();
        let parent : VNode;
        let vnode : VNode;
        all.forEach((match)=>{
            if (match[2])
            {
                vnode = new VNode({
                    tagName: match[2],
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
                if (match[4])
                {
                    vnode.attributes = this.parseAttr(match[4]);
                }
                parent = vnode;
                nodeStack.push(vnode);
            }
            else if (match[7])
            {
                let popItem = nodeStack.pop();
                parent = popItem.parent;
                // console.log("aaaaaaaaaaaaaaaaa",this.html.substring(popItem.templateIndex, match.index + match[7].length + 3));
            }
        });
        return this.rootNode;
    }
}