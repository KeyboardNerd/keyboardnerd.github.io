function InitYakuState(){
	this.yakus = [new Teshi(), new Kuttsuki()]
	this.addCards = function(cards){
		cards.forEach(this.add);
	}
	this.add = function(card){
		var yakutypes = [];
		this.yakus.forEach(function(yaku){
			yaku.add(card);
		});
	};
}

function YakuState(){
	this.yakus = [new Kou(), new Tane(), new Inoshikachou(), new Akatan(), new Aotan(), new AkatanAotannoChoufuku(), new Tanzaku(), new Tsukimizake(), new Hanamizake(), new Kasu()];
	this.add = function(card){
		var yakutypes = [];
		this.yakus.forEach(function(yaku){
			yaku.add(card);
		});
	};
}
