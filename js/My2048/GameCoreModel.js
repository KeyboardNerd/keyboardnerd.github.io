
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

function gTile(value, vMan) {
    this.v = value;
    this.state = C.TILE.STATE.NORMAL;
    this.loc = new gLoc(0,0);
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
        var tile = gTile.rand(this.RANDNUM, this.vMan);
        tile.move(cell.x, cell.y);
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
        o.move(nx, ny);
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

gTile.rand = function (nums, vMan) {
    var item = gChooseRand(nums);
    return new gTile(item, vMan);
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
    this.w.update();
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