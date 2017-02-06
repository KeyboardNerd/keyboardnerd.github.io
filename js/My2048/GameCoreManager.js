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
    this.UP = function () {
        this.gBoard.moveAll(C.BOARD.DIR.N);
        for (var i = 0; i < gSetting.incrTileNumber; i++){
            this.gBoard.addTileRand();
        }

    }
    this.DOWN = function () {
        this.gBoard.moveAll(C.BOARD.DIR.S);
        for (var i = 0; i < gSetting.incrTileNumber; i++){
            this.gBoard.addTileRand();
        }
    }
    this.LEFT = function () {
        this.gBoard.moveAll(C.BOARD.DIR.W);
        for (var i = 0; i < gSetting.incrTileNumber; i++){
            this.gBoard.addTileRand();
        }
    }
    this.RIGHT = function () {
        this.gBoard.moveAll(C.BOARD.DIR.E);
        for (var i = 0; i < gSetting.incrTileNumber; i++){
            this.gBoard.addTileRand();
        }
    }
}
function cManager(gMan) {
    this.model = gMan;
    this.activeParent;
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
    this.listen = function (ctx, activeNode) {
        this.activeNode = activeNode;
        this.ctx = ctx;
        ctx.addEventListener("keydown", this.listener);
    }
}