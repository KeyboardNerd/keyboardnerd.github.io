function BoardController(model){
  this.model = model;
}
BoardController.prototype.attachModel = function(model){
  this.model = model;
  // weird that this.model can't be bound inside the function(event)
  document.addEventListener("keydown", function(event){
    switch(event.which){
      case 38:
      model.actionMove(TO_TOP);
      model.notify();
      break;
      case 40:
      model.actionMove(TO_BOTTOM);
      model.notify();
      break;
      case 37:
      model.actionMove(TO_LEFT);
      model.notify();
      break;
      case 39:
      model.actionMove(TO_RIGHT);
      model.notify();
      break;
      default:
      return;
    }
  });
}

BoardController.prototype.startListen = function(){

}
