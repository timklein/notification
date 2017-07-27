/* jshint loopfunc:true */
'use strict';

const request = require('request');

const config = require('../config/configVars.json');

const queryController = {

	findContact	: function (req, res, next) {
	
		// Build API URL path for contact query
		let apiURL = "https://" + config.acct + ".infusionsoft.com/api/xmlrpc/";

		let dupCheck = req.body.customer_phone_number;

		// Get the Infusionsoft API access key associated with the account where searching for the contact
		let keyBuild = config.key;

		// Populate the variables into the API submission string
		let submissionBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>DataService.query</methodName><params><param><value><string>' + keyBuild + '</string></value></param><param><value><string>Contact</string></value></param><param><value><int>5</int></value></param><param><value><int>0</int></value></param><param><value><struct><member><name>' + config.dupCheckField + '</name><value><string>' + dupCheck + '</string></value></member></struct></value></param><param><value><array><data><value><string>Id</string></value></data></array></value></param><param><value><string>Id</string></value></param><param><value><boolean>1</boolean></value></param></params></methodCall>';

		// Send the request to the Infusionsoft API
		request ({
			method	: 'POST',
			url		: apiURL,
			headers	: {'Content-Type' : 'application/xml'},
			body	: submissionBody
		}, function (err, resp, body) {

			console.log('API Dup Check Contact Response Body: ' + body);

			if (err) {
				res.sendStatus(200);
				return console.log('Request to API not sent: ', err);
			}
			else if (body.includes('faultCode')) {
				console.log('Database Error - Contact Record Not Loaded');
				res.sendStatus(200);
			}
			else if (body.includes('<value><i4>')) {
				req.body.contactId = body.split('<value><i4>')[1].split('</i4></value>')[0];
				console.log('Contact Record ' + req.body.contactId + ' Already Exists in Application ' + config.acct);
				next();
			}
			else {
				next();
			}
		});
	}
};

module.exports = queryController;