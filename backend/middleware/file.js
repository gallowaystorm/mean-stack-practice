const multer = require('multer');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

//for multer to know where to put files 
const storage = multer.diskStorage( {
    //cb = callback
    destination: (req, file, cb) => {
        //check if mimetype is valid on server side
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) { 
            error = null;
        }
        //images will be stored in backend/images
        cb(error, "../backend/images");
    },
    //tell multer what the file name will be 
    filename: (req, file, cb) => {
        //change name to lowercase and then replace white space with -
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        //create the name of the file with extention
        cb(null, name + '-' + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');