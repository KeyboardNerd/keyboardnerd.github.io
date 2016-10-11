function BoardViewer(rootElement){
  this.root = undefined;
  this.container = []; // each position can contain one or none tile
  this.init_board(rootElement);
}


BoardViewer.prototype.init_board = function(rootElement){
  this.root = document.createElement("_board");
  this.root.style.height = 200 + "px"; // pixel
  this.root.style.width = 200 + "px"; // just test the value here
  this.root.style.position = "relative";
  this.boardDimensionX = 4
  this.boardDimensionY = 4
  rootElement.appendChild(this.root);
  this.draw_board();
}

BoardViewer.prototype.draw_board = function(){
  var cellHeight = Math.floor(this.root.style.height/this.boardDimensionX);
  var cellWidth = Math.floor(this.root.style.width/this.boardDimensionY);
  for (var i = 0; i < this.boardDimensionX; i++){
    for (var j = 0; j < this.boardDimensionY; j++){
      var cell = document.createElement("_boardCell");
      cell.style.top = i*40 + "px";
      cell.style.left = j*40 + "px";
      cell.style.width = "40px";
      cell.style.height = "40px";
      cell.style.position = "absolute";
      cell.style.border = "thin solid #000000"; // test
      this.root.appendChild(cell);
    }
  }
}

// dirty implementation
BoardViewer.prototype.update = function(model){

  var listOfChange = model.getMovement();
  for (var i = 0; i < listOfChange.length; i++){
    var currentChange = listOfChange[i];
    var x = currentChange.before[0];
    var y = currentChange.before[1];
    var v = currentChange.before[2];
    var empty = currentChange.before[3];
    var x_ = currentChange.after[0];
    var y_ = currentChange.after[1];
    var v_ = currentChange.after[2];
    var empty_ = currentChange.after[3];
//    console.log("======================");
//    console.log("tomove",x,y,v,empty);
//    console.log("to",x_,y_,v_,empty_);
    if (empty){
      this.makeCell(x,y,v);
    }else{
      var tileToMove = this.tileLookup(x,y);
      var tileToRemove = this.tileLookup(x_,y_);
      if (x === x_ && y === y_){
        return false;
      }
//      console.log("move:",tileToMove);
//      console.log("remove:",tileToRemove);
//      console.log("tilelist=",this.container);
      this.removeCell(currentChange.after[0],currentChange.after[1]);
      tileToMove.updateNode(currentChange.after[0],currentChange.after[1],currentChange.after[2]);
    }
  }
}

// implement a hash function for better performance
BoardViewer.prototype.tileLookup = function(x,y){
  for (var i = 0; i < this.container.length; i++){
    var tile = this.container[i];
    if (tile.x === x && tile.y === y){
      return tile;
    }
  }
  return undefined;
}

BoardViewer.prototype.addToLookup = function(tile){
  this.container.push(tile);
}

BoardViewer.prototype.removeInLookup = function(x,y){
  for (var i = 0; i < this.container.length; i++){
    var tile = this.container[i];
    if (tile.x === x && tile.y === y){
      this.container.splice(i,1);
      return true;
    }
  }
  return false;
}

BoardViewer.prototype.removeCell = function(x,y){
  var tile = this.tileLookup(x,y);
  if (tile === undefined){
    return false;
  }
  this.root.removeChild(tile.getNode());
  return this.removeInLookup(x,y);
}

BoardViewer.prototype.updateCell = function(x,y,value){
  var tile = this.tileLookup(x,y);
  tile.updateNode(x,y,value);
}

BoardViewer.prototype.makeCell = function(x,y,value){
  var tile = new Tile(x,y,value);
  var node = tile.makeNode();
  this.root.appendChild(node);
  this.addToLookup(tile);
}
