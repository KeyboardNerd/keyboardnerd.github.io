function xBoardDecorate(board){
    this.board = board;
    this.draw = function(ctx, parentElement){

    }
}
function xTileDeco(tile){
    this.tile = tile;
    this.draw = function(ctx, parentElement){ // draw to board
        var cell = ctx.createElement("xtile");
        cell.style.top = i*40 + "px";
        cell.style.left = j*40 + "px";
        cell.style.width = "40px";
        cell.style.height = "40px";
        cell.style.position = "absolute";
        cell.style.border = "thin solid #000000"; // test
    }
}
// 1. represent the basic data structure storing the state of the game, and the basic logics applied to the game state.
// 2. No other information presented
function gBoard(size) {
    this.RANDNUM = [2, 4]
    // the b is represented as a list of lists of tiles: each tile contains the basic state of merged or not, the b contains the game state.
    this.b = new g2DMatrix(new gDim(size, size));
    this.noti = CTX.g("document", "gBoard", xBoardDecorate, this);
}

function gTile(value) {
    this.v = value;
    this.state = C.TILE.STATE.NORMAL;
    this.noti = CTX.g("gBoard", "gTile", xTileDeco, this);
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
    this.tAddTile(gTile.rand(this.RANDNUM), cell.x, cell.y);
}
gBoard.prototype.getEmptyCell = function () {
    return this.b.nullLocs()
}
gBoard.prototype.moveAll = function (dir) {
    var fmove = false;
    switch (dir) {
        case C.BOARD.DIR.N:
            for (var i = 0; i < this.b.h(); i++) { for (var j = 0; j < this.b.w(); j++) { fmove |= this.moveTile(i, j, dir); } }
            break;
        case C.BOARD.DIR.S:
            for (var i = this.b.h() - 1; i >= 0; i--) { for (var j = 0; j < this.b.w(); j++) { fmove |= this.moveTile(i, j, dir); } }
            break;
        case C.BOARD.DIR.W:
            for (var j = 0; j < this.b.w(); j++) { for (var i = 0; i < this.b.h(); i++) { fmove |= this.moveTile(i, j, dir); } }
            break;
        case C.BOARD.DIR.E:
            for (var j = this.b.w() - 1; j >= 0; j--) { for (var i = 0; i < this.b.h(); i++) { fmove |= this.moveTile(i, j, dir); } }
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
gBoard.prototype.moveTile = function (x, y, dir) {
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
        n = this.b.get(nx, ny);
        if (n == null) { this.b.move(x, y, nx, ny); return true;}
        else {
            if (n.tmerge(this.b.get(x, y))) {
                this.b.del(x, y);
                return true;
            }else{
                return false;
            }
        }
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

gTile.rand = function (nums) {
    var item = gChooseRand(nums);
    return new gTile(item);
}

gTile.prototype.toString = function(){
    return "" + this.v
}
gTile.prototype.invalidate = function () {
    this.state = C.TILE.STATE.INVALID;
}
gTile.prototype.unmarkMerge = function(){
    this.state = C.TILE.STATE.NORMAL;
}
gTile.prototype.tmerge = function (tile) { 
    if (!this.fmerge(tile)) return false;
    this.state = C.TILE.STATE.MERGED;
    this.v = this.v + tile.v;
    tile.invalidate();
    return true;
}
// merge tile with null or other tile 
gTile.prototype.fmerge = function (tile) {
    return !(tile != null && (this == tile || this.state == C.TILE.STATE.MERGED || tile.state == C.TILE.STATE.MERGED || this.v != tile.v));
}