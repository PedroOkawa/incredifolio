const path = require('path');
const multer = require('multer');

module.exports = {
    /* MULTER UPLOAD MODULE */
    upload: multer({ storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/')
        },
        filename: function (req, file, cb) {
            console.log(file);
            cb(null, file.fieldname + '-' + Date.now());
        }
    }),
    	fileFilter: function (req, file, cb) {
        	var filetypes = /jpeg|jpg|png/;
        	var mimetype = filetypes.test(file.mimetype);
        	var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    	    if (mimetype && extname) {
    	      return cb(null, true);
    	    }

    		return cb(new Error('Only JPG\'s and PNG\' are allowed'));
    	}
    })
}