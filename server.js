'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve index.html for the root route
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// Serve issues.html for the issues page
app.route('/issues.html')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issues.html');
  });

// Testing and API routes
fccTestingRoutes(app);
apiRoutes(app);  

// Handle 404 errors
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 10000);
  }
});

module.exports = app;
