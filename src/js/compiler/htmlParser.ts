import Stack from "@/js/structure/stack";
import VNode from "@/js/vdom/vNode";

export default class HtmlParser{
    html : string;
    rootNode : VNode;

    constructor(html : string){
        this.html = html;
        this.html = this.html.replace(/\<\!\-\-(.|\n|\r)*?\-\-\>/g, '');
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

    /** 根据上一个匹配项的结束位置和下一个匹配项的开始位置获取中间的文本信息 */
    parseText(lastEndIdx : number, matchIdx : number) : string{
        if (matchIdx - lastEndIdx > 1)
        {
            let cutTxt = this.html.substring(lastEndIdx + 1, matchIdx);
            if (cutTxt)
            {
                cutTxt = cutTxt.replace(/^(\s|\r|\n)*|(\s|\r|\n)*$/g, '');
            }
            return cutTxt;
        }
        return undefined;
    }

    parseNodeText(parent : VNode, lastEndIdx : number, matchIdx : number){
        let txtContent = this.parseText(lastEndIdx, matchIdx);
        if (txtContent)
        {
            parent.children.push(txtContent);
        }
    }

    parse() : VNode{
        //idx=2：tagName；idx=4：attributes；idx=8：tagEnd
        var reg = new RegExp(/(\<((\w|\-)+)(((\s|\r|\n)+(\w|\-)+\=\".*\")*?)\>)|(\<\/((\w|\-)+)\>)/, 'g');
        let result;
        let all = [];
        while ((result = reg.exec(this.html)) != null){
            all.push(result);
        }
        let nodeStack : Stack = new Stack();
        let parent : VNode;
        let vnode : VNode;
        let lastEndIdx : number = 0;
        all.forEach((match)=>{
            if (match[2])
            {
                this.parseNodeText(parent, lastEndIdx, match.index);
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
            else if (match[8])
            {
                this.parseNodeText(parent, lastEndIdx, match.index);
                let popItem = nodeStack.pop();
                if (popItem)
                {
                    parent = popItem.parent;
                }
            }
            lastEndIdx = match.index + match[0].length - 1;
        });
        return this.rootNode;
    }
}