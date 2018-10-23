import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";

class Main {
    private el : HTMLElement;
    private compiler : Compiler;
    private rootNode : VNode;
    private defOpt : any = {
        el: "body",
        template: "",
        model: {}
    };
    private options : any;

    constructor(options : any){
        this.options = $.extend({}, this.defOpt, options);
        this.el = $(this.options.el)[0];
        let htmlParser = new HtmlParser(this.options.template);
        this.rootNode = htmlParser.parse();
        this.compiler = new Compiler(this.rootNode, this.options.model);
        this.el.appendChild(this.compiler.compile());
    }
}

(<any>window).Lbind = Main;