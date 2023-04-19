echo "Waiting for db"
./wait-for mysql-db:3306

echo "Starting server"
nodemon index.js