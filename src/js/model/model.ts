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
        this.craeteWatch(this.data, '');
    }

    private defineProp(parent : any, key : any, path : string){
        let self = this;
        let value;
        let oriVal = parent[key];
        let setFunc = function(newValue){
            value = newValue;
            let oldStruct = commonUtil.getValueByDot(self.structure, path);
            if (oldStruct && oldStruct.type === 'object')
            {
                commonUtil.setValueByDot(self.structure, path, {});
                self.craeteWatch(parent[key], path);
            }
            self.component.notifyWatcher(path, parent[key]);
        };
        Object.defineProperty(parent, key, {
            get : function(){
                return value;
            },
            set : setFunc
        });
        parent[key] = oriVal;
        commonUtil.setValueByDot(self.structure, path, {
            type: typeof(oriVal),
            set: setFunc
        });
    }

    private craeteWatch(parent : any, path : string){
        if (!parent)
        {
            return undefined;
        }
        if (parent instanceof Array)
        {
            parent.forEach((item, index)=>{
                this.defineProp(parent, index, path === '' ? index.toString() : path + '.' + index.toString());
                if (typeof(parent[index]) === 'object')
                {
                    this.craeteWatch(parent[index], path === '' ? index.toString() : path + '.' + index.toString());
                }
            });
        }
        else
        {
            for (let key in parent)
            {
                this.defineProp(parent, key, path === '' ? key : path + '.' + key);
                if (typeof(parent[key]) === 'object')
                {
                    this.craeteWatch(parent[key], path === '' ? key : path + '.' + key);
                }
            }
        }
    }

    setModel(path : string, newVal : any){
        commonUtil.setValueByDot(this, path, newVal);
    }
}