/* jshint loopfunc:true */
'use strict';

const request = require('request');

const config = require('../config/configVars.json');

const contactController = {

	createContact	: function (req, res, next) {
	
		if (req.body.contactId) {

			next();

		}
		else {

			// Build API URL path for contact creation
			let apiURL = "https://" + config.acct + ".infusionsoft.com/api/xmlrpc/";

			let FirstName		= 'CallRail - ' + req.body.customer_name;
			let LastName 		= req.body.customer_name || ""; 
			let Email			= req.body.customer_phone_number + '@callrail.com'; 
			let Phone1 			= req.body.formatted_customer_phone_number || ""; 
			let City 			= req.body.customer_city || ""; 
			let State 			= req.body.customer_state || ""; 
			let PostalCode 		= req.body.customer_zip || ""; 
			let Country			= req.body.customer_country || "";
			let dupCheck		= req.body.customer_phone_number;

			// Get the Infusionsoft API access key associated with the account where this contact is being created
			let keyBuild = config.key;

			// Populate the variables into the API submission string
			let submissionBody = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>ContactService.addWithDupCheck</methodName><params><param><value><string>' + keyBuild + '</string></value></param><param><value><struct><member><name>FirstName</name><value><string>' + FirstName + '</string></value></member><member><name>LastName</name><value><string>' + LastName + '</string></value></member><member><name>Email</name><value><string>' + Email + '</string></value></member><member><name>Phone1</name><value><string>' + Phone1 + '</string></value></member><member><name>City</name><value><string>' + City + '</string></value></member><member><name>State</name><value><string>' + State + '</string></value></member><member><name>' + config.dupCheckField + '</name><value><string>' + dupCheck + '</string></value></member><member><name>PostalCode</name><value><string>' + PostalCode + '</string></value></member><member><name>Country</name><value><string>' + Country + '</string></value></member></struct></value></param><param><value><string>Email</string></value></param></params></methodCall>';

			// Send the request to the Infusionsoft API
			request ({
				method	: 'POST',
				url		: apiURL,
				headers	: {'Content-Type' : 'application/xml'},
				body	: submissionBody
			}, function (err, resp, body) {

				console.log('API Add Contact with Dup Check Response Body: ' + body);

				if (err) {
					res.sendStatus(200);
					return console.log('Request to API not sent: ', err);
				}
				else if (body.includes('faultCode')) {
					console.log('Database Error - Contact Record Not Loaded');
					res.sendStatus(200);
				}
				else {
					let newId = body.split('<value><i4>')[1].split('</i4></value>')[0];
					req.body.newContactId = newId;
					console.log('Contact Record ' + newId + ' Created/Updated in Application ' + config.acct);
					next();
				}
			});
		}
	}
};

module.exports = contactController;