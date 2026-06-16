import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(os.tmpdir()));
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage })

export default upload