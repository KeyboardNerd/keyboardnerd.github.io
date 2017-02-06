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

