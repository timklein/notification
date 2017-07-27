'use strict';

const admin = require("firebase-admin");

const config = require('../config/configVars.json');

const serviceAccount = require(config.serviceAcctString);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: config.dbURLString
});

const notificationController = {

	notifyClient : function (req, res) {

		let contactId = req.body.contactId || req.body.newContactId;

		// The Client Token for Message Destination
		let registrationToken = config.clientToken;

		var payload = {
			"notification": {
				"title": "Incoming Prospect Call",
				"body": req.body.formatted_customer_phone_number,
				"icon": "http://138.68.14.56/img/infusionsoft-logo.png",
				"click_action": "https://" + config.acct + ".infusionsoft.com/app/searchResults/searchResult?searchResult=" + contactId
			}
		};

		// Send a message to the device corresponding to the registratin token
		admin.messaging().sendToDevice(registrationToken, payload)
		.then(function(response) {
			console.log("Successfully sent message:", response);
			res.sendStatus(200);
		})
		.catch(function(error) {
			console.log("Error sending message:", error);
			res.sendStatus(200);
		});
	}
};

module.exports = notificationController;
