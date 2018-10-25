import Stack from "@/js/structure/stack";
import VNode from "@/js/vdom/vNode";
import TextNode from "@/js/vdom/textNode";
import Component from "@/js/components/component";

/** template转换成树形结构 */
export default class HtmlParser{
    html : string;
    rootNode : VNode;
    component : Component;

    constructor(html : string, component : Component){
        this.html = html;
        this.html = this.html.replace(/\<\!\-\-(.|\n|\r)*?\-\-\>/g, '');
        this.component = component;
    }

    parseAttr(str : string) : any{
        //idx=1：name；idx=3：value
        let reg = new RegExp(/((\w|\-)+)\=\"((\w|\-|\.|\=|\$|\s|,|;|\'|\(|\)|[\u4e00-\u9fa5])*)\"/, 'g');
        let result;
        let attrs = {};
        while ((result = reg.exec(str)) != null){
            attrs[result[1]] = result[3];
        }
        return attrs;
    }

    /** 根据上一个匹配项的结束位置和下一个匹配项的开始位置获取中间的文本信息 */
    extractText(lastEndIdx : number, matchIdx : number) : string{
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

    /** 抓取中间的文本信息 */
    extractNodeText(parent : VNode, lastEndIdx : number, matchIdx : number){
        let txtContent = this.extractText(lastEndIdx, matchIdx);
        if (txtContent)
        {
            let node = new TextNode({
                templateIndex: lastEndIdx + 1,
                text: txtContent,
                component: this.component
            });
            parent.children.push(node);
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
            if (match[2]) {
                this.extractNodeText(parent, lastEndIdx, match.index);
                vnode = new VNode({
                    tagName: match[2],
                    templateIndex: match.index,
                    component: this.component
                });
                if (match[4]) {
                    vnode.attributes = this.parseAttr(match[4]);
                }
                if (parent) {
                    vnode.parent = parent;
                    parent.children.push(vnode);
                }
                if (!this.rootNode) {
                    this.rootNode = vnode;
                }
                if (vnode.tagName !== 'input')
                {
                    parent = vnode;
                    nodeStack.push(vnode);
                }
            }
            else if (match[8])
            {
                this.extractNodeText(parent, lastEndIdx, match.index);
                if (match[8] !== 'input')
                {
                    let popItem = nodeStack.pop();
                    if (popItem) {
                        parent = popItem.parent;
                    }
                }
            }
            lastEndIdx = match.index + match[0].length - 1;
        });
        return this.rootNode;
    }
}