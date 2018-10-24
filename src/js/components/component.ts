import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";
import Model from "@/js/model/model";
import EventBus from "@/js/event/eventBus";

export default abstract class Component{
    private el : HTMLElement;
    private compiler : Compiler;
    private vNode : VNode;
    private model : Model;
    private options : any;
    private eventBus : EventBus;
    private defOpt : any = {
        el: "body",
        template: "",
        model: {},
        methods: {}
    };

    constructor(options : any){
        this.options = $.extend({}, this.defOpt, options);
        this.el = $(this.options.el)[0];
        this.model = new Model(this, this.options.model);
        let htmlParser = new HtmlParser(this.options.template);
        this.vNode = htmlParser.parse();
        this.compiler = new Compiler(this.vNode, this.model);
        this.el.appendChild(this.compiler.compile());
        this.eventBus = new EventBus(this, this.el, this.vNode);
        this.eventBus.enableEvents();console.log(this.model);
        //methods
        if (!$.isEmptyObject(this.options.methods))
        {
            for (let key in this.options.methods)
            {
                this[key] = this.options.methods[key];
            }
        }
    }
}