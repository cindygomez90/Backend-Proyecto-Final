const path = require('path')
const multer = require('multer')

const destination = (req, file, cb) => {
    let folder
    if (file.fieldname === 'profiles') {
        folder = 'profiles'
    } else if (file.fieldname === 'products') {
        folder = 'products'
    } else if (file.fieldname === 'documents') {
        folder = 'documents'
    } else {
        cb(new Error('Invalid fieldname'));
    }
    cb(null, path.join(__dirname, `../public/${folder}`))
}

const storage = multer.diskStorage({
    destination: destination,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const uploader = multer({ storage: storage })

module.exports = { uploader } 




