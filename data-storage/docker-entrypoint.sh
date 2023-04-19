echo "Waiting for db"
./wait-for database:27017

echo "Migrating database"
# npm run "db:app"
migrate-mongo up

echo "Starting server"
nodemon index.js