import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";
import TextNode from "@/js/vdom/textNode";
import Component from "@/js/components/component";

export default class Model {
    private $originalData : Object;
    component : Component;

    constructor(component : Component, data : Object){
        this.component = component;
        this.$originalData = data;
    }

    private defineProperty(parent : any, name : string, value : any, callback : Function){
        if (!parent)
        {
            return undefined;
        }
        let self = this;
        var value;
        Object.defineProperty(parent, name, {
            get : function(){
                return value;
            },
            set : function(newValue){
                value = newValue;
                callback.apply(self.component, [newValue]);
            }
        });
        parent[name] = value;
    }

    /** 遍历Model的key值 */
    literateModelKey(command : string, callback : Function){
        let itemsMatch = command.match(/(\w|\$)+/g);
        itemsMatch.forEach((item, index)=>{
            callback(item, index, itemsMatch.length);
        });
    }

    createModel(command : string, callback : Function){
        let current : any = this;
        let oriCurrent : any = this.$originalData;
        this.literateModelKey(command,(item, index, maxLen)=>{
            oriCurrent = oriCurrent[item];
            if (current[item])
            {
                current = current[item];
                return;
            }
            if (typeof(oriCurrent) === 'object')
            {
                if (oriCurrent instanceof Array)
                {
                    this.defineProperty(current, item, [], callback);
                }
                else
                {
                    this.defineProperty(current, item, {}, callback);
                }
            }
            else
            {
                this.defineProperty(current, item, oriCurrent, callback);
            }
            current = current[item];
        });
    }

    setModel(command : string, newVal : string | boolean){
        let lastDot = command.lastIndexOf('.');
        if (lastDot === -1)
        {
            this[command] = newVal;
        }
        else
        {
            let cutStr = command.substring(0, lastDot);
            let lastKey = command.substring(lastDot + 1, command.length);
            let current : any = this;
            this.literateModelKey(cutStr,(item, index, maxLen)=>{
                if (current[item])
                {
                    current = current[item];
                }
            });
            current[lastKey] = newVal;
        }
    }
}