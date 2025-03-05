#!/bin/bash

# Setup Tee Time Tables necessary for svelte application to work

# Define variables
CONTAINER_NAME="db" # Change this to your actual container name
DB_NAME="postgres"
DB_USER="postgres"

# SQL command to create the table
SQL_COMMAND="
CREATE TABLE IF NOT EXISTS tee_times (
    id TIMESTAMPTZ PRIMARY KEY,
    time TIME NOT NULL,
    price DECIMAL NOT NULL,
    min_players INT NOT NULL,
    max_players INT NOT NULL,
    holes INT NOT NULL
);
"

INSERT_COMMAND="
INSERT INTO tee_times (id, time, price, min_players, max_players, holes)
VALUES 
    ('2025-03-05T14:40:00.000Z', '23:30', 50.00, 2, 4, 18),
    ('2025-03-06T09:15:00.000Z', '09:15', 42.00, 1, 4, 9),
    ('2025-03-07T12:00:00.000Z', '12:00', 60.00, 3, 4, 18);
"

# Execute psql inside the running PostgreSQL container
docker compose exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "$SQL_COMMAND"

echo "Table 'tee_times' created successfully!"

# Execute psql inside the running PostgreSQL container
docker compose exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "$INSERT_COMMAND"

echo "Added 3 items successfully!"
