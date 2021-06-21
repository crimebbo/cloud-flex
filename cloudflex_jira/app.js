// Entry point for the app

// Express is the underlying that atlassian-connect-express uses:
// https://expressjs.com
import express from 'express';

// https://expressjs.com/en/guide/using-middleware.html
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
var jwt = require('atlassian-jwt');

// atlassian-connect-express also provides a middleware
import ace from 'atlassian-connect-express';
const cors = require('cors');
// Use Handlebars as view engine:
// https://npmjs.org/package/express-hbs
// http://handlebarsjs.com
import hbs from 'express-hbs';
const https = require('https');
const fs = require("fs");
// We also need a few stock Node modules
import http from 'http';
import path from 'path';
import os from 'os';
import helmet from 'helmet';
import nocache from 'nocache';
const logger = require('./logger');

// Routes live here; this is the C in MVC
import routes from './routes';
import { addServerSideRendering } from './server-side-rendering';

// Bootstrap Express and atlassian-connect-express
const app = express();
const addon = ace(app);

// See config.json
const port = addon.config.port();
app.set('port', port);
app.use(cors());
// Log requests, using an appropriate formatter by env
const devEnv = app.get('env') === 'development';
console.log('isDevelopment',devEnv);
app.use(morgan(devEnv ? 'dev' : 'combined'));

// Configure Handlebars
const viewsDir = path.join(__dirname, 'views');
const handlebarsEngine = hbs.express4({partialsDir: viewsDir});
app.engine('hbs', handlebarsEngine);
app.set('view engine', 'hbs');
app.set('views', viewsDir);

// Configure jsx (jsx files should go in views/ and export the root component as the default export)
addServerSideRendering(app, handlebarsEngine);

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
// HSTS must be enabled with a minimum age of at least one year
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: false
}));
app.use(helmet.referrerPolicy({
  policy: ['origin']
}));

// Include request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Gzip responses when appropriate
app.use(compression());

// Include atlassian-connect-express middleware
app.use(addon.middleware());

// Mount the static files directory
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
app.use(nocache());

// Show nicer errors in dev mode
if (devEnv) app.use(errorHandler());

// Wire up routes
routes(app, addon,jwt,logger);

// Boot the HTTP server
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync( 'server.crt'),
  passphrase: 'test'
};
// Boot the HTTP server
if (devEnv){
  http.createServer(app).listen(port, () => {
    logger.info('App server running at http://' + os.hostname() + ':' + port);

    // Enables auto registration/de-registration of app into a host in dev mode
    if (devEnv) addon.register();
  });
}else {
  https.createServer(options, app).listen(port, () => {
    logger.info('App server running at https://' + os.hostname() + ':' + port);

    // Enables auto registration/de-registration of app into a host in dev mode
  });
}