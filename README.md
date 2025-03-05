# Tee Time Platform

This project demonstrates building a simple web scraper and website to display available tee times.

## Requirements

To setup this project fully, these are the stacks I used.

**Frontend** - SvelteKit
**Backend** - SvelteKit
**Web Scraping** - Playwright
**Database** - PostgresQL (Docker)
**Database Driver** - postgres
**Docker Compose** - Containerization

## Installation & Setup

Run `npm i` to install sveltekit, web scraping and backend packages

### WebScraper Setup

Run `npx playwright install chromium` to install chromium browser required by playwright to scrape data.
Running script would fail otherwise.

### Postgresql Setup
This project contains a docker-compose file which would help you setup postgres in it's seperate container.
To setup, do the following

`docker compose up -d`

This builds the postgres image and starts up the container. By default, compose file exposes `5432` port to the local machine.


### Database Setup

We need to create the table which would store our tee time data.
By default, this project reuses the default connection values provided by postgres docker container during container creation.

However, a helper script in current working directory exists to create a new table named `tee_times`.
It also populates your DB with random values, so you have something to work with.

To set this up, run the following:

`bash setup.sh`

Alternatively, you could copy the contents of that file and run in your terminal if you have issues
working with bash.

Your Database and Tables are all setup!


## Usage

To ensure proper application usage, there are three main actions you would usually take.

- **Browse Tee Times**
- **Perform CRUD operations on Tee Time Data**
- **Run the web scraping script to fetch tee times for the current day and save in our database**

To browse tee times and perform crud operations on tee time data, we need our svelte server running locally.
We can do this by running `npm run dev` or `npm run dev -- --open` if you want endpoint opened in a browser tab.

Upon visiting the home page, you would be presented with a simple interface showing a table with a list of tee times.
If there are no tee times saved in the database, you would see nothing. That's where running the web scraping script comes in handy.

### WebScraper Usage

The web scraping script fetches daily tee time data from `https://commonground-golf-course.book.teeitup.com/` and saves this into PostgreSQL.
To run webscraper tool, it's as simple as running `npm run scrape`.



## Improvements

Looking at the current implementation, these are my choices if I had more time on this:

- Better User Interface
- Proper State Handling on Svelte (This was sufficient for the task at hand but can be refactored to look neater)
- Proper Setup of Postgres without resorting to postgres defined defaults.
- Create a page for users to create tee time data and save to the database.
- Proper environment handling for svelte and postgres

