import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";
import TextNode from "@/js/vdom/textNode";
import Component from "@/js/components/component";
import commonUtil from "@/js/utils/commonUtil";

export default class Model {
    component : Component;
    data : Object;
    structure : Object;

    constructor(component : Component, data : Object){
        this.component = component;
        this.data = data;
        this.structure = {};
        this.recursiveCreateWatch(this.data, '');
    }

    /** 对象改变的时候子节点 */
    private notifyChildren(current : any, path : string, oldStruct : Object){
        for (let key in oldStruct)
        {
            this.component.notifyWatcher(path === '' ? key : path + '.' + key, current[key]);
            if (typeof(current[key]) === 'object' && oldStruct[key].type === 'object')//必须当前的和以前的结构相同
            {
                this.notifyChildren(current[key], path === '' ? key : path + '.' + key, oldStruct[key]);
            }
        }
    }

    private createWatch(parent : any, key : any, path : string){
        let self = this;
        let value;
        let oriVal = parent[key];
        Object.defineProperty(parent, key, {
            get : function(){
                return value;
            },
            set : function(newValue){
                value = newValue;
                let oldStruct = commonUtil.getValueByDot(self.structure, path);
                if (oldStruct && oldStruct.type === 'object')//对象改变，要重新生成structure并通知子对象
                {
                    self.notifyChildren(parent[key], path, oldStruct);
                    commonUtil.setValueByDot(self.structure, path, {});//重新生成structure
                    self.recursiveCreateWatch(parent[key], path);
                }
                self.component.notifyWatcher(path, parent[key]);
            }
        });
        parent[key] = oriVal;
        commonUtil.setValueByDot(self.structure, path, {
            type: typeof(oriVal)
        });
    }

    /**
     * 递归创建监听
     */
    private recursiveCreateWatch(parent : any, path : string){
        if (!parent)
        {
            return undefined;
        }
        if (parent instanceof Array)
        {
            parent.forEach((item, index)=>{
                this.createWatch(parent, index, path === '' ? index.toString() : path + '.' + index.toString());
                if (typeof(parent[index]) === 'object')
                {
                    this.recursiveCreateWatch(parent[index], path === '' ? index.toString() : path + '.' + index.toString());
                }
            });
        }
        else
        {
            for (let key in parent)
            {
                this.createWatch(parent, key, path === '' ? key : path + '.' + key);
                if (typeof(parent[key]) === 'object')
                {
                    this.recursiveCreateWatch(parent[key], path === '' ? key : path + '.' + key);
                }
            }
        }
    }

    /** 创建属性 */
    createModel(path : string){
        let current : any = this.data;
        let currPath = '';
        commonUtil.literateDotKey(path, (key, index, maxLen)=>{
            currPath = currPath === '' ? key : currPath + '.' + key;
            if (!current.hasOwnProperty(key))
            {
                if (index < maxLen - 1)//不是最后一个，则定义为对象
                {
                    current[key] = {};
                    this.createWatch(current, key, currPath);
                }
                else
                {
                    current[key] = '';
                    this.createWatch(current, key, currPath);
                }
            }
            current = current[key];
        });
    }

    setModel(path : string, newVal : any){
        commonUtil.setValueByDot(this.data, path, newVal);
    }
}