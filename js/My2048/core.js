var TO_LEFT = 1;
var TO_RIGHT = -1;
var TO_TOP = 2;
var TO_BOTTOM = -2;

function Core(boardSize){
  this.boardSize = boardSize;
  this.history = new Recorder();
  this.boardValue = [];
  this.TO_LEFT = 1;
  this.TO_RIGHT = -1;
  this.TO_TOP = 2;
  this.TO_BOTTOM = -2;
  this.initBoard();
}
Core.prototype.getMostRecentMove = function(){
  return this.history.mostRecent();
}
Core.prototype.isTerminated = function(){
  for (var i = 0; i < this.boardSize; i++){
    for (var j = 0; j < this.boardSize; j++){
        if (this.isInBound(i,j-1)){
          if (this.accessCell(i,j-1)["value"] == this.accessCell(i,j)["value"] || (this.accessCell(i,j)["empty"] || this.accessCell(i,j-1)["empty"])){
            return false;
          }
      }
        if (this.isInBound(i-1,j)){
          if (this.accessCell(i-1,j)["value"] == this.accessCell(i,j)["value"] || (this.accessCell(i,j)["empty"] || this.accessCell(i-1,j)["empty"])){
            return false;
          }
        }
    }
  }
  return true;
}

Core.prototype.initBoard = function(){
  for (var j = 0; j < this.boardSize; j++){
    var pp = [];
    for (var i = 0; i < this.boardSize; i++){
      pp.push(this.makeCell(0, true, false));
    }
    this.boardValue.push(pp);
  }
  this.randomInsertCell();
  this.randomInsertCell();
  this.history.incrementTime();
}

Core.prototype.emptyCells = function(){
  var result = [];
  for (var i = 0; i < this.boardSize; i++){
    for (var j = 0; j < this.boardSize; j++){
      if (this.accessCell(i,j)["empty"]){
        result.push([i,j]);
      }
    }
  }
  return result;
}
Core.prototype.randomEmptyCell = function(){
  var empty = this.emptyCells();
  return empty[Math.floor((Math.random() * (empty.length - 1)))];
}

Core.prototype.randomInsertCell = function(){
  var value = Math.random() > 0.9 ? 4 : 2;
  var cell = this.randomEmptyCell();
  if (cell !== undefined){
    this.updateCell(cell[0], cell[1],value, false, false);
    this.history.recordChange([cell[0], cell[1], value, true], [cell[0], cell[1], value, false]);
  }
}

Core.prototype.dump = function(){
  for (var i = 0; i < this.boardSize; i++){
    var string = "";
    for (var j = 0; j < this.boardSize; j++){
      string += this.boardValue[i][j]["value"] + ",";
    }
    console.log(string);
  }
}
Core.prototype.serialize = function(){
  var string = "";
  for (var i = 0; i < this.boardSize; i ++){
    for (var j = 0; j < this.boardSize; j++){
      string += ("[" + this.boardValue[i][j]["value"] + "]");
    }
    string += "<br>";
  }
  return string
}
Core.prototype.dumpall = function(){
  for (var i = 0; i < this.boardSize; i++){
    var string = "";
    for (var j = 0; j < this.boardSize; j++){
      string += ("[" + this.boardValue[i][j]["value"] + "," + this.boardValue[i][j]["empty"] + "]");
    }
    console.log(string);
  }
}
Core.prototype.makeCell = function(value, empty, merged){
  return {"value": value, "empty": empty, "merged": merged};
}

Core.prototype.accessCell= function(x,y){
  return this.boardValue[x][y];
}
Core.prototype.isInBound= function(x,y){
  return x >= 0 && y >= 0 && x < this.boardSize && y < this.boardSize;
}
Core.prototype.updateCell= function(x,y, value, empty, merged){
  if (this.isInBound(x,y)){
    this.boardValue[x][y]["value"] = value;
    this.boardValue[x][y]["empty"] = empty;
    this.boardValue[x][y]["merged"] = merged;
    return true;
  }
  return false;
}

