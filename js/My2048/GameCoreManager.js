function vManager(ctx, parent) {
    // contains the DOM relation inside the game
    this.parent = parent;
    this.ctx = ctx;
    this.v = {}; // NO MULTIPLE ID SUPPORTED.
    this.watch = function (obj, objID, parentID) {
        var w = new gvWatcher(obj);
        var parent;
        if (!parentID == null) {
            parent = this.v[parentID];
        } else {
            parent = this.parent;
        }
        var node = this.makeV(objID, parent);
        w.add(node);
        this.v[parentID] = node;
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

function gSetting(boardSize, initTileNumber) {
    this.boardSize = boardSize;
    this.initTileNumber = initTileNumber;
}
function gManager(vMan, gSetting) {
    this.vMan = vMan;
    this.gBoard = new gBoard(gSetting.boardSize, vMan);
    for (var i = 0; i < gSetting.initTileNumber; i++) {
        this.gBoard.addTileRand()
    }
    this.UP = function () {
        this.gBoard.moveAll(C.BOARD.DIR.N);
        this.gBoard.addTileRand();
    }
    this.DOWN = function () {
        this.gBoard.moveAll(C.BOARD.DIR.S);
        this.gBoard.addTileRand();
    }
    this.LEFT = function () {
        this.gBoard.moveAll(C.BOARD.DIR.W);
        this.gBoard.addTileRand();
    }
    this.RIGHT = function () {
        this.gBoard.moveAll(C.BOARD.DIR.E);
        this.gBoard.addTileRand();
    }
}
function cManager(gMan) {
    this.model = gMan;
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
    this.listen = function (parent) {
        parent.addEventListener("keydown", this.listener);
    }
}