# -*- coding: utf-8 -*-
import json
import base64
CATEGORIES = ['光', '種', '短冊', 'カス']
POINTS = [20,10,5,1]
CARD_NAMES = ['松に鶴','桜に幕','芒に月','柳に小野道','桐に鳳凰','梅に鴬','藤に不如帰','菖蒲に八橋','牡丹に蝶','萩に猪'
				 ,'芒に雁','菊に盃','紅葉に鹿','柳に燕','松に赤','梅に赤','桜に赤短','藤に短冊','菖蒲に短冊','牡丹に青短'
				 ,'萩に短冊','菊に青短','紅葉に青短','柳に短冊','松のカス','梅のカス','桜のカス','藤のカス','菖蒲のカス'
				 ,'牡丹のカス','萩のカス','芒のカス','菊のカス','紅葉のカス','柳のカス','桐のカス']
MONTHES = ['matsu', 'ume', 'sakura','fuji','ayame','botan','hagi','susuki','kiku','momiji','yanagi','kiri']
MONTH_LIST = [0,2,7,10,11,1,3,4,5,6,7,8,9,10,0,1,2,3,4,5,6,8,9,10,0,1,2,3,4,5,6,7,8,9,10,11]
CATEGORIES_LIST = [0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3]
REPETITION_LIST = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,3]
pics = ['Kintengu_01s.png','Kintengu_03s.png','Kintengu_08s.png','Kintengu_11s.png','Kintengu_12s.png'
			,'Kintengu_02s.png','Kintengu_04s.png','Kintengu_05s.png','Kintengu_06s.png','Kintengu_07s.png','Kintengu_08h.png','Kintengu_09s.png','Kintengu_10s.png','Kintengu_11h.png'
			,'Kintengu_01h.png','Kintengu_02h.png','Kintengu_03h.png','Kintengu_04h.png','Kintengu_05h.png','Kintengu_06h.png','Kintengu_07h.png','Kintengu_09h.png','Kintengu_10h.png','Kintengu_11d.png'
			,'Kintengu_01c.png','Kintengu_01d.png','Kintengu_02c.png','Kintengu_02d.png','Kintengu_03c.png','Kintengu_03d.png','Kintengu_04c.png','Kintengu_04d.png','Kintengu_05c.png','Kintengu_05d.png','Kintengu_06c.png','Kintengu_06d.png','Kintengu_07c.png','Kintengu_07d.png','Kintengu_08c.png','Kintengu_08d.png','Kintengu_09c.png','Kintengu_09d.png','Kintengu_10c.png','Kintengu_10d.png','Kintengu_11c.png','Kintengu_12c.png','Kintengu_12d.png','Kintengu_12h.png'
			]
def init():
	dictionary = {}
	ind = 0
	for i in xrange(len(REPETITION_LIST)):
		for j in xrange(REPETITION_LIST[i]):
			dictionary[ind] = {'name': CARD_NAMES[i], 'point': POINTS[CATEGORIES_LIST[i]], 'month': MONTH_LIST[i], 'category': CATEGORIES_LIST[i], 'id': ind}
			ind += 1
	return dictionary
def read_img():
	prefix = 'pics/'
	ind = 0
	dictionary = {}
	for i in pics:
		with open(prefix+i,'rb') as image:
			dictionary[ind] = base64.b64encode(image.read())
			ind += 1
	return dictionary
def cat():
	i = 0;
	r = {}
	for n in CATEGORIES:
		r[i] = n;
		i += 1;
	return r
def yaku():
	r = {}
	yakus = ['三光','四光','雨四光','五光','猪鹿蝶','タネ','赤短','青短','赤短・青短の重複','短冊','月見酒','花見酒','カス','手四','くっつき']
	points = [6,8,7,15,5,1,5,5,10,1,5,5,1, 6, 6]
	for i in xrange(len(yakus)):
		r[i] = {'name': yakus[i], 'point': points[i]}
	return r
d = init()
img = read_img()
cards = { 'yaku': yaku(), 'category': cat(), 'cards': d, 'images': img}
json.dump(cards, open('result', 'w+'))