Core.prototype.cleanCell= function(x,y){
  if (this.isInBound(x,y)){
    this.updateCell(x,y, 0, true, false);
  }
}
Core.prototype.isMerged= function(x,y){
  if (this.isInBound(x,y)){
    return this.boardValue[x][y]["merged"];
  }
}

Core.prototype.move= function(x,y,direction){
// return true if move success, false otherwise
// move the cell on x,y to direction
var x_end = 0;
var y_end = 0;
var x_step = 0;
var y_step = 0;
var init_value = this.accessCell(x,y)["value"];
var x_init = x;
var y_init = y;
switch (direction) {
  case this.TO_LEFT:
    y_end = 0;
    x_end = x;
    y_step = -1;
  break;
  case this.TO_RIGHT:
    y_end = this.boardSize - 1;
    x_end = x;
    y_step = 1;
    break;
  case this.TO_TOP:
    x_end = 0;
    y_end = y;
    x_step = -1;
  break;
  case this.TO_BOTTOM:
    x_end = this.boardSize - 1;
    y_end = y;
    x_step = 1;
    break;
  default:
    return false;
}
var value = init_value;
var merged = false;
var empty = false;
if (this.accessCell(x_init, y_init)["empty"]){
  return false;
}
while (x != x_end || y != y_end){
  x += x_step;
  y += y_step;
  // if the current value is empty
  if (this.boardValue[x][y]["empty"]){
    if (x == x_end && y == y_end){
      value = init_value; merged = false;
      break;
    }else{
      continue;
    }
  }
  // if the current value is not empty and current value equals to init cell value
  else if (this.accessCell(x,y)["value"] == init_value){
    if (!this.accessCell(x,y)["merged"]){
      value = init_value*2; merged = true; empty = false;
      break;
    }else{
      x = x - x_step; y = y - y_step; merged = false; value = init_value; empty = false;
      break;
    }
  }
  // if the current is not empty and current value doesn't equal to init cell value
  else{
    value = init_value; merged = false; empty = false;
    x = x - x_step; y = y - y_step;
    break;
  }
}
if (x == x_init && y == y_init){
  return false;
}else{
  this.history.recordChange([x_init, y_init, init_value,false], [x,y,value,false]);
  this.updateCell(x,y, value, empty, merged);
  this.cleanCell(x_init,y_init);
  return true;
}
}

Core.prototype.moveLine = function(direction){
  var x_start = 0; var x_end = 0; var x_step = 0;
  var y_start = 0; var y_end = 0; var y_step = 0;
  var comparation;
  switch(direction){
    case this.TO_LEFT:
    x_start = 0; x_end = this.boardSize - 1; x_step = 1;
    y_start = 0; y_end = this.boardSize - 1; y_step = 1;

      break;
    case this.TO_RIGHT:
      x_start = 0; x_end = this.boardSize - 1; x_step = 1;
      y_start = -(this.boardSize - 1); y_end = 0; y_step = 1;

      break;
    case this.TO_TOP:
      x_start = 0; x_end = this.boardSize - 1; x_step = 1;
      y_start = 0; y_end = this.boardSize - 1; y_step = 1;

      break;
    case this.TO_BOTTOM:
      x_start = -(this.boardSize - 1); x_end = 0; x_step = 1;
      y_start = 0; y_end = this.boardSize - 1; y_step = 1;

      break;
  }
  // remove merged state

  for (var current_y = y_start; current_y <= y_end; current_y += y_step){
    for (var current_x = x_start; current_x <= x_end; current_x += x_step){
      this.boardValue[Math.abs(current_x)][Math.abs(current_y)]["merged"] = false;
    }
  }
  var result = false;
  for (var current_y = y_start; current_y <= y_end; current_y += y_step){
    for (var current_x = x_start; current_x <= x_end; current_x += x_step){
      result |= this.move(Math.abs(current_x), Math.abs(current_y), direction);
    }
  }
  if (result){
    this.randomInsertCell();
    this.history.incrementTime();
  }else{
    this.history.recordEmpty();
    this.history.incrementTime();
  }
  return result;
}
