'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const query = require ('./controllers/queryController.js');
const contact = require ('./controllers/contactController.js');
const notify = require ('./controllers/notificationController.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Create Contact Route - Find source data, create contact record in referral account, find & apply referral tag to new record
app.post('/incoming/callrail', query.findContact, contact.createContact, notify.notifyClient);

app.post('/incoming/token', function (req, res) {
	console.log(req.body.token);
	res.sendStatus(200);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});