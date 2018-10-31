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
    recursiveTree: (parent : any, callback : Function) => {
        if (parent)
        {
            callback.apply(this, [parent]);
            if (parent.children && parent.children.length > 0)
            {
                parent.children.forEach((item)=>{
                    commonUtil.recursiveTree(item, callback);
                });
            }
        }
    },
    /** 遍历a.b.c这种格式的值 */
    literateDotKey : (path : string, callback : Function) => {
        let itemsMatch = path.match(/(\w|\$)+/g);
        itemsMatch.forEach((item, index)=>{
            callback(item, index, itemsMatch.length);
        });
    },
    getValueByDot : (inst : any, path : string) : any => {
        let lastDot = path.lastIndexOf('.');
        if (lastDot === -1)
        {
            return inst[path];
        }
        else
        {
            let cutStr = path.substring(0, lastDot);
            let lastKey = path.substring(lastDot + 1, path.length);
            let current : any = inst;
            commonUtil.literateDotKey(cutStr,(item, index, maxLen)=>{
                if (current[item])
                {
                    current = current[item];
                }
            });
            return current[lastKey];
        }
    },
    /** 设置a.b.c */
    setValueByDot : (inst : any, path : string, newVal : any) => {
        let lastDot = path.lastIndexOf('.');
        if (lastDot === -1)
        {
            inst[path] = newVal;
        }
        else
        {
            let cutStr = path.substring(0, lastDot);
            let lastKey = path.substring(lastDot + 1, path.length);
            let current : any = inst;
            commonUtil.literateDotKey(cutStr,(item, index, maxLen)=>{
                if (current[item])
                {
                    current = current[item];
                }
            });
            current[lastKey] = newVal;
        }
    },
    /** 执行代码片段并返回结果 */
    getSentenceResult : (context : any, code : string) : any => {
        let func = new Function(undefined, 'return ' + code);
        return func.apply(context, []);
    }
};
export default commonUtil;