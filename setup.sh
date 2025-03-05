#!/bin/bash

# Setup Tee Time Tables necessary for svelte application to work

# Define variables
CONTAINER_NAME="db" # Change this to your actual container name
DB_NAME="postgres"
DB_USER="postgres"

# SQL command to create the table
SQL_COMMAND="
CREATE TABLE IF NOT EXISTS tee_times (
    id TIMESTAMP PRIMARY KEY,
    time TIME NOT NULL,
    price DECIMAL NOT NULL,
    min_players INT NOT NULL,
    max_players INT NOT NULL,
    holes INT NOT NULL
);
"

# Execute psql inside the running PostgreSQL container
docker compose exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "$SQL_COMMAND"

echo "Table 'tee_times' created successfully!"
