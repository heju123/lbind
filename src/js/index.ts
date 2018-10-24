import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";
import Model from "@/js/model/model";

class Main {
    private el : HTMLElement;
    private model : Model;
    private compiler : Compiler;
    private vNode : VNode;
    private defOpt : any = {
        el: "body",
        template: "",
        data: {}
    };
    private options : any;

    constructor(options : any){
        this.options = $.extend({}, this.defOpt, options);
        this.el = $(this.options.el)[0];
        this.model = new Model(this.options.data);
        let htmlParser = new HtmlParser(this.options.template);
        this.vNode = htmlParser.parse();
        this.compiler = new Compiler(this.vNode, this.model);
        this.el.appendChild(this.compiler.compile());
        this.enableEvents();
    }

    addDomEventListener(dom : any, type : string, callback : Function){
        if (window.addEventListener)
        {
            dom.addEventListener(type, callback, false);
        }
        else
        {
            dom.attachEvent("on" + type, callback);
        }
    }
    enableEvents(){
        this.addDomEventListener(this.el, "click", (e)=>{
        });
    }
}

(<any>window).Lbind = Main;