/* Dependencies */
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

/* Multer Configurations */
module.exports = {

    /* Send the file to tmp/uploads */
    dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
    storage: multer.diskStorage({

        /* Send the file to tmp/uploads */
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
        }, 

        /* Add a hash to the file name */
        filename: (req, file, callback) => {

            /* Make the Hash */
            crypto.randomBytes(16, (err, hash) => {

                /* Verify if exists errors */
                if (err) {
                    callback(err);
                }

				/* Retorn the name with the hash */
                callback(null, `${hash.toString("hex")}-${file.originalname}`);

            });

        }

    }),
    limits: {
        fileSize: 5 * 1024 *1024 /* Limit the file size to 5MB */
    },
    fileFilter: (req, file, callback) => {
        
        /* File Types */
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/jpg'
        ];

        /* Verify the type */
        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Invalid file type"));
        }
    }

}