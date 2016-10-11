function Recorder(){
  this.time = 0;
  this.movement = {};
}
Recorder.prototype.incrementTime = function(){
  this.time += 1;
}
// record whole state
Recorder.prototype.makeRecord = function(x_,y_,value_,empty_){
  return {x:x_,y:y_,value:value_,empty:empty_};
}
Recorder.prototype.recordEmpty = function(){
  this.movement[this.time] = [];
}
Recorder.prototype.mostRecent = function(){
  return this.movement[this.time-1];
}
Recorder.prototype.recordChange = function(record1, record2){
  if (this.movement[this.time] === undefined){
    this.movement[this.time] = [{before:record1,after:record2}]
  }else{
    this.movement[this.time].push({before:record1, after: record2});
  }
}
