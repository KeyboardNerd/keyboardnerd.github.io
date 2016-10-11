function Kou(){
	this.yaku = undefined;
	this.potential = false;
	this.additional_point = 0;
	this.ame = false;
	this.count = 0;
	this.add = function(card){
		if (card.id === 3){
			this.ame = true;
		}
		if (card.category === 0){
			this.count += 1;
		}
		if (!this.ame && this.count === 3){
			this.yaku = 0; // sankou
		}
		else if (this.ame && this.count == 4){
			this.yaku = 2; // shikou
		}else if (!this.ame && this.count === 4){
			this.yaku = 1; // ameshikou
		}else if (this.ame && this.count === 5){
			this.yaku = 3; // gokou
		}else{
			this.yaku = undefined
		}
	}
}

function Inoshikachou(){
	this.yaku = undefined;
	this.potential = false;
	this.count = 0;
	this.additional_point = 0;
	this.add = function(card){
		if (card.id === 9 || card.id === 8 || card.id === 12){
			this.count += 1;
		}
		if (this.count === 3){
			this.additional_point = this.count - 3;
			this.yaku = 4;
		}else{
			this.yaku = undefined;
			this.additional_point = 0;
		}
	}
}

function Tane(){
	this.yaku = undefined;
	this.potential = false;
	this.count = 0;
	this.additional_point = 0;
	this.add = function(card){
		if (card.category === 1){// if it's tane
			this.count += 1;
		}
		if (this.count >= 5){
			this.additional_point = this.count - 5;
			this.yaku = 5; // tane;
		}
	}
}

function Tanzaku(){
	this.yaku = undefined;
	this.potential = false;
	this.count = 0;
	this.additional_point = 0;
	this.add = function(card){
		if (card.category === 2){
			this.count += 1;
		}
		if (this.count >= 5){
			this.yaku = 9;
			this.additional_point = this.count - 5;
		}
	}
}

function Akatan(){
	this.yaku = undefined;
	this.potential = false;
	this.count = 0;
	this.additional_point = 0;
	this.add = function(card){
		if (card.id === 15 || card.id === 14 || card.id === 16){
			this.count += 1;
		}
		if (this.count === 3){
			this.yaku = 6;
		}else{
			this.yaku = undefined;
		}
	}
}

function Aotan(){
	this.yaku = undefined;
	this.potential = false;
	this.count = 0;
	this.additional_point = 0;
	this.add = function(card){
		if (card.id === 19 || card.id === 20 || card.id === 21){
			this.count += 1;
		}
		if (this.count === 3){
			this.yaku = 7;
		}else{
			this.yaku = undefined;
		}
	}
}

function AkatanAotannoChoufuku(){
	this.yaku = undefined;
	this.potential = false;
	this.count = 0;
	this.additional_point = 0;
	this.add = function(card){
		if (card.id === 15 || card.id === 14 || card.id === 16 || card.id === 19 || card.id === 20 || card.id === 21){
			this.count += 1;
		}
		if (this.count === 6){
			this.yaku = 8;
		}else{
			this.yaku = undefined;
		}
	}
}

function Tsukimizake(){
	this.yaku = undefined;
	this.potential = false;
	this.zake = false; this.tsukimi = false;
	this.additional_point = 0;
	this.add = function(card){
		if (card.id === 11){
			this.zake = true;
		}
		if (card.id === 2){
			this.tsukimi = true;
		}
		if (this.zake && this.tsukimi){
			this.yaku = 10;
		}else{
			this.yaku = undefined;
		}
	}
}

function Hanamizake(){
	this.yaku = undefined;
	this.potential = false;
	this.zake = false; this.hanami = false;
	this.additional_point = 0;
	this.add = function(card){
		if (card.id === 11){
			this.zake = true;
		}
		if (card.id === 1){
			this.hanami = true;
		}
		if (this.zake && this.hanami){
			this.yaku = 11;
		}else{
			this.yaku = undefined;
		}
	}
}

function Kasu(){
	this.yaku = undefined;
	this.potential = false;
	this.count = 0;
	this.additional_point = 0;
	this.add = function(card){
		if (card.category === 3){
			this.count += 1;
		}
		if (this.count >= 5){
			this.additional_point = this.count - 5;
			this.yaku = 12;
		}else{
			this.yaku = undefined;
		}
	};
}
function Teshi(){
	this.yaku = undefined;
	this.potential = false;
	this.additional_point = 0;
	this.card_counter = new Array(12);
	for (var i = 0; i < this.card_counter.length; i++){
		this.card_counter[i] = 0;
	}
	this.add = function(card){
		this.card_counter[card.month] += 1;
		if (this.card_counter[card.month] === 4){
			this.yaku = 13;
		}
	}
}

function Kuttsuki(){
	this.yaku = undefined;
	this.potential = false;
	this.additional_point = 0;
	this.counter = 0;
	this.card_counter = new Array(12);
	for (var i = 0; i < this.card_counter.length; i++){
		this.card_counter[i] = 0;
	}
	this.add = function(card){
		this.card_counter[card.month] += 1;
		if (this.card_counter[card.month] === 2){
			this.counter += 1;
		}
		if (this.counter === 4){
			this.yaku = 14;
		}
	}
}