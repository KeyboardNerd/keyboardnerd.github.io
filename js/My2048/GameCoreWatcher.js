function vBoard(ctx, parent){
    this.parent = parent;
    this.ctx = ctx;
    this.state = C.V.STATE.INACTIVE;
    this.node = vBoard.initNode(this.ctx);
}

vBoard.initNode = function(ctx){
    var node = ctx.createElement("xBoard");
    node.style.height = "200px";
    node.style.width = "200px";
    node.style.position = "relative";
    return node;
}
vBoard.prototype.activate = function(){
    if (this.state == C.V.STATE.ACTIVE) return;
    this.parent.appendChild(this.node);
    this.state = C.V.STATE.ACTIVE;
}
vBoard.prototype.deactivate = function(){
    if (this.state == C.V.STATE.INACTIVE) return;
    this.node.remove();
    this.state = CV.STATE.INACTIVE;
}
vBoard.prototype.invalidate = function(){
    this.deactivate();        
    this.activate();
}
vBoard.prototype.update = function(board){
    this.activate();
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
    var cell = ctx.createElement("xtile");
    cell.style.top = "40px";
    cell.style.left = "40px";
    cell.style.width = "40px";
    cell.style.height = "40px";
    cell.style.position = "absolute";
    cell.style.border = "thin solid #000000"; 
    return cell;
}
vTile.prototype.activate = function(){
    this.parent.appendChild(this.node);
    this.state = C.V.STATE.ACTIVE;
}
vTile.prototype.deactivate = function(){
    this.node.remove();
    this.state = C.V.STATE.INACTIVE;
}
vTile.prototype.invalidate = function(){
    this.deactivate();        
    this.activate();
}
vTile.prototype.update = function(tile){
    this.activate();
    if (tile.state == C.TILE.STATE.INVALID){
        this.deactivate();
        return;
    }
    
    this.node.style.top = tile.loc.x*40+"px";
    this.node.style.left = tile.loc.y*40+"px";
    this.node.innerHTML = tile.v;
    console.log(this.node);
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

