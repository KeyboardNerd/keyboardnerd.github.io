function GameCoreMain(boardNode){
    this.vMan = new vManager(document, boardNode); // visual 
    this.gMan = new gManager(this.vMan, new gSetting(4, 2)); // game
    this.cMan = new cManager(this.gMan); // controller
    this.cMan.listen(document); // listen on events on document
}