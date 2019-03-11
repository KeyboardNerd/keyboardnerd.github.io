from dateutil import tz

with open('mysql-slowquery.log') as f:
	with open('that_log_1.csv', 'w+') as log:
		log.write(','.join(['query_time', 'lock_time', 'timestamp (GMT-4 (EDT))', 'query']))
		lines = f.readlines()
		unique = set()
		i = 0
		block_count = 0
		import datetime
		import json
		while i < len(lines):
			block = None
			if '# Time: ' in lines[i]:
				i += 1
				continue

			if '# User@Host: quayio[quayio]' in lines[i]:
				i += 1
				count = 0
				while i < len(lines) and '# User@Host: quayio[quayio]' not in lines[i] and '# Time: ' not in lines[i]:
					if '# Query_time: ' in lines[i]:
						count = 1
						query_time = float(lines[i].split('# Query_time: ')[1].split(' ')[0])
						lock_time = float(lines[i].split('Lock_time: ')[1].split(' ')[0])
					if 'SET timestamp' in lines[i]:
						count = 2
						ts = datetime.datetime.utcfromtimestamp(int(lines[i].split('=')[1].split(';')[0])).replace(tzinfo=tz.tzutc()).astimezone(tz.tzlocal()).strftime('%m/%d/%Y %H:%M:%S %Z')

					elif count == 2:
						query = lines[i]
					i += 1
				block_count += 1
				block = ','.join([str(query_time), str(lock_time), ts, "\""+query+"\""]) + '\n'
				log.write(block)
				continue

			print 'invalid line=', lines[i]
			i += 1
		
		print block_count
