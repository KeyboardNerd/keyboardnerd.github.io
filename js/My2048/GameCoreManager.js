function vManager(ctx, parent) {
    // contains the DOM relation inside the game
    this.parent = parent;
    this.ctx = ctx;
    this.v = {}; // NO MULTIPLE ID SUPPORTED.
    this.watch = function (obj, objID, parentID) {
        var w = new gvWatcher(obj);
        var parent;
        if (parentID != null) {
            parent = this.v[parentID];
        } else {
            parent = this.parent;
        }
        var watcher = this.makeV(objID, parent);
        w.add(watcher);
        this.v[objID] = watcher.node;
        return w;
    }
    this.makeV = function (id, parent) {
        switch (id) {
            case C.ID.TILE:
                return new vTile(this.ctx, parent);
            case C.ID.BOARD:
                return new vBoard(this.ctx, parent);
        }
    }
}

function gSetting(boardSize, initTileNumber, incrTileNumber) {
    this.boardSize = boardSize;
    this.initTileNumber = initTileNumber;
    this.incrTileNumber = incrTileNumber;
}
function gManager(vMan, gSetting) {
    this.vMan = vMan;
    this.gBoard = new gBoard(gSetting.boardSize, vMan);
    for (var i = 0; i < gSetting.initTileNumber; i++) {
        this.gBoard.addTileRand()
    }
    this.boardMove = function(dir){
        var success = this.gBoard.moveAll(dir);
        if (success){
            for (var i = 0; i < gSetting.incrTileNumber; i++){
                this.gBoard.addTileRand();
            }
        }
    }
    this.UP = function () {
        this.boardMove(C.BOARD.DIR.N);
    }
    this.DOWN = function () {
        this.boardMove(C.BOARD.DIR.S);
    }
    this.LEFT = function () {
        this.boardMove(C.BOARD.DIR.W);
    }
    this.RIGHT = function () {
        this.boardMove(C.BOARD.DIR.E);
    }
}
function cManager(gMan) {
    this.model = gMan;
    this.ctx;
    var outer = this;
    this.listener = function (event) {
        switch (event.which) {
            case 38:
                gMan.UP();
                break;
            case 40:
                gMan.DOWN();
                break;
            case 37:
                gMan.LEFT();
                break;
            case 39:
                gMan.RIGHT();
                break;
            default:
                return;
        }
    };
    this.listen = function (ctx) {
        this.ctx = ctx;
        ctx.addEventListener("keydown", this.listener);
    }
}
function cManagerTouch(gMan){
    this.model = gMan;
    this.startPosition 
    this.handleStart = function(evt){
        evt.preventDefault();
        var touches = evt.changedTouches;
        this.startPosition = new gLoc(touches[0].pageX, touches[0].pageY);
    }
    this.handleEnd = function(evt){
        var touches = evt.changedTouches;
        var currentPosition = new gLoc(touches[0].pageX, touches[0].pageY);
        switch(cManagerTouch.compare(this.startPosition, currentPosition)){
            case 0:
            gMan.DOWN();break;
            case 1:
            gMan.UP(); break;
            case 2:
            gMan.RIGHT(); break;
            case 3:
            gMan.LEFT(); break;
        }
    }
    this.listen = function(ctx){
        ctx.addEventListener("touchstart", this.handleStart, false);
        ctx.addEventListener("touchend", this.handleEnd, false);
    }
}

cManagerTouch.compare = function(startPosition, endPosition){
        var dx = endPosition.x - startPosition.x;
        var dy = endPosition.y - startPosition.y;
        if (dx == dy < 10) { return -1; }// not valid}
        if (Math.abs(dy) > Math.abs(dx)){
            if (dy > 0){
                return 0; // south 
            }else{
                return 1; // north
            }
        }else{
            if (dx > 0){
                return 2; // east
            }else{
                return 3; // west
            }
        }
}

