var Promise = require('bluebird');

// couldn't figure out how to make JSON environment variables locally so i
// set it to a stringified JSON object of the deployed environment variables
var cloudantNoSQLDB;
if (typeof process.env.VCAP_SERVICES === 'string') {
  cloudantNoSQLDB = JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB;
} else {
  cloudantNoSQLDB = process.env.VCAP_SERVICES.cloudantNoSQLDB;
}

// configure the credentials object
var credentials = cloudantNoSQLDB[0].credentials;
var dbCredentials = {
  dbName: 'ss_comments_db',
  host: credentials.host,
  port: credentials.port,
  password: credentials.password,
  url: credentials.url,
  user: credentials.username
};

// init the db connection
console.log('creating comments db connection...');
var cloudant = require('cloudant')(dbCredentials.url);
var db = Promise.promisifyAll(cloudant.use(dbCredentials.dbName));

// export a promisified version of the cloudant db
module.exports = db;