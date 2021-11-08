o?=$o

www:
	@NODE_PATH=./src:$NODE_PATH ./node_modules/.bin/nodemon bin/www.ts

prd:
	@NODE_PATH=./src:$NODE_PATH NODE_ENV=production ./node_modules/.bin/pm2 start

load:
	@NODE_PATH=./src:$NODE_PATH slug=$(o) ./node_modules/.bin/ts-node bin/load-nfts.ts

rate:
	@NODE_PATH=./src:$NODE_PATH slug=$(o) ./node_modules/.bin/ts-node bin/rate-nfts.ts

.PHONY: \
	www \
	prd \
	load \
	rate
