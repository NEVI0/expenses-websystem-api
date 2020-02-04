/* Dependencies */
const admin = require("firebase-admin");
const fs = require("fs");

/* Configurations */
admin.initializeApp({
	credential: admin.credential.cert({
		clientEmail: process.env.CLIENT_EMAIL,
		projectId: process.env.PROJECT_ID,
		privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
	}),
	storageBucket: process.env.FB_BUCKET_NAME
});

/* Bucket */
const bucket = admin.storage().bucket();

/* Enable the Config Vars */
require("dotenv").config();

/* Function that updload the user image to Firebase */
const uploadImageToFirebase = async (file) => {
	try {
		/* Verify if the file exists */
		if (!file) {
			return false;
		}

		/* Send the image to the firebase */
		await bucket.upload(file.path).then(resp => {
			/* Remove the file from the project */
			fs.unlink(file.path, err => console.log(`File System Error: ${err}`));			
			return true;
		}).catch(err => {
			/* Remove the file from the project */
			fs.unlink(file.path, err => console.log(`File System Error: ${err}`));
			return false;
		});
	} catch (err) {
		return false;
	}

}

/* Exports the Function */
module.exports = { uploadImageToFirebase }