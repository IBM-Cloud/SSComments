# Subreddit Simulator Comment Aggregator

## Running the Dev Environment

After cloning the repo, all you need to is run:

    npm install
    npm run dev

That will serve an unminified bundle with source maps at `localhost:3000`. It
also kicks off a watchify to update the browserify bundle as client-side code
updates, and will rebuild the css as the less files change.

## Running in production

In production, we simply

    npm install
    npm run build
    npm run start

This builds our minified production bundle with no source maps and serves it.