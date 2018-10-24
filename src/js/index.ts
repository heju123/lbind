import MainComponent from "@/js/components/mainComponent";

class Main extends MainComponent{
    constructor(options : any){
        super(options);
    }
}

(<any>window).Lbind = Main;