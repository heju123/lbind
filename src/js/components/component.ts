import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";
import Model from "@/js/model/model";
import EventBus from "@/js/event/eventBus";

export default abstract class Component{
    el : HTMLElement;
    compiler : Compiler;
    vNode : VNode;
    model : Model;
    eventBus : EventBus;
    private options : any;
    private defOpt : any = {
        el: "body",
        template: "",
        model: {},
        methods: {}
    };
    private defComponents : any;

    constructor(options : any){
        this.options = $.extend({}, this.defOpt, options);
        this.defComponents = {
        };

        this.el = $(this.options.el)[0];
        this.model = new Model(this, this.options.model);
        let htmlParser = new HtmlParser(this.options.template, this);
        this.vNode = htmlParser.parse();
        this.compiler = new Compiler(this.vNode, this);
        this.el.appendChild(this.compiler.compile());
        this.eventBus = new EventBus(this, this.el, this.vNode);
        this.eventBus.enableEvents();
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