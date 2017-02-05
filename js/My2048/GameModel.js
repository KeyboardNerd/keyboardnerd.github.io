function GameModel(init_number){
  this.boardSize = 4;
  this.board = new gBoard(this.boardSize);
}

GameModel.prototype.attachViewer = function(viewer){
  this.viewer = viewer;
  this.notify();
}
GameModel.prototype.getMovement = function(){
  return this.board.getMostRecentMove();
}
GameModel.prototype.notify = function(){
  this.viewer.update(this);
}
GameModel.prototype.accessData = function(){
  return this.board.boardValue; // shallow copy cautious!
}
GameModel.prototype.actionMove = function(direction){
  var movement = this.board.moveLine(direction);
}

GameModel.prototype.isTerminated = function(){
  return "" + this.board.isTerminated();
}
GameModel.prototype.serialize = function(){
  return this.board.serialize();
}

GameModel.prototype.dump = function(){
  this.board.dump();
}
