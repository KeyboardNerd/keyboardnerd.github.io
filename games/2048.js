var C = {
    ID: {
        BOARD : 0,
        TILE : 1,
    },
    TILE: {
        STATE: {
            NORMAL: 0,
            MERGED: 1,
            INVALID: 2,
        }
    },
    BOARD: {
        STATE : {
            STOPPED: 0,
            PAUSED: 1,
            INGAME: 2,
            TERMINAED: 3,
        },
        DIR : {
            N: 0,
            W: 1,
            E: 2,
            S: 3
        },
        DIRL : {
            L: 0,
            R: 1
        }
    },
    DIM : {
        AXIS :{
            X: 0,
            Y: 1
        }
    }, 
    V : {
        STATE : {
            ACTIVE : 0,
            INACTIVE : 1
        }
    }
}


function gChooseRand(arr) {
    if (arr === undefined || arr == null || arr.length == 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}
function gHashSet() {
    this.d = {}
    this.put = function (v) {
        this.d[v] = true;
    }
    this.get = function (v) {
        return this.d[v] !== undefined;
    }
}

function g2DMatrix(dim) {
    this.m = new Array(dim.x)
    for (var i = 0; i < dim.y; i++){
        this.m[i] = (Array(dim.y).fill(null));
    }
    this.nulls = gHashSet(); // for optimization
    this.d = dim;
    this.w = function () {
        return this.d.y;
    }
    this.h = function () {
        return this.d.x;
    }
    this.fempty = function (x, y) {
        return (this.get(x, y) == null)
    }
    this.put = function (obj, x, y) {
        if (!this.d.in(x, C.DIM.AXIS.X) || !this.d.in(y, C.DIM.AXIS.Y)) return null; // TODO: throw exception
        this.m[x][y] = obj;
    }
    this.del = function (x, y) {
        if (!this.d.in(x, C.DIM.AXIS.X) || !this.d.in(y, C.DIM.AXIS.Y)) return null; // TODO: throw exception
        this.m[x][y] = null;
    }
    // shallow copy
    this.get = function (x, y) {
        if (!this.d.in(x, C.DIM.AXIS.X) || !this.d.in(y, C.DIM.AXIS.Y)) return null; // TODO: throw exception
        return this.m[x][y];
    }

    this.getRow = function (x) {
        if (!this.d.in(x, C.DIM.AXIS.X)) return null;
        return this.m[x].slice();
    }

    this.getCol = function (y) {
        if (!this.d.in(y, C.DIM.AXIS.Y)) return null;
        var col = [];
        for (var i = 0; i < this.d.x; i++) {
            col.push(this.m[i][y]);
        }
        return col;
    }
    this.move = function (x, y, nx, ny) {
        var v = this.get(x, y);
        this.put(v, nx, ny);
        this.del(x, y);
    }
    this.nullLocs = function () {
        var locs = [];
        for (var i = 0; i < this.h(); i++) {
            for (var j = 0; j < this.w(); j++) {
                if (this.get(i,j) == null){
                    locs.push(new gLoc(i, j));
                }
            }
        }
        return locs;
    }
    this.notNullLocs = function (){
        var locs = [];
        for (var i = 0; i < this.h(); i++) {
            for (var j = 0; j < this.w(); j++) {
                if (this.get(i,j) != null){
                    locs.push(new gLoc(i, j));
                }
            }
        }
        return locs;
    }
    this.toString = function(){
        var strs = "\n";
        for (var i = 0; i < this.h(); i++){
            strs += "|"
            for (var j = 0; j < this.w(); j++){
                if (this.get(i,j) == null){
                    strs += " |"
                }else{
                    strs += (this.get(i,j).toString() + "|")
                }
            }
            strs += "\n"
        }
        return strs
    }
}

function gLoc(x, y) {
    this.x = x;
    this.y = y;
}

function gDim(x, y) {
    this.x = x;
    this.y = y;
    this.in = function (d, axis = this.AXIS.X) {
        switch (axis) {
            case C.DIM.AXIS.X:
                return d >= 0 && d < this.x;
            case C.DIM.AXIS.Y:
                return d >= 0 && d < this.y;
            default:
                return false;
        }
    }
}

function vBoard(ctx, parent){
    this.parent = parent;
    this.ctx = ctx;
    this.state = C.V.STATE.INACTIVE;
    this.node = vBoard.initNode(this.ctx);
}

vBoard.initNode = function(ctx){
    var node = ctx.createElement("div");
    node.className = "xboard";
    node.style.z_index = -1;
    return node;
}

vBoard.prototype.activate = function(){
    if (this.state == C.V.STATE.ACTIVE) return;
    this.parent.appendChild(this.node);
    this.state = C.V.STATE.ACTIVE;
}

vBoard.prototype.deactivate = function(){
    if (this.state == C.V.STATE.INACTIVE) return;
    if (this.deactivateAnimation){
        this.node.addEventListener("transitioned", function(e){
            e.target.remove();
        });
    }else{
        this.node.remove();
    }
    this.state = CV.STATE.INACTIVE;
}
vBoard.prototype.invalidate = function(){
    this.deactivate();        
    this.activate();
}
vBoard.prototype.update = function(board){
    this.activate();
    board.dim.x*40 + "px";
    var width = board.dim.y*40 + "px";
    this.node.style.height = board.dim.x*40 + "px";
    this.node.style.width = board.dim.y*40 + "px";
}

function vTile(ctx, parent){
    this.parent = parent;
    this.ctx = ctx;
    this.state = C.V.STATE.INACTIVE;
    this.node = vTile.initNode(this.ctx);
}

vTile.initNode = function(ctx){
    var node = ctx.createElement("div");
    node.className = "xtile";
    node.style.transition = "all 0.5s, opacity 0.5s";
    node.style.z_index = "2";
    return node;
}

vTile.prototype.activate = function(){
    if (this.state == C.V.STATE.ACTIVE) return;
    this.parent.appendChild(this.node);
    this.state = C.V.STATE.ACTIVE;
}
vTile.prototype.deactivate = function(){
    if (this.state == C.V.STATE.INACTIVE) return;
    this.node.style.zIndex = "0";
    this.node.style.opacity = "0.0";
    this.node.addEventListener("transitionend", function(e){ e.target.remove(); });
    this.state = C.V.STATE.INACTIVE;
}

vTile.prototype.update = function(tile){
    var top = tile.loc.x*40+"px";
    var left = tile.loc.y*40+"px";
    if (this.node.style.top !== top){this.node.style.top = top;}
    if (this.node.style.left !== left){this.node.style.left = left;}
    if (this.node.innerHTML !== tile.v){this.node.innerHTML = tile.v;}
    this.activate();
    if (tile.state == C.TILE.STATE.NORMAL){
        this.node.style.zIndex = "1";
    }
    if (tile.state == C.TILE.STATE.MERGED){
        this.node.style.zIndex = "2";
    }
    if (tile.state == C.TILE.STATE.INVALID){
        this.node.style.zIndex = "0";
        this.deactivate();
    }
    //console.log(this.node);
}

function gvWatcher(obj){
    this.watchers = []
    this.obj = obj;
    // every watcher should implement update function
    this.add = function(watcher){
        this.watchers.push(watcher);
    }
    this.update = function(){
        var objb = this.obj;
        this.watchers.forEach(function(watcher){watcher.update(objb)});
    }
}


// 1. represent the basic data structure storing the state of the game, and the basic logics applied to the game state.
// 2. No other information presented
function gBoard(size, vMan) {
    this.RANDNUM = [2, 4]
    // the b is represented as a list of lists of tiles: each tile contains the basic state of merged or not, the b contains the game state.
    this.dim = new gDim(size, size);
    this.b = new g2DMatrix(this.dim);
    this.vMan = vMan;
    this.w = this.vMan.watch(this, C.ID.BOARD, null);
    this.w.update()
}

function gTile(value, vMan, x=0, y=0) {
    this.v = value;
    this.state = C.TILE.STATE.NORMAL;
    this.loc = new gLoc(x,y);
    this.vMan = vMan;
    this.w = this.vMan.watch(this, C.ID.TILE, C.ID.BOARD); // only one context
    this.w.update();
}

gBoard.prototype.tAddTile = function (tile, x, y) {
    if (this.b.fempty(x, y)) {
        this.b.put(tile, x, y);
        return true;
    }
    return false;
}

gBoard.prototype.addTileRand = function () {
    var cell = gChooseRand(this.getEmptyCell());
    if (cell){
        var tile = gTile.rand(this.RANDNUM, this.vMan, cell.x, cell.y);
        this.tAddTile(tile, cell.x, cell.y);
    }

}

gBoard.prototype.getEmptyCell = function () {
    return this.b.nullLocs()
}

gBoard.prototype.moveAll = function (dir) {
    var fmove = false;
    switch (dir) {
        case C.BOARD.DIR.N:
            for (var i = 0; i < this.b.h(); i++) { for (var j = 0; j < this.b.w(); j++) { fmove |= this.moveTileConditional(i, j, dir); } }
            break;
        case C.BOARD.DIR.S:
            for (var i = this.b.h() - 1; i >= 0; i--) { for (var j = 0; j < this.b.w(); j++) { fmove |= this.moveTileConditional(i, j, dir); } }
            break;
        case C.BOARD.DIR.W:
            for (var j = 0; j < this.b.w(); j++) { for (var i = 0; i < this.b.h(); i++) { fmove |= this.moveTileConditional(i, j, dir); } }
            break;
        case C.BOARD.DIR.E:
            for (var j = this.b.w() - 1; j >= 0; j--) { for (var i = 0; i < this.b.h(); i++) { fmove |= this.moveTileConditional(i, j, dir); } }
            break;
    }
    this.unmarkMerge();
    return fmove;
}

gBoard.prototype.unmarkMerge = function(){
    var notNull = this.b.notNullLocs();
    notNull.forEach(function(loc) {
        this.b.get(loc.x, loc.y).unmarkMerge();
    }, this);
}

gBoard.prototype.moveTileConditional = function (x, y, dir) {
    if (this.b.get(x, y) != null) {
        // assume all other tiles' steps are finished, find the next possible location
        var c, n;
        var nx, ny;
        nx = x; ny = y;
        switch (dir) {
            case C.BOARD.DIR.N:
                c = this.b.getCol(y);
                // find first mergeable or empty cell
                nx = this.getMergeable(c, x, C.BOARD.DIRL.L);
                break;
            case C.BOARD.DIR.S:
                c = this.b.getCol(y);
                nx = this.getMergeable(c, x, C.BOARD.DIRL.R);
                break;
            case C.BOARD.DIR.W:
                c = this.b.getRow(x);
                ny = this.getMergeable(c, y, C.BOARD.DIRL.L);
                break;
            case C.BOARD.DIR.E:
                c = this.b.getRow(x);
                ny = this.getMergeable(c, y, C.BOARD.DIRL.R);
                break;
        }
        return this.moveTile(x,y, nx,ny);
    }
}

// move tile from x,y to nx, ny
gBoard.prototype.moveTile = function(x,y, nx, ny){
    var o = this.b.get(x,y);
    var n = this.b.get(nx,ny);
    if (o == null) return true;
    else if (n == null){
        o.move(nx, ny);
        this.b.move(x, y, nx, ny);
        return true;
    }else if (n.tmerge(o)){
        this.b.del(x,y);
        return true;
    }else{
        return false;
    }
}

gBoard.prototype.getMergeable = function (arr, loc, dir) {
    var i = 0
    var tile = arr[loc]
    switch (dir) {
        case C.BOARD.DIRL.L: // tile go left in arr
            // this make sure i = valid position in one pass
            for (i = loc - 1; i >= 0 && (arr[i] == null); i--) { } // find the closest non-null cell
            if (i < 0) { i = 0; } // if not found, just move it to border 
            else if (!arr[i].fmerge(tile)) { i += 1; }
            break;
        case C.BOARD.DIRL.R:
            for (i = loc + 1; i < arr.length && (arr[i] == null); i++) { }
            if (i >= arr.length) { i = arr.length-1; } // if not found, just move it to border 
            else if (!arr[i].fmerge(tile)) { i -= 1; }
            break;
        default:
            i = -1;
            break;
    }
    return i;
}

gTile.rand = function (nums, vMan, x=0, y=0) {
    var item = gChooseRand(nums);
    return new gTile(item, vMan, x, y);
}

gTile.prototype.toString = function(){
    return "" + this.v
}

gTile.prototype.invalidate = function () {
    this.state = C.TILE.STATE.INVALID;
    this.w.update();
}

gTile.prototype.unmarkMerge = function(){
    this.state = C.TILE.STATE.NORMAL;
}
gTile.prototype.markMerge = function(){
    this.state = C.TILE.STATE.MERGED;
    this.w.update();
}
// merge tile to this
gTile.prototype.tmerge = function (tile) { 
    if (!this.fmerge(tile)) return false;
    this.v = this.v + tile.v;
    this.markMerge();
    tile.move(this.loc.x, this.loc.y);
    tile.invalidate();
    return true;
}
gTile.prototype.move = function(x,y){
    this.loc.x = x; this.loc.y = y;
    this.w.update();
}
// merge tile with null or other tile 
gTile.prototype.fmerge = function (tile) {
    return !(tile != null && (this == tile || this.state == C.TILE.STATE.MERGED || tile.state == C.TILE.STATE.MERGED || this.v != tile.v));
}

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

function GameCoreMain(boardNode){
    this.vMan = new vManager(document, boardNode); // visual 
    this.gMan = new gManager(this.vMan, new gSetting(10, 10, 3)); // game
    this.cMan = new cManager(this.gMan); // controller
    this.cMan.listen(document); // listen on events on document
    this.cManT = new cManagerTouch(this.gMan);
    this.cManT.listen(document);
}