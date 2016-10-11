function loadJSON(callback) {   
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'data.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
		// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);  
}

function initialize(JSONText){
	json_object = JSON.parse(JSONText);
	CARDS.cards = json_object.cards;
	CARDS.images = json_object.images;
	CARDS.category = json_object.category;
	CARDS.ready = true;
}

function CardDictionary(){
	// read a file to card dictionary for lookup
	// parse and read the file:
	this.cards = undefined;
	this.images = undefined;
	this.category = undefined;
	this.ready = false;
	this.get = function(id){ return this.cards[id] }
	this.isMatchable = function(card1, card2){
		return (this.cards[card1].month == this.cards[card2].month);
	}
}

function sleep(msec){
	setTimeout(nil, msec);
}

function l(card_id){
	return CARDS.get(card_id);
}

function ShownHand(){
	this.light = [];
	this.tane = [];
	this.ribbon = [];
	this.kasu = [];
	this.light_yaku = [];
	this.tane_yaku = [];
	this.ribon_yaku = [];
	this.kasu_yaku = [];
	this.add = function(card){
		switch(CARDS.get(card).category){
			case 0:
				this.light.push(card);
				break;
			case 1:
				this.tane.push(card);
				break;
			case 2:
				this.ribbon.push(card);
				break;
			case 3:
				this.kasu.push(card);
				break;
			default:
				return false;
		}
		return true;
	};
}

function Card(id=-1, x=0, y=0, shown = true){
	this.shown = shown;
	this.id = id;
	this.x = x;
	this.y = y;
	this.highlighted = false;
	this.month = function(){return l(this.id).month;};
	this.category = function(){return l(this.id).category;};
	this.name = function(){return l(this.id).name;};
}

function Hand(folded=false){
	this.cards = [];
	this.folded = folded;
	this.highlightSameMonth = function(required_card){
		this.cards.forEach(function(card){
			if (card.month() == required_card.month()){
				card.highlighted = true;
			}
		});
	};
	this.removeHighlight = function(){
		this.cards.forEach(function(card){
			card.highlighted = false;
		});
	};
	this.transfer = function(hand, num_cards){
		for (var i = 0; i < num_cards; i++){
			hand.add(this.pop());
		}
	};
	this.highlightAndFlip = function(index){
		if (index < 0 || index >= this.cards.length){
			console.error('Hand: index out of range');
			return undefined;
		}
		this.cards[index].highlighted = true;
		this.cards[index].show = true;
		return this.cards[index];
	}
	this.add = function(card){this.cards.push(card);};
	this.pop = function(){return this.cards.pop();};
}

function Player(){
	this.hand = new Hand();
	this.shown = new ShownHand();
	this.koikoi = 0;
	this.score = 0;
}

function ClientGame(){
	this.self = new Player();
	this.opp = new Player();
	this.remaining = new Hand();
	this.ground = new Hand();
	this.turn = 0;
	this.viewer = [];
	this.attach = function(viewer){ this.viewer.push(viewer);};
	this.notify = function(){for (var i = 0; i < this.viewer.length; i++){this.viewer[i].accept(this);}};
}

function ClientController(model){
	this.model = model; 
	// define user actions here:
	this.select = function(player, index){
		var p;
		if (player == 0){
			p = this.model.self;
		}else{
			p = this.model.opp;
		}
		var card = p.hand.highlightAndShow(index);
		this.model.ground.highlightSameMonth(card);
	};

}

function ConsoleViewer(){
	this.accept = function(model){
		console.log(model.self.toString() + model.opp.toString() + model.remaining.toString() + model.ground.toString());
	}
}


function main(){
	var client = new ClientGame();
	var controller = new ClientController(client);
	var yaku = YAKU;
}

YAKU = new YakuState();
CARDS = new CardDictionary();
loadJSON(initialize);
setTimeout(main, 1000);