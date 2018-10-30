const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


// set storage engine
const storage = multer.diskStorage({
    destination :'./public/uploads/',
    filename: function (req,file,cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});


// Check File Type
function checkFileType(file ,cb){
    // allowed extensions

    const filetypes = /jpeg|jpg|png|gif/;

    //check extension
    const extname = filetypes.test(path.extname
    (file.originalname).toLowerCase());

    // Check Mime type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else {
        cb('Error: Images Only!!!');
    }

}


// Init Upload
const upload = multer({
    storage : storage,
    limits: {fileSize : 1000000},
    fileFilter: function (req,file,cb) {
        checkFileType(file,cb);
    }
}).single('myImage');


// Init App0

const app = express();

//Ejs
app.set('view engine','ejs');

// Public Folder
app.use(express.static('./public'));


app.post('/uploads',(req,res)=>{
   upload(req,res ,(err) =>{
       if(err){
           res.render('index',{msg : err});
       }
       else
       {
           if(req.file === undefined){
               res.render('index',{msg : 'No File Selected'});
           }else {
               res.render('index',
                   {
                       msg:'File Uploaded',
                       file:`uploads/${req.file.filename}`
                   });
           }
       }
   });
});


app.get('/',(req,res)=>{
   res.render('index');
});









const port = 3000;

app.listen(port ,()=>console.log(`Server Started on port ${port}`));