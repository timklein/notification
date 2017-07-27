'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const query = require ('./controllers/queryController.js');
const contact = require ('./controllers/contactController.js');

const app = express();

app.use(bodyParser.json());

// Create Contact Route - Find source data, create contact record in referral account, find & apply referral tag to new record
app.post('/incoming/callrail', query.findContact, contact.createContact);

const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});