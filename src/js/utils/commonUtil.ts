import VNode from "@/js/vdom/vNode";

let commonUtil : any = {
    addDomEventListener: (dom : any, type : string, callback : Function) => {
        if (window.addEventListener)
        {
            dom.addEventListener(type, callback, false);
        }
        else
        {
            dom.attachEvent("on" + type, callback);
        }
    },
    /** 递归遍历树 */
    recursiveVNode: (parent : VNode, callback : Function) => {
        if (parent)
        {
            callback.apply(this, [parent]);
            if (parent.children && parent.children.length > 0)
            {
                parent.children.forEach((item)=>{
                    commonUtil.recursiveVNode(item, callback);
                });
            }
        }
    }
};
export default commonUtil;