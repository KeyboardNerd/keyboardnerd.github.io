function GameCoreMain(boardNode){
    this.vMan = new vManager(document, boardNode); // visual 
    this.gMan = new gManager(this.vMan, new gSetting(10, 10, 3)); // game
    this.cMan = new cManager(this.gMan); // controller
    this.cMan.listen(document, boardNode); // listen on events on document
}