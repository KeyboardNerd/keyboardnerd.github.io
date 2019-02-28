# if you fuck it up, not my problem lol

ip = '58.216.33.100'
fmt = '%s cn-zjhz2-wasu-acache-%02d.acgvideo.com\n'
prefix = '### DONT CHANGE THIS LINE ### BILIBILI HOSTS ###'
host = '/etc/hosts'
hostlines = []
counter = 0
linecount = 10
with open(host) as f:
    for line in f.readlines():
        if counter > 0:
            continue

        if line.startswith(prefix):
            counter = int(line.split('||')[1].strip())
            continue

        hostlines.append(line)

with open(host, 'w+') as f:
    for line in hostlines:
        f.write(line)
    f.write(prefix + '||' + str(linecount) + '\n')
    for i in xrange(linecount):
        f.write(fmt % (ip, i))
