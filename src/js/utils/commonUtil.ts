import VNode from "@/js/vdom/vNode";

let commonUtil : any = {
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