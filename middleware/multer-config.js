
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    filename: (req, file, callback) => {
        const name = file.originalname.replace(' ', '_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');

const convertToWebp = (req, res, next) => {

    if (req.file && req.file.path) {
        const originalImagePath = req.file.path;
        const outputPath = req.file.path.replace(/\.[^.]+$/, '.webp');


        sharp(originalImagePath)
            .toFormat('webp')
            .resize({
                width: 800,
                height: 800,
                fit: 'contain'
            })
            .toFile(outputPath)
            .then(() => {

                if (fs.existsSync(originalImagePath)) {
                    console.log('Image file exists !!!');
                    fs.unlinkSync(originalImagePath);
                }

                console.log('Path image: ' + req.file.path);
                req.file.path = outputPath.replace('images\\', '');

                next();
            })
            .catch(error => {
                console.error('Error converting image to webp:', error);
                next();
            });
    } else {

        next();
    }
};

module.exports.convertToWebp = convertToWebp;