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
