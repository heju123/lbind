import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";
import TextNode from "@/js/vdom/textNode";

export default class Model {
    originalData : Object;
    data : Object = {};

    constructor(originalData : Object){
        this.originalData = originalData;
    }

    private defineProperty(parent : any, objName : string, value : any){
        if (!parent)
        {
            return undefined;
        }
        var value;
        return Object.defineProperty(parent, objName, {
            get : function(){
                return value;
            },
            set : function(newValue){
                value = newValue;
            }
        });
    }

    createModel(node : VNode, command : string){
        let itemsMatch = command.match(/(\w|\$)+/g);
        let current : any = this.data;
        let currentOriValue : any = this.originalData;
        itemsMatch.forEach((item, index)=>{
            currentOriValue = currentOriValue[item];
            if (current[item])
            {
                current = current[item];
                return;
            }
            if (typeof(currentOriValue) === 'object')
            {
                if (currentOriValue instanceof Array)
                {
                    this.defineProperty(current, item, []);
                }
                else
                {
                    this.defineProperty(current, item, {});
                }
            }
            else
            {
                this.defineProperty(current, item, currentOriValue);
            }
            current = current[item];
        });
    }
}