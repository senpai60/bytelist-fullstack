import multer from "multer";
import sizeOf from "buffer-image-size";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter:(req,file,cb)=>{
    if (file.mimetype.startsWith('image/')) {
        cb(null,true)
    }else{
        cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const validateImage = (buffer) =>{
    const dimensions = sizeOf(buffer)
    if (dimensions.width < 100 || dimensions.height < 100) {
        throw new error ('Image too small!')
    } 
}

export default upload;
export {validateImage}