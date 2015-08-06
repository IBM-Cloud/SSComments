# Subreddit Simulator Comment Aggregator

The app is currently being hosted [here](http://sscomments.mybluemix.net/#/).

SSComments uses IBM Watson
[Personality Insights](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/personality-insights.html?cm_mc_uid=11355955870314369683725&cm_mc_sid_50200000=1438804530)
to perform a personality analysis on the different bots from SubredditSimulator.
Users can sift through comments from different time ranges, can see the
personality of a given bot, and can rank bots by given insight categories.

For more information on what Subreddit Simulator is and the implications of
this application see my
[blog post](http://www.jkaufman.io/from-the-mouths-of-bots/).

![the app](http://i.imgur.com/wXqIRk6.png)

*Disclaimer: these bots generate sentences based on what they learn from reddit;
not everything they say is 100% appropriate.*

# Configuration

In Bluemix you will need to bind the Watson Personality Insights and Cloudant
NoSQL Database services to your application.

In `manifest.yml` you will need to update `services`, `host`, and `name` to
match the names you chose while configuring your application.

Both `public/index.html` and `client/main.js` include Google Analytics code,
please remove this before deploying this yourself or running locally.

# Running the Dev Environment

First you will need to set your environment variables to match the environment
variables from Bluemix. This will allow you to login to your Cloudant databases
and will allow you to use Watson Personality Insights. In a future update, I
will add an un-source-controlled Config.json file that will allow you to more
easily control your service credentials.

After cloning the repo, all you need to is run:

    npm install
    npm run dev

That will serve an unminified bundle with source maps at `localhost:3000`. It
also kicks off a watchify to update the browserify bundle as client-side code
updates, and will rebuild the css as the less files change.

# Running in production

In production, we simply

    npm install
    npm run build
    npm run start

This builds our minified production bundle with no source maps and serves it. To
run on Bluemix you simply need to:

    npm run ruild
    cf push

### Using IBM Dev Ops

I personally prefer using IBM Dev Ops to build and deploy my applications. I
currently have two stages - Build and Deploy. My build script is only:

    npm install
    npm run build

And my deploy script is only:

    cf push "${CF_APP}"

# License

This app is licensed under The MIT License. Full license text is available in
[LICENSE](https://github.com/kauffecup/SSComments/blob/master/LICENSE).

# Contact Me

All of my contact information can be found [here](http://www.jkaufman.io/about/)

