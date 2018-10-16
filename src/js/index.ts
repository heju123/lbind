import HtmlParser from "@/js/compiler/htmlParser";
import VNode from "@/js/vdom/vNode";

class Main {
    private el : HTMLElement;
    private rootNode : VNode;
    private defOpt : any = {
        el: "body",
        template: ""
    };
    private options : any;

    constructor(options : any){
        this.options = $.extend({}, this.defOpt, options);
        this.el = $(this.options.el)[0];
        let htmlParser = new HtmlParser(this.options.template);
        this.rootNode = htmlParser.parse();
        this.rootNode.generateDom();
        console.log(this.rootNode);
        this.el.appendChild(this.rootNode.dom);
    }
}

(<any>window).Lbind = Main;

// function attr(str){
//     var reg = new RegExp(/(?<name>(\w|\-)+)\=\"(?<value>(\w|\-|\.|\=|\$|\s|,|\'|\(|\))*)\"/, 'g');
//     var result;
//     while ((result = reg.exec(str)) != null){
//         console.log("aaaaaaaaaaaaaaa",result);
//     }
// }
// function nodes(str){
//     var reg = new RegExp(/(\<(?<tagName>(\w|\-)+)(?<attributes>(.|\n|\r)*?)\>)|(\<\/(?<tagEnd>(\w|\-)+)\>)/, 'g');
//     var result;
//     var ret = [];
//     while ((result = reg.exec(str)) != null){
//         console.log("ddddddddddddddd", result, result.index, result[0].length);
//         //attr(result.groups.attributes);
//         //ret.push(result);
//     }
//     return ret;
// }
// var html = require('./template.html');
// var ret = nodes(html);