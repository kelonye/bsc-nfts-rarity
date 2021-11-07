o?=$o

www:
	@NODE_PATH=./src:$NODE_PATH ./node_modules/.bin/nodemon bin/www.ts

prd:
	@NODE_PATH=./src:$NODE_PATH NODE_ENV=production ./node_modules/.bin/pm2 start

rate:
	@NODE_PATH=./src:$NODE_PATH slug=$(o) ./node_modules/.bin/ts-node bin/load-rate-nfts.ts

.PHONY: \
	www \
	prd \
	load-rate-nfts

