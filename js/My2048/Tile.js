function Tile(x,y,value){
  this.value = value;
  this.x = x;
  this.y = y;
  this.node = undefined;
}

Tile.prototype.makeNodeStyle = function(){
  this.node.id = this.value;
  this.node.style.opacity = "0";
  this.node.style.transition = "top 0.2s ease, left 0.2s ease";
  this.node.style.opacity = "1";
  this.node.style.top = this.x*40 + "px";
  this.node.style.left = this.y*40 + "px";
  this.node.style.width = "40px";
  this.node.style.height = "40px";
  this.node.style.position = "absolute";
  this.node.style.border = "thin solid #000000";
  this.node.style.textAlign = "center";
  this.node.style.lineHeight = "3.0";
}
Tile.prototype.getNode = function(){
  return this.node;
}
Tile.prototype.updateNode = function(x,y,value){
  this.x = x; this.y = y; this.value = value;
  this.makeNodeStyle();
  this.node.innerHTML = this.value;
  return this.node;
}
Tile.prototype.makeNode = function(){
  var node = document.createElement("tile");
  this.node = node;
  this.makeNodeStyle();
  var text_node = document.createTextNode(this.value);
  node.appendChild(text_node);
  return node;
}
