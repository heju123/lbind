import HtmlParser from "@/js/compiler/htmlParser";
import Compiler from "@/js/compiler/compiler";
import VNode from "@/js/vdom/vNode";
import Model from "@/js/model/model";
import EventBus from "@/js/event/eventBus";
import commonUtil from "@/js/utils/commonUtil";

export default abstract class Component{
    $el : HTMLElement;
    $compiler : Compiler;
    $vNode : VNode;
    $model : Model;
    $eventBus : EventBus;
    private $options : any;
    private $defOpt : any = {
        el: "body",
        template: "",
        model: {},
        methods: {}
    };
    private $defComponents : any;
    private $watchers : Array<Object> = [];
    private $dynamicSentences : Array<Object> = [];//记录所有动态绑定语句位置

    constructor(options : any){
        this.$options = $.extend({}, this.$defOpt, options);
        this.$defComponents = {
        };

        this.$el = $(this.$options.el)[0];
        this.$model = new Model(this, this.$options.model);
        let htmlParser = new HtmlParser(this.$options.template, this);
        this.$vNode = htmlParser.parse();
        this.$compiler = new Compiler(this.$vNode, this);
        this.$el.appendChild(this.$compiler.compile());
        this.$eventBus = new EventBus(this, this.$el, this.$vNode);
        this.$eventBus.enableEvents();
        //methods
        if (!$.isEmptyObject(this.$options.methods))
        {
            for (let key in this.$options.methods)
            {
                this[key] = this.$options.methods[key];
            }
        }
    }

    createWatcher(node : VNode, path : string, callback : Function){
        this.$watchers.push({
            node : node,
            path : path,
            callback : callback
        });
    }

    notifyWatcher(path : string, val : any){
        if (this.$watchers.length > 0)
        {
            this.$watchers.forEach((item)=>{
                if ((<any>item).path === path)
                {
                    (<any>item).callback.apply(this, [val]);
                }
            });
        }
    }

    addDynamicSentence(type : string, node : VNode, sentence : string, result : any){
        this.$dynamicSentences.push({
            type : type,//if
            node : node,
            sentence : sentence,
            result : result
        });
    }

    /** 检查动态语句结果是否改变，改变则重新生成节点dom */
    checkDynamicSentences(){
        if (this.$dynamicSentences.length > 0)
        {
            let reGenNodes : Array<VNode> = [];
            let item;
            for (let i = 0, j = this.$dynamicSentences.length; i < j; i++)
            {
                item = this.$dynamicSentences[i];
                let result = commonUtil.getSentenceResult(this, (<any>item).sentence);
                if (result !== (<any>item).result)
                {
                    reGenNodes.push((<any>item).node);
                }
            }
            if (reGenNodes.length > 0)
            {
                reGenNodes.forEach((node)=>{
                    this.$compiler.regenerateNode(node);
                });
            }
        }
    }

    cleanNode(node : VNode){
        //清空watchers
        let watcher;
        for (let i = 0; i < this.$watchers.length; i++)
        {
            watcher = this.$watchers[i];
            if ((<any>watcher).node === node)
            {
                this.$watchers.splice(i, 1);
                i--;
            }
        }
        //清空动态语句
        let ds;
        for (let i = 0; i < this.$dynamicSentences.length; i++)
        {
            ds = this.$dynamicSentences[i];
            if ((<any>ds).node === node)
            {
                this.$dynamicSentences.splice(i, 1);
                i--;
            }
        }
        if (node.children && node.children.length > 0)
        {
            node.children.forEach((child)=>{
                this.cleanNode(child);
            });
        }
    }
}