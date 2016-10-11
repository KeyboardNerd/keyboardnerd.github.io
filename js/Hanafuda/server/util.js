function shuffle(array){
	var ind = array.length - 1; var tmp = 0; var rand_ind = 0;
	while (ind >= 0){
		tmp = array[ind];
		rand_ind = Math.floor(Math.random()*(ind+1))
		array[ind] = array[rand_ind];
		array[rand_ind] = tmp;
		ind --;
	}
}
