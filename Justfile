dbmate := "docker-compose run migrate"

# Start a development instance with docker-compose
default: dev

# +-- RUNNING STUFF --+

# Start a development instance with docker-compose
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start a production instance with discord-compose
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Run tests in Docker
test:
	docker-compose -f docker-compose.yml -f ./test/docker-compose.test.yml up --build

# +-- DATABASE STUFF --+

# Run a database migration
db-migrate:
	{{dbmate}} up

# Revert a database migration
db-revert:
	{{dbmate}} down

# Drop the database
db-drop:
	{{dbmate}} drop

# Create a new database migration
db-new name:
	{{dbmate}} new {{name}}

# Recreate the database
db-recreate: db-drop db-migrate

# +-- MISC STUFF --+

# Transpile the TypeScript files into JavaScript
build: setup
	yarn run compile

# Delete previously built files and rebuild
clean-build: setup
	yarn run clean
	just build

# Clean up the dir. This should (mostly) remove files that are in .gitignore
clean:
	-yarn run clean
	rm -rf ./node_modules
	rm -f *.log
	rm -f *.vim

# Run the initial setup process. This is most useful after running `just clean`
setup:
	yarn --freeze-lockfile

# vim:ft=make
