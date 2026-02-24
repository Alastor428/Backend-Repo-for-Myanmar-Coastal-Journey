import multer from 'multer';
import * as path from 'path';
//diskstorage

const storage = multer.diskStorage({

    //destination folder to store uploaded files
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },

  //filename inside folder with custom extension
  filename: function (req, file, cb) {
    const nameWithoutExt = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);

    cb(null, `${nameWithoutExt}-${Date.now()}${ext}`);
     //Date.now() prevent duplicate filenames
  }
});

// file filter to accept only images
function fileFilter (req, file, cb) {

    if (file.mimetype.startsWith("image/")){
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

//initialize multer instance
export const upload = multer({ storage, fileFilter });

