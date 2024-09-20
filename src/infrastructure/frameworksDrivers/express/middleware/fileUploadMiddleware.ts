import multer from "multer";
import path, { dirname } from "path";
import fs, { mkdir } from 'fs'



const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    console.log(file)
    const uploadDistination = path.join(__dirname,'../../../../uploads/posts')
    
     if(!fs.existsSync(uploadDistination)){
    fs.mkdirSync(uploadDistination,{ recursive: true })
     }
    return cb(null,uploadDistination)
  },

  filename:(req,file,cb)=>{
    return cb(null ,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }

})


const profileImageStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    const uploadDistination = path.join(__dirname,'../../../../uploads/profiles')
    if(!fs.existsSync(uploadDistination)){
    fs.mkdirSync(uploadDistination,{ recursive: true })
  }
   return cb(null ,uploadDistination)
},

filename:(req,file,cb)=>{
  return cb(null ,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
}
}
)



export const uploadMiddleware = multer({storage}).array('files')

export const uploadSingleImageMiddleware = multer({storage:profileImageStorage}).single('profileImage')