function GameManager(){
  this.boardModel = new GameModel(2); // model
  this.boardViewer = new BoardViewer();// viewer
  this.boardController = new BoardController();// controller
  this.boardModel.attachViewer(this.boardViewer);
  this.boardController.attachModel(this.boardModel);
}